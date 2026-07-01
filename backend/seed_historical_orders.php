<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Schema;

// Disable foreign keys and truncate
Schema::disableForeignKeyConstraints();
Order::truncate();
Schema::enableForeignKeyConstraints();

// Fetch products
$products = Product::all();
if ($products->isEmpty()) {
    echo "No products found in the database. Please run the product seeder first.\n";
    exit(1);
}

// Fetch customer users
$users = User::where('role', 'customer')->get();
$userIds = $users->pluck('id')->toArray();
// Add null for guest orders
$userIds[] = null;

// Helper to generate a random date between two dates
function randomDate($startDate, $endDate) {
    $min = strtotime($startDate);
    $max = strtotime($endDate);
    $val = mt_rand($min, $max);
    return date('Y-m-d H:i:s', $val);
}

// Generate 400 realistic historical orders spread across 2024, 2025, and 2026
$totalOrders = 400;
$statuses = ['Selesai', 'Selesai', 'Selesai', 'Selesai', 'Selesai', 'Selesai', 'Selesai', 'Selesai', 'Selesai', 'Sedang Diproses', 'Pending', 'Dibatalkan'];
$paymentStatuses = ['Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Unpaid', 'Failed'];

echo "Generating $totalOrders historical orders...\n";

for ($i = 0; $i < $totalOrders; $i++) {
    // 1. Pick a random date
    // We want dates spread from Jan 1, 2024 to July 2, 2026
    $createdAt = randomDate('2024-01-01 08:00:00', '2026-07-02 02:00:00');
    $updatedAt = date('Y-m-d H:i:s', strtotime($createdAt) + rand(300, 1800)); // 5 to 30 mins later
    
    // 2. Pick a random user
    $userId = $userIds[array_rand($userIds)];
    $user = $userId ? $users->where('id', $userId)->first() : null;
    
    // 3. Generate random items (1 to 3 items per order)
    $itemCount = rand(1, 3);
    $selectedProducts = $products->random(min($itemCount, $products->count()));
    
    $orderItems = [];
    $subtotal = 0;
    foreach ($selectedProducts as $product) {
        $qty = rand(1, 2);
        $subtotal += $product->price * $qty;
        $orderItems[] = [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'qty' => $qty
        ];
    }
    
    // 4. Calculate discount
    $discount = 0;
    if ($userId) {
        // First order discount simulation: 30% chance they get first-order discount
        if (rand(1, 10) <= 3) {
            $discount = round($subtotal * 0.20);
        }
    }
    $totalPrice = $subtotal - $discount;
    
    // 5. Pick status based on date
    // If date is in the past (before July 2026), it's highly likely to be 'Selesai' and 'Paid'
    $isRecent = (strtotime($createdAt) > strtotime('2026-06-25 00:00:00'));
    if (!$isRecent) {
        $status = 'Selesai';
        $paymentStatus = 'Paid';
    } else {
        $randIdx = array_rand($statuses);
        $status = $statuses[$randIdx];
        $paymentStatus = $paymentStatuses[$randIdx];
    }
    
    // 6. Fulfillment details
    $fulfillmentType = rand(1, 10) <= 8 ? 'Dine In' : 'Take Away';
    $tableNumber = ($fulfillmentType === 'Dine In') ? (string)rand(1, 20) : null;
    $guestName = $userId ? null : 'Guest ' . rand(100, 999);
    
    // Create the order
    DB::table('orders')->insert([
        'user_id' => $userId,
        'total_price' => $totalPrice,
        'items' => json_encode($orderItems),
        'status' => $status,
        'payment_status' => $paymentStatus,
        'fulfillment_type' => $fulfillmentType,
        'table_number' => $tableNumber,
        'guest_name' => $guestName,
        'created_at' => $createdAt,
        'updated_at' => $updatedAt
    ]);
}

echo "Successfully seeded $totalOrders historical orders from 2024 to 2026!\n";
