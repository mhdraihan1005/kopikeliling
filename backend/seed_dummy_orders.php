<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Order;
use App\Models\User;
use App\Models\Product;

// Clean existing orders
\Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
Order::truncate();
\Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

// Fetch products for ID mapping
$espresso = Product::where('name', 'Espresso')->first();
$cappuccino = Product::where('name', 'Cappuccino')->first();
$coldbrew = Product::where('name', 'Cold Brew')->first();
$icedlatte = Product::where('name', 'Iced Latte')->first();
$matcha = Product::where('name', 'Premium Matcha Latte')->first();
$palmsugar = Product::where('name', 'Palm Sugar Coffee Milk')->first();
$chocolate = Product::where('name', 'Iced Chocolate Royale')->first();

// Define orders
$orders = [
    [
        'user_id' => 11, // Budi Santoso
        'total_price' => 28000,
        'items' => [
            ['id' => $espresso ? $espresso->id : 1, 'name' => 'Espresso', 'price' => 15000, 'qty' => 1],
            ['id' => $cappuccino ? $cappuccino->id : 2, 'name' => 'Cappuccino', 'price' => 20000, 'qty' => 1]
        ],
        'status' => 'Selesai',
        'payment_status' => 'Paid',
        'fulfillment_type' => 'Dine In',
        'table_number' => '3',
        'guest_name' => null,
        'created_at' => '2026-07-01 10:15:00',
        'updated_at' => '2026-07-01 10:20:00',
    ],
    [
        'user_id' => 12, // Dewi Lestari
        'total_price' => 48000,
        'items' => [
            ['id' => $coldbrew ? $coldbrew->id : 4, 'name' => 'Cold Brew', 'price' => 18000, 'qty' => 2],
            ['id' => $icedlatte ? $icedlatte->id : 5, 'name' => 'Iced Latte', 'price' => 24000, 'qty' => 1]
        ],
        'status' => 'Selesai',
        'payment_status' => 'Paid',
        'fulfillment_type' => 'Dine In',
        'table_number' => '7',
        'guest_name' => null,
        'created_at' => '2026-07-01 12:30:00',
        'updated_at' => '2026-07-01 12:35:00',
    ],
    [
        'user_id' => 13, // Rian Hidayatul
        'total_price' => 18400,
        'items' => [
            ['id' => $matcha ? $matcha->id : 9, 'name' => 'Premium Matcha Latte', 'price' => 23000, 'qty' => 1]
        ],
        'status' => 'Sedang Diproses',
        'payment_status' => 'Paid',
        'fulfillment_type' => 'Dine In',
        'table_number' => '12',
        'guest_name' => null,
        'created_at' => '2026-07-01 14:45:00',
        'updated_at' => '2026-07-01 14:45:00',
    ],
    [
        'user_id' => 14, // Siti Rahma
        'total_price' => 32000,
        'items' => [
            ['id' => $palmsugar ? $palmsugar->id : 7, 'name' => 'Palm Sugar Coffee Milk', 'price' => 18000, 'qty' => 1],
            ['id' => $chocolate ? $chocolate->id : 10, 'name' => 'Iced Chocolate Royale', 'price' => 22000, 'qty' => 1]
        ],
        'status' => 'Pending',
        'payment_status' => 'Unpaid',
        'fulfillment_type' => 'Dine In',
        'table_number' => '5',
        'guest_name' => null,
        'created_at' => '2026-07-01 16:20:00',
        'updated_at' => '2026-07-01 16:20:00',
    ],
    [
        'user_id' => null,
        'total_price' => 20000,
        'items' => [
            ['id' => $cappuccino ? $cappuccino->id : 2, 'name' => 'Cappuccino', 'price' => 20000, 'qty' => 1]
        ],
        'status' => 'Selesai',
        'payment_status' => 'Paid',
        'fulfillment_type' => 'Dine In',
        'table_number' => '10',
        'guest_name' => 'Bambang',
        'created_at' => '2026-07-01 18:00:00',
        'updated_at' => '2026-07-01 18:05:00',
    ],
];

foreach ($orders as $orderData) {
    Order::create($orderData);
}

echo "Seeded 5 realistic dummy orders successfully!\n";
