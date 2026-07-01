<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Setting;
use Illuminate\Support\Facades\Hash;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed basic settings
        Setting::updateOrCreate(['key' => 'shop_status'], ['value' => 'open']);
    }

    /** @test */
    public function a_customer_can_successfully_place_an_order()
    {
        // 1. Create a user and save remember_token explicitly to bypass mass-assignment guard
        $user = User::create([
            'name' => 'QA Customer',
            'email' => 'qa_customer@email.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'is_active' => true
        ]);
        $user->remember_token = 'test_token';
        $user->save();
        
        $product = Product::create([
            'name' => 'Test Espresso',
            'description' => 'Rich aromatic double shot espresso.',
            'price' => 15000,
            'stock' => 5,
            'image' => '/espresso.jpg',
            'rating' => '4.8',
            'prepTime' => '2 min',
            'category' => 'Hot Coffee'
        ]);

        // 2. Simulate placing an order with Bearer token authentication
        $response = $this->withHeaders([
            'Authorization' => 'Bearer test_token'
        ])->postJson('/api/orders', [
            'user_id' => $user->id,
            'fulfillment_type' => 'Dine In',
            'table_number' => '5',
            'total_price' => 30000,
            'items' => [
                [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'qty' => 2
                ]
            ]
        ]);

        // 3. Assertions
        $response->assertStatus(201);
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'payment_status' => 'Unpaid',
            'status' => 'Pending'
        ]);

        // Assert stock was decremented (5 - 2 = 3)
        $this->assertEquals(3, $product->fresh()->stock);
    }

    /** @test */
    public function an_order_fails_if_insufficient_stock()
    {
        // 1. Create a user and save remember_token explicitly
        $user = User::create([
            'name' => 'QA Customer',
            'email' => 'qa_customer@email.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'is_active' => true
        ]);
        $user->remember_token = 'test_token';
        $user->save();
        
        $product = Product::create([
            'name' => 'Test Espresso',
            'description' => 'Rich aromatic double shot espresso.',
            'price' => 15000,
            'stock' => 1,
            'image' => '/espresso.jpg',
            'rating' => '4.8',
            'prepTime' => '2 min',
            'category' => 'Hot Coffee'
        ]);

        // 2. Simulate ordering quantity exceeding stock
        $response = $this->withHeaders([
            'Authorization' => 'Bearer test_token'
        ])->postJson('/api/orders', [
            'user_id' => $user->id,
            'fulfillment_type' => 'Dine In',
            'table_number' => '5',
            'total_price' => 30000,
            'items' => [
                [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'qty' => 2 // Exceeds stock of 1
                ]
            ]
        ]);

        // 3. Assertions
        $response->assertStatus(422);
        $this->assertDatabaseMissing('orders', [
            'user_id' => $user->id
        ]);

        // Assert stock was NOT decremented
        $this->assertEquals(1, $product->fresh()->stock);
    }

    /** @test */
    public function webhook_updates_payment_status_to_paid_on_success()
    {
        // 1. Create an order
        $product = Product::create([
            'name' => 'Test Espresso',
            'description' => 'Rich aromatic double shot espresso.',
            'price' => 15000,
            'stock' => 5,
            'image' => '/espresso.jpg',
            'rating' => '4.8',
            'prepTime' => '2 min',
            'category' => 'Hot Coffee'
        ]);
        
        $order = Order::create([
            'total_price' => 15000,
            'items' => [['id' => $product->id, 'qty' => 1]],
            'status' => 'Pending',
            'payment_status' => 'Unpaid',
            'fulfillment_type' => 'Dine In',
            'table_number' => '5'
        ]);

        $statusCode = '200';
        $grossAmount = '15000.00';
        $serverKey = env('MIDTRANS_SERVER_KEY', '');
        $signature = hash("sha512", $order->id . $statusCode . $grossAmount . $serverKey);

        // 2. Send webhook request simulating Midtrans success
        $response = $this->postJson('/api/webhook/midtrans', [
            'order_id' => $order->id,
            'status_code' => $statusCode,
            'transaction_status' => 'settlement',
            'payment_type' => 'qris',
            'gross_amount' => $grossAmount,
            'signature_key' => $signature
        ]);

        // 3. Assertions
        $response->assertStatus(200);
        $this->assertEquals('Paid', $order->fresh()->payment_status);
        $this->assertEquals('Processing', $order->fresh()->status);
    }
}
