<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $this->checkExpiredOrders();

        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->role === 'admin') {
            $userId = $request->query('user_id');
            if ($userId) {
                return response()->json(Order::with(['reviews', 'user'])->where('user_id', $userId)->orderBy('created_at', 'desc')->get());
            }
            return response()->json(Order::with(['reviews', 'user'])->orderBy('created_at', 'desc')->get());
        }

        // Customers can only view their own orders
        return response()->json(Order::with(['reviews', 'user'])->where('user_id', $user->id)->orderBy('created_at', 'desc')->get());
    }

    private function checkExpiredOrders()
    {
        // Find orders that are Pending/Unpaid and older than 5 minutes
        $expiredOrders = Order::where('payment_status', 'Unpaid')
            ->where('status', 'Pending')
            ->where('created_at', '<', now()->subMinutes(5))
            ->get();

        foreach ($expiredOrders as $order) {
            // Restore stock
            foreach ($order->items as $item) {
                $product = Product::find($item['id']);
                if ($product) {
                    $product->increment('stock', $item['qty'] ?? $item['quantity'] ?? 1);
                }
            }
            
            // Delete order from database
            $order->delete();
        }
    }

    public function show($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($order->user_id) {
            $token = request()->bearerToken();
            $user = $token ? \App\Models\User::where('remember_token', $token)->first() : null;

            if (!$user || ($user->role !== 'admin' && $user->id != $order->user_id)) {
                return response()->json(['message' => 'Unauthorized to view this order.'], 403);
            }
        }

        return response()->json($order);
    }

    public function store(Request $request)
    {
        $shopStatusSetting = \App\Models\Setting::where('key', 'shop_status')->first();
        $shopStatus = $shopStatusSetting ? $shopStatusSetting->value : 'open';
        if ($shopStatus === 'closed') {
            return response()->json(['message' => 'Ordering is temporarily disabled. The shop is currently closed.'], 403);
        }

        $request->validate([
            'user_id' => 'nullable|integer',
            'total_price' => 'required|integer',
            'items' => 'required|array',
            'fulfillment_type' => 'required|string|in:Dine In,Pickup',
            'table_number' => 'required_if:fulfillment_type,Dine In|nullable|string',
            'guest_name' => 'required_without:user_id|nullable|string'
        ]);

        if ($request->user_id) {
            $token = $request->bearerToken();
            $user = $token ? \App\Models\User::where('remember_token', $token)->first() : null;

            if (!$user || $user->id != $request->user_id) {
                return response()->json(['message' => 'Unauthorized user_id.'], 403);
            }
        }

        // Calculate subtotal from database prices to verify total and apply discount securely
        $subtotal = 0;
        foreach ($request->items as $item) {
            $product = Product::find($item['id']);
            if ($product) {
                $qty = $item['qty'] ?? $item['quantity'] ?? 1;
                $subtotal += $product->price * $qty;
            }
        }

        // Apply 20% discount if the user is a logged-in member with no previous successful orders
        $discount = 0;
        if ($request->user_id) {
            $hasPreviousOrders = Order::where('user_id', $request->user_id)
                ->where(function($query) {
                    $query->where('payment_status', 'Paid')
                          ->orWhereIn('status', ['Completed', 'Processing']);
                })
                ->exists();

            if (!$hasPreviousOrders) {
                $discount = round($subtotal * 0.20);
            }
        }

        $finalPrice = $subtotal - $discount;

        $order = Order::create([
            'user_id' => $request->user_id,
            'total_price' => $finalPrice,
            'items' => $request->items,
            'status' => 'Pending',
            'payment_status' => 'Unpaid',
            'fulfillment_type' => $request->fulfillment_type,
            'table_number' => $request->table_number,
            'guest_name' => $request->guest_name,
        ]);

        // Decrement product stock
        foreach ($request->items as $item) {
            $product = Product::find($item['id']);
            if ($product) {
                $product->decrement('stock', $item['qty'] ?? $item['quantity'] ?? 1);
            }
        }

        \Midtrans\Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        \Midtrans\Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        \Midtrans\Config::$isSanitized = env('MIDTRANS_IS_SANITIZED', true);
        \Midtrans\Config::$is3ds = env('MIDTRANS_IS_3DS', true);

        $user = $request->user_id ? User::find($request->user_id) : null;

        $params = [
            'transaction_details' => [
                'order_id' => $order->id . '-' . time(),
                'gross_amount' => $order->total_price,
            ],
            'customer_details' => [
                'first_name' => $user ? $user->name : ($request->guest_name ?? 'Guest-' . $order->id),
                'email'      => $user ? $user->email : 'guest@example.com',
            ],
            'expiry' => [
                'start_time' => date("Y-m-d H:i:s O"),
                'unit' => 'minute',
                'duration' => 5
            ]
        ];

        try {
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            $order->snap_token = $snapToken;
            $order->save();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to generate payment token', 'error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Order created successfully', 'order' => $order, 'snap_token' => $snapToken], 201);
    }

    public function handleWebhook(Request $request)
    {
        $serverKey = env('MIDTRANS_SERVER_KEY');
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

        if ($hashed == $request->signature_key) {
            // Validate success! Now check status
            $orderIdStr = $request->order_id;
            // order_id is in format 'ID-TIME'. We grab the ID
            $id = explode('-', $orderIdStr)[0];
            $order = Order::find($id);
            
            if ($order) {
                if ($request->transaction_status == 'capture' || $request->transaction_status == 'settlement') {
                    $order->payment_status = 'Paid';
                    if ($order->status == 'Pending') {
                        $order->status = 'Processing';
                    }
                } elseif ($request->transaction_status == 'pending') {
                    $order->payment_status = 'Pending';
                } elseif ($request->transaction_status == 'deny' || $request->transaction_status == 'expire' || $request->transaction_status == 'cancel') {
                    $order->payment_status = 'Failed';
                }
                $order->save();
                return response()->json(['message' => 'success']);
            }
            return response()->json(['message' => 'order not found'], 404);
        }
        return response()->json(['message' => 'invalid signature'], 400);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Get authentication token and user
        $token = $request->bearerToken();
        $user = $token ? \App\Models\User::where('remember_token', $token)->first() : null;

        if ($order->user_id) {
            // Must be admin or the owner of the order
            if (!$user || ($user->role !== 'admin' && $user->id != $order->user_id)) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        } else {
            // Guest order: only admin can modify status, unless they are just updating to Paid status
            if ($request->has('status') && in_array($request->status, ['Processing', 'Completed'])) {
                if (!$user || $user->role !== 'admin') {
                    return response()->json(['message' => 'Admin authorization required.'], 403);
                }
            }
        }

        if ($request->has('status')) {
            $order->status = $request->status;
        }
        if ($request->has('payment_status')) {
            $order->payment_status = $request->payment_status;
        }
        $order->save();
        return response()->json(['message' => 'Status updated successfully']);
    }
}
