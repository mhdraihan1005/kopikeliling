<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\User;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        if ($userId) {
            return response()->json(Order::where('user_id', $userId)->orderBy('created_at', 'desc')->get());
        }
        return response()->json(Order::orderBy('created_at', 'desc')->get());
    }

    public function show($id)
    {
        $order = Order::find($id);
        if ($order) {
            return response()->json($order);
        }
        return response()->json(['message' => 'Order not found'], 404);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'total_price' => 'required|integer',
            'items' => 'required|array'
        ]);

        $order = Order::create([
            'user_id' => $request->user_id,
            'total_price' => $request->total_price,
            'items' => $request->items,
            'status' => 'Pending',
            'payment_status' => 'Unpaid'
        ]);

        \Midtrans\Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        \Midtrans\Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        \Midtrans\Config::$isSanitized = env('MIDTRANS_IS_SANITIZED', true);
        \Midtrans\Config::$is3ds = env('MIDTRANS_IS_3DS', true);

        $user = User::find($request->user_id);

        $params = [
            'transaction_details' => [
                'order_id' => $order->id . '-' . time(),
                'gross_amount' => $order->total_price,
            ],
            'customer_details' => [
                'first_name' => $user ? $user->name : 'Customer-' . $order->user_id,
                'email'      => $user ? $user->email : 'nomail@example.com',
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
                        $order->status = 'Diproses';
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
        if ($order) {
            if ($request->has('status')) {
                $order->status = $request->status;
            }
            if ($request->has('payment_status')) {
                $order->payment_status = $request->payment_status;
            }
            $order->save();
            return response()->json(['message' => 'Status updated successfully']);
        }
        return response()->json(['message' => 'Order not found'], 404);
    }
}
