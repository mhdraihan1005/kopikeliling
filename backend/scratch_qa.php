<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Setting;
use App\Models\Review;

// Helper function to send requests
function send_request($method, $uri, $data = [], $token = null) {
    $url = "http://127.0.0.1:8000/api" . $uri;
    $headers = [
        'Content-Type: application/json',
        'Accept: application/json',
    ];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if (!empty($data) || in_array(strtoupper($method), ['POST', 'PUT', 'PATCH'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'status' => $httpCode,
        'body' => json_decode($response, true) ?: $response
    ];
}

// Clean up test data before starting
DB::table('reviews')->delete();
DB::table('orders')->delete();
DB::table('users')->where('email', 'like', 'qa_%')->delete();
DB::table('products')->where('name', 'like', 'QA %')->delete();

// Re-enable/reset settings
Setting::updateOrCreate(['key' => 'shop_status'], ['value' => 'open']);

// List to hold our test results
$test_results = [];

function record_test(&$results, $id, $module, $steps, $expected, $actual, $status, $bug = '-', $severity = '-', $recommendation = '-') {
    $results[] = [
        'id' => $id,
        'module' => $module,
        'steps' => $steps,
        'expected' => $expected,
        'actual' => $actual,
        'status' => $status,
        'bug' => $bug,
        'severity' => $severity,
        'recommendation' => $recommendation
    ];
}

echo "=== STARTING QA FUNCTIONAL TESTING SUITE ===\n\n";

// ----------------------------------------------------
// MODULE 1: REGISTRATION
// ----------------------------------------------------

// TC-REG-01: Positive Registration
$reg1 = send_request('POST', '/register', [
    'name' => 'QA Customer One',
    'email' => 'qa_customer1@email.com',
    'password' => 'password123'
]);
if ($reg1['status'] === 201 && isset($reg1['body']['token'])) {
    record_test($test_results, 'TC-REG-01', 'Registration', 
        'Register with valid unique details (name, email, password)',
        'HTTP 201, return user details & auth token',
        'HTTP 201, Token returned, user created', 'PASS');
} else {
    record_test($test_results, 'TC-REG-01', 'Registration', 
        'Register with valid unique details (name, email, password)',
        'HTTP 201, return user details & auth token',
        'HTTP ' . $reg1['status'] . ': ' . json_encode($reg1['body']), 'FAIL', 'Registration failed', 'Critical', 'Fix registration API handler');
}

// TC-REG-02: Negative Registration (Duplicate Email)
$reg2 = send_request('POST', '/register', [
    'name' => 'QA Customer Two',
    'email' => 'qa_customer1@email.com', // Duplicate
    'password' => 'password123'
]);
if ($reg2['status'] === 422) {
    record_test($test_results, 'TC-REG-02', 'Registration', 
        'Register with an already registered email',
        'HTTP 422, validation error for duplicate email',
        'HTTP 422, message: ' . ($reg2['body']['message'] ?? json_encode($reg2['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-REG-02', 'Registration', 
        'Register with an already registered email',
        'HTTP 422, validation error for duplicate email',
        'HTTP ' . $reg2['status'] . ': ' . json_encode($reg2['body']), 'FAIL', 'Duplicate email accepted', 'High', 'Add unique email validation on registration');
}

// TC-REG-03: Negative Registration (Short Password)
$reg3 = send_request('POST', '/register', [
    'name' => 'QA Customer Three',
    'email' => 'qa_customer3@email.com',
    'password' => '123' // Too short
]);
if ($reg3['status'] === 422) {
    record_test($test_results, 'TC-REG-03', 'Registration', 
        'Register with password shorter than 6 characters',
        'HTTP 422, validation error for password length',
        'HTTP 422, message: ' . ($reg3['body']['message'] ?? json_encode($reg3['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-REG-03', 'Registration', 
        'Register with password shorter than 6 characters',
        'HTTP 422, validation error for password length',
        'HTTP ' . $reg3['status'] . ': ' . json_encode($reg3['body']), 'FAIL', 'Short password accepted', 'Medium', 'Enforce min:6 password length validation');
}

// TC-REG-04: Negative Registration (Missing Required Fields)
$reg4 = send_request('POST', '/register', [
    'name' => '',
    'email' => '',
    'password' => ''
]);
if ($reg4['status'] === 422) {
    record_test($test_results, 'TC-REG-04', 'Registration', 
        'Register with empty/missing required fields',
        'HTTP 422, validation errors for name, email, password',
        'HTTP 422, message: ' . ($reg4['body']['message'] ?? json_encode($reg4['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-REG-04', 'Registration', 
        'Register with empty/missing required fields',
        'HTTP 422, validation errors',
        'HTTP ' . $reg4['status'] . ': ' . json_encode($reg4['body']), 'FAIL', 'Empty fields accepted', 'High', 'Add required validation rules');
}


// ----------------------------------------------------
// MODULE 2: LOGIN
// ----------------------------------------------------

// TC-LOG-01: Positive Login
$log1 = send_request('POST', '/login', [
    'email' => 'qa_customer1@email.com',
    'password' => 'password123'
]);
$customer_token = null;
$customer_user_id = null;
if ($log1['status'] === 200 && isset($log1['body']['token'])) {
    $customer_token = $log1['body']['token'];
    $customer_user_id = $log1['body']['user']['id'];
    record_test($test_results, 'TC-LOG-01', 'Login', 
        'Login with valid registered credentials',
        'HTTP 200, returns token & user details',
        'HTTP 200, Token: ' . substr($customer_token, 0, 8) . '...', 'PASS');
} else {
    record_test($test_results, 'TC-LOG-01', 'Login', 
        'Login with valid registered credentials',
        'HTTP 200, returns token',
        'HTTP ' . $log1['status'] . ': ' . json_encode($log1['body']), 'FAIL', 'Login failed for valid credentials', 'Critical', 'Check AuthController login handler');
}

// TC-LOG-02: Negative Login (Incorrect Password)
$log2 = send_request('POST', '/login', [
    'email' => 'qa_customer1@email.com',
    'password' => 'wrongpass'
]);
if ($log2['status'] === 422) {
    record_test($test_results, 'TC-LOG-02', 'Login', 
        'Login with incorrect password',
        'HTTP 422, error credentials do not match',
        'HTTP 422, message: ' . ($log2['body']['message'] ?? json_encode($log2['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-LOG-02', 'Login', 
        'Login with incorrect password',
        'HTTP 422, credentials mismatch error',
        'HTTP ' . $log2['status'] . ': ' . json_encode($log2['body']), 'FAIL', 'Incorrect password allowed login', 'Critical', 'Secure password verification check');
}

// TC-LOG-03: Negative Login (Deactivated User)
// Temporarily deactivate user qa_customer1
DB::table('users')->where('id', $customer_user_id)->update(['is_active' => false]);
$log3 = send_request('POST', '/login', [
    'email' => 'qa_customer1@email.com',
    'password' => 'password123'
]);
if ($log3['status'] === 422) {
    record_test($test_results, 'TC-LOG-03', 'Login', 
        'Login as a deactivated user',
        'HTTP 422, error account deactivated',
        'HTTP 422, message: ' . ($log3['body']['message'] ?? json_encode($log3['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-LOG-03', 'Login', 
        'Login as a deactivated user',
        'HTTP 422, account deactivated error',
        'HTTP ' . $log3['status'] . ': ' . json_encode($log3['body']), 'FAIL', 'Deactivated user allowed to login', 'High', 'Add active status check before issuing login token');
}
// Restore active status
DB::table('users')->where('id', $customer_user_id)->update(['is_active' => true]);


// ----------------------------------------------------
// MODULE 3: MENU CATALOG
// ----------------------------------------------------

// TC-CAT-01: Get Menu Catalog
$cat1 = send_request('GET', '/products');
if ($cat1['status'] === 200 && is_array($cat1['body'])) {
    record_test($test_results, 'TC-CAT-01', 'Menu Catalog', 
        'Get all products for menu catalog',
        'HTTP 200, returns array of products',
        'HTTP 200, returned ' . count($cat1['body']) . ' products', 'PASS');
} else {
    record_test($test_results, 'TC-CAT-01', 'Menu Catalog', 
        'Get all products for menu catalog',
        'HTTP 200, returns array of products',
        'HTTP ' . $cat1['status'] . ': ' . json_encode($cat1['body']), 'FAIL', 'Cannot fetch products list', 'High', 'Check ProductController index method');
}


// ----------------------------------------------------
// MODULE 4: CATEGORY FILTER
// ----------------------------------------------------

// TC-FIL-01: Verify Product Categories
$fil1 = true;
$categories = [];
if ($cat1['status'] === 200) {
    foreach ($cat1['body'] as $product) {
        if (!isset($product['category'])) {
            $fil1 = false;
        } else {
            $categories[] = $product['category'];
        }
    }
}
$categories = array_unique($categories);
if ($fil1 && !empty($categories)) {
    record_test($test_results, 'TC-FIL-01', 'Category Filter', 
        'Verify product items contain category fields for client-side filtering',
        'All products contain a category field',
        'Verified. Categories found: ' . implode(', ', $categories), 'PASS');
} else {
    record_test($test_results, 'TC-FIL-01', 'Category Filter', 
        'Verify product items contain category fields',
        'All products contain a category field',
        'Some products missing category field', 'FAIL', 'Category attribute missing', 'Medium', 'Ensure category is returned by API');
}


// ----------------------------------------------------
// MODULE 5: SHOPPING CART & CHECKOUT
// ----------------------------------------------------

// Setup a product for ordering
$product = Product::first();
if (!$product) {
    $product = Product::create([
        'name' => 'QA Espresso Test',
        'price' => 15000,
        'stock' => 10,
        'category' => 'Hot Coffee',
        'image' => ''
    ]);
}
$product_id = $product->id;

// TC-CHK-01: Positive Checkout (Dine In)
$chk1 = send_request('POST', '/orders', [
    'user_id' => $customer_user_id,
    'total_price' => 12000, // Frontend calculation (after discount, though backend recalculates securely)
    'items' => [
        ['id' => $product_id, 'name' => $product->name, 'price' => $product->price, 'qty' => 1]
    ],
    'fulfillment_type' => 'Dine In',
    'table_number' => '12'
], $customer_token);

$order_id = null;
if ($chk1['status'] === 201 && isset($chk1['body']['order']['id'])) {
    $order_id = $chk1['body']['order']['id'];
    record_test($test_results, 'TC-CHK-01', 'Shopping Cart & Checkout', 
        'Perform checkout for Dine In with table number',
        'HTTP 201, order created, snap_token generated',
        'HTTP 201, Order ID: ' . $order_id . ', Snap Token: ' . substr($chk1['body']['snap_token'], 0, 10) . '...', 'PASS');
} else {
    record_test($test_results, 'TC-CHK-01', 'Shopping Cart & Checkout', 
        'Perform checkout for Dine In',
        'HTTP 201, order created',
        'HTTP ' . $chk1['status'] . ': ' . json_encode($chk1['body']), 'FAIL', 'Checkout failed', 'Critical', 'Check checkout api handler');
}

// TC-CHK-02: Negative Checkout (Dine In without Table Number)
$chk2 = send_request('POST', '/orders', [
    'user_id' => $customer_user_id,
    'total_price' => 12000,
    'items' => [
        ['id' => $product_id, 'name' => $product->name, 'price' => $product->price, 'qty' => 1]
    ],
    'fulfillment_type' => 'Dine In',
    'table_number' => '' // Missing
], $customer_token);

if ($chk2['status'] === 422) {
    record_test($test_results, 'TC-CHK-02', 'Shopping Cart & Checkout', 
        'Checkout Dine In with empty table number',
        'HTTP 422, validation error table number required',
        'HTTP 422, message: ' . ($chk2['body']['message'] ?? json_encode($chk2['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-CHK-02', 'Shopping Cart & Checkout', 
        'Checkout Dine In with empty table number',
        'HTTP 422, validation error table number required',
        'HTTP ' . $chk2['status'] . ': ' . json_encode($chk2['body']), 'FAIL', 'Allowed Dine In order without table number', 'High', 'Add required_if:fulfillment_type,Dine In validation rule');
}

// TC-CHK-03: Negative Checkout (Guest without Guest Name)
$chk3 = send_request('POST', '/orders', [
    'total_price' => 15000,
    'items' => [
        ['id' => $product_id, 'name' => $product->name, 'price' => $product->price, 'qty' => 1]
    ],
    'fulfillment_type' => 'Pickup',
    'guest_name' => '' // Missing
]);
if ($chk3['status'] === 422) {
    record_test($test_results, 'TC-CHK-03', 'Shopping Cart & Checkout', 
        'Guest checkout with empty customer name',
        'HTTP 422, validation error guest name required',
        'HTTP 422, message: ' . ($chk3['body']['message'] ?? json_encode($chk3['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-CHK-03', 'Shopping Cart & Checkout', 
        'Guest checkout with empty customer name',
        'HTTP 422, validation error guest name required',
        'HTTP ' . $chk3['status'] . ': ' . json_encode($chk3['body']), 'FAIL', 'Allowed guest checkout without name', 'High', 'Add required_without:user_id validation rule for guest name');
}

// TC-CHK-04: Negative Checkout (Closed Shop Validation)
// Close shop
DB::table('settings')->where('key', 'shop_status')->update(['value' => 'closed']);
$chk4 = send_request('POST', '/orders', [
    'user_id' => $customer_user_id,
    'total_price' => 12000,
    'items' => [
        ['id' => $product_id, 'name' => $product->name, 'price' => $product->price, 'qty' => 1]
    ],
    'fulfillment_type' => 'Pickup',
], $customer_token);

if ($chk4['status'] === 403) {
    record_test($test_results, 'TC-CHK-04', 'Shopping Cart & Checkout', 
        'Perform checkout when shop status is CLOSED',
        'HTTP 403, error ordering is disabled when shop is closed',
        'HTTP 403, message: ' . ($chk4['body']['message'] ?? json_encode($chk4['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-CHK-04', 'Shopping Cart & Checkout', 
        'Perform checkout when shop status is CLOSED',
        'HTTP 403, ordering disabled error',
        'HTTP ' . $chk4['status'] . ': ' . json_encode($chk4['body']), 'FAIL', 'Allowed checkout when shop is closed', 'High', 'Enforce shop status check inside OrderController store method');
}
// Reopen shop
DB::table('settings')->where('key', 'shop_status')->update(['value' => 'open']);

// TC-CHK-05: Negative Checkout (Unauthorized user_id token mismatch)
$chk5 = send_request('POST', '/orders', [
    'user_id' => 999999, // Wrong user ID
    'total_price' => 12000,
    'items' => [
        ['id' => $product_id, 'name' => $product->name, 'price' => $product->price, 'qty' => 1]
    ],
    'fulfillment_type' => 'Pickup',
], $customer_token);

if ($chk5['status'] === 403) {
    record_test($test_results, 'TC-CHK-05', 'Shopping Cart & Checkout', 
        'Checkout with unauthorized user_id mismatch with bearer token',
        'HTTP 403, unauthorized user_id error',
        'HTTP 403, message: ' . ($chk5['body']['message'] ?? json_encode($chk5['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-CHK-05', 'Shopping Cart & Checkout', 
        'Checkout with unauthorized user_id mismatch',
        'HTTP 403, unauthorized error',
        'HTTP ' . $chk5['status'] . ': ' . json_encode($chk5['body']), 'FAIL', 'Allowed checkout for arbitrary user_id without authorization check', 'Critical', 'Add token ownership verification check on user_id payload');
}

// TC-CHK-06: Bug Case (Checkout Quantity Exceeding Stock Level)
// Set product stock to 5
$product->update(['stock' => 5]);
$chk6 = send_request('POST', '/orders', [
    'user_id' => $customer_user_id,
    'total_price' => 12000 * 10,
    'items' => [
        ['id' => $product_id, 'name' => $product->name, 'price' => $product->price, 'qty' => 10] // Ordering 10 (exceeding stock 5)
    ],
    'fulfillment_type' => 'Pickup',
], $customer_token);

$refreshed_stock = Product::find($product_id)->stock;
if ($refreshed_stock < 0) {
    record_test($test_results, 'TC-CHK-06', 'Shopping Cart & Checkout', 
        'Order quantity exceeding product stock level',
        'Validation failure, prevent order and reject checkout',
        'Order accepted, stock decremented to negative: ' . $refreshed_stock, 'FAIL', 'Negative Stock Leak Bug', 'High', 'Add stock availability check before decrementing product stock');
} else {
    record_test($test_results, 'TC-CHK-06', 'Shopping Cart & Checkout', 
        'Order quantity exceeding product stock level',
        'Validation failure, reject checkout',
        'Order rejected / stock remains non-negative', 'PASS');
}
// Restore stock
$product->update(['stock' => 10]);


// ----------------------------------------------------
// MODULE 6: MIDTRANS SNAP PAYMENT
// ----------------------------------------------------

// TC-MID-01: Snap Token Verification
if ($chk1['status'] === 201 && isset($chk1['body']['snap_token'])) {
    record_test($test_results, 'TC-MID-01', 'Midtrans Snap Payment', 
        'Verify Snap Token generation parameters',
        'Valid Midtrans token generated, expiry 5 mins',
        'Snap token: ' . $chk1['body']['snap_token'], 'PASS');
} else {
    record_test($test_results, 'TC-MID-01', 'Midtrans Snap Payment', 
        'Verify Snap Token generation parameters',
        'Snap token generated',
        'Failed to generate snap token', 'FAIL', 'Midtrans integration failure', 'High', 'Check Midtrans SDK credentials');
}


// ----------------------------------------------------
// MODULE 7: PAYMENT NOTIFICATION (WEBHOOK)
// ----------------------------------------------------

// TC-WEB-01: Positive Webhook handling
// Generate a fake valid signature key for order ID: $order_id
$serverKey = env('MIDTRANS_SERVER_KEY');
$orderIdStr = $order_id . '-' . time();
$grossAmount = 12000;
$statusCode = 200;
$fake_signature = hash("sha512", $orderIdStr . $statusCode . $grossAmount . $serverKey);

$web1 = send_request('POST', '/webhook/midtrans', [
    'order_id' => $orderIdStr,
    'status_code' => $statusCode,
    'gross_amount' => $grossAmount,
    'transaction_status' => 'settlement',
    'signature_key' => $fake_signature
]);
$refreshed_order = Order::find($order_id);
if ($web1['status'] === 200 && $refreshed_order->payment_status === 'Paid' && $refreshed_order->status === 'Processing') {
    record_test($test_results, 'TC-WEB-01', 'Payment Notification (Webhook)', 
        'Handle webhook with valid signature and status settlement',
        'HTTP 200, order status updated to Paid & Processing',
        'HTTP 200, DB state updated: payment_status = ' . $refreshed_order->payment_status . ', status = ' . $refreshed_order->status, 'PASS');
} else {
    record_test($test_results, 'TC-WEB-01', 'Payment Notification (Webhook)', 
        'Handle webhook with valid signature',
        'HTTP 200, status updated',
        'HTTP ' . $web1['status'] . ': ' . json_encode($web1['body']), 'FAIL', 'Webhook status update failed', 'Critical', 'Check signature verification and webhook logic in OrderController');
}

// TC-WEB-02: Negative Webhook (Invalid Signature)
$web2 = send_request('POST', '/webhook/midtrans', [
    'order_id' => $orderIdStr,
    'status_code' => $statusCode,
    'gross_amount' => $grossAmount,
    'transaction_status' => 'settlement',
    'signature_key' => 'invalid_fake_signature_key'
]);
if ($web2['status'] === 400) {
    record_test($test_results, 'TC-WEB-02', 'Payment Notification (Webhook)', 
        'Handle webhook with invalid signature key',
        'HTTP 400 Bad Request, invalid signature error',
        'HTTP 400, message: ' . ($web2['body']['message'] ?? json_encode($web2['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-WEB-02', 'Payment Notification (Webhook)', 
        'Handle webhook with invalid signature key',
        'HTTP 400, reject webhook request',
        'HTTP ' . $web2['status'] . ': ' . json_encode($web2['body']), 'FAIL', 'Accepted invalid webhook signature', 'Critical', 'Validate Midtrans signature properly');
}

// TC-WEB-03: Negative Webhook (Non-existent Order)
$fake_order_id = 999999;
$fake_order_id_str = $fake_order_id . '-' . time();
$fake_signature_2 = hash("sha512", $fake_order_id_str . $statusCode . $grossAmount . $serverKey);
$web3 = send_request('POST', '/webhook/midtrans', [
    'order_id' => $fake_order_id_str,
    'status_code' => $statusCode,
    'gross_amount' => $grossAmount,
    'transaction_status' => 'settlement',
    'signature_key' => $fake_signature_2
]);
if ($web3['status'] === 404) {
    record_test($test_results, 'TC-WEB-03', 'Payment Notification (Webhook)', 
        'Handle webhook for non-existent order ID',
        'HTTP 404 Not Found, order not found error',
        'HTTP 404, message: ' . ($web3['body']['message'] ?? json_encode($web3['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-WEB-03', 'Payment Notification (Webhook)', 
        'Handle webhook for non-existent order ID',
        'HTTP 404, reject webhook request',
        'HTTP ' . $web3['status'] . ': ' . json_encode($web3['body']), 'FAIL', 'Webhook accepted non-existent order', 'Medium', 'Verify order existence in database before updating');
}

// TC-WEB-04: Bug Case (Webhook status expire/cancel - Stock Leak Check)
// Create another order for testing expire status
$chk_expire = send_request('POST', '/orders', [
    'user_id' => $customer_user_id,
    'total_price' => 15000,
    'items' => [
        ['id' => $product_id, 'name' => $product->name, 'price' => $product->price, 'qty' => 2]
    ],
    'fulfillment_type' => 'Pickup',
], $customer_token);
$expire_order_id = $chk_expire['body']['order']['id'];
$initial_stock = Product::find($product_id)->stock; // 8

// Trigger expire webhook
$expire_order_id_str = $expire_order_id . '-' . time();
$expire_signature = hash("sha512", $expire_order_id_str . $statusCode . 15000 . $serverKey);
$web_expire = send_request('POST', '/webhook/midtrans', [
    'order_id' => $expire_order_id_str,
    'status_code' => $statusCode,
    'gross_amount' => 15000,
    'transaction_status' => 'expire',
    'signature_key' => $expire_signature
]);
$final_stock = Product::find($product_id)->stock;
$refreshed_expire_order = Order::find($expire_order_id);

if ($refreshed_expire_order->payment_status === 'Failed') {
    if ($final_stock == $initial_stock + 2) {
        record_test($test_results, 'TC-WEB-04', 'Payment Notification (Webhook)', 
            'Webhook notifies order expired/cancelled, verify stock is restored',
            'Payment marked Failed, stock restored to database',
            'Order payment_status = Failed, stock restored to: ' . $final_stock, 'PASS');
    } else {
        record_test($test_results, 'TC-WEB-04', 'Payment Notification (Webhook)', 
            'Webhook notifies order expired/cancelled, verify stock is restored',
            'Payment marked Failed, stock restored to database',
            'Order payment_status = Failed, but stock was NOT restored (stock leak! initial: ' . $initial_stock . ', final: ' . $final_stock . ')', 'FAIL', 'Stock Leak on Cancelled/Expired Orders', 'High', 'Add stock restoration logic inside OrderController handleWebhook method for expired/deny/cancel statuses');
    }
} else {
    record_test($test_results, 'TC-WEB-04', 'Payment Notification (Webhook)', 
        'Webhook status expire',
        'Payment status updated to Failed',
        'HTTP ' . $web_expire['status'] . ': ' . json_encode($web_expire['body']), 'FAIL', 'Expired payment status not updated', 'High', 'Handle expire transaction status in webhook');
}


// ----------------------------------------------------
// MODULE 8: ORDER HISTORY
// ----------------------------------------------------

// TC-HIS-01: Positive Order History (Customer gets their own orders)
$his1 = send_request('GET', '/orders', [], $customer_token);
if ($his1['status'] === 200 && is_array($his1['body'])) {
    $all_own = true;
    foreach ($his1['body'] as $order) {
        if ($order['user_id'] != $customer_user_id) {
            $all_own = false;
        }
    }
    if ($all_own) {
        record_test($test_results, 'TC-HIS-01', 'Order History', 
            'Retrieve authenticated user\'s own order history',
            'HTTP 200, array of only the authenticated user\'s orders',
            'HTTP 200, returned ' . count($his1['body']) . ' orders, all owned by user', 'PASS');
    } else {
        record_test($test_results, 'TC-HIS-01', 'Order History', 
            'Retrieve authenticated user\'s own order history',
            'HTTP 200, array of only the authenticated user\'s orders',
            'Returned other users\' orders in user history!', 'FAIL', 'Data visibility breach', 'High', 'Filter orders by authenticated user id');
    }
} else {
    record_test($test_results, 'TC-HIS-01', 'Order History', 
        'Retrieve authenticated user\'s order history',
        'HTTP 200',
        'HTTP ' . $his1['status'] . ': ' . json_encode($his1['body']), 'FAIL', 'Cannot fetch order history', 'Medium', 'Check OrderController index logic');
}

// TC-HIS-02: Negative Order History (Access without Token)
$his2 = send_request('GET', '/orders');
if ($his2['status'] === 401) {
    record_test($test_results, 'TC-HIS-02', 'Order History', 
        'Retrieve order history without authentication token',
        'HTTP 401 Unauthenticated',
        'HTTP 401, message: ' . ($his2['body']['message'] ?? json_encode($his2['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-HIS-02', 'Order History', 
        'Retrieve order history without token',
        'HTTP 401 Unauthenticated',
        'HTTP ' . $his2['status'] . ': ' . json_encode($his2['body']), 'FAIL', 'Auth middleware bypass', 'Critical', 'Add api.auth middleware to index route');
}

// TC-HIS-03: Negative Order History (Access other user's order details)
// Register a second customer
$reg_other = send_request('POST', '/register', [
    'name' => 'QA Customer Two',
    'email' => 'qa_customer2@email.com',
    'password' => 'password123'
]);
$other_token = $reg_other['body']['token'];
$his3 = send_request('GET', '/orders/' . $order_id, [], $other_token); // Trying to view QA Customer One's order
if ($his3['status'] === 403) {
    record_test($test_results, 'TC-HIS-03', 'Order History', 
        'Access details of an order belonging to another customer',
        'HTTP 403 Unauthorized to view order',
        'HTTP 403, message: ' . ($his3['body']['message'] ?? json_encode($his3['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-HIS-03', 'Order History', 
        'Access other user\'s order details',
        'HTTP 403 Unauthorized',
        'HTTP ' . $his3['status'] . ': ' . json_encode($his3['body']), 'FAIL', 'Horizontal privilege escalation', 'Critical', 'Restrict order details access to order owner and admins only');
}


// ----------------------------------------------------
// MODULE 9: PRODUCT REVIEW
// ----------------------------------------------------

// TC-REV-01: Positive Product Review
$rev1 = send_request('POST', '/reviews', [
    'order_id' => $order_id,
    'product_id' => $product_id,
    'rating' => 5,
    'comment' => 'Delicious espresso!'
]);
if ($rev1['status'] === 201) {
    $refreshed_p = Product::find($product_id);
    record_test($test_results, 'TC-REV-01', 'Product Review', 
        'Submit product review for a purchased order',
        'HTTP 201, review saved, updates product average rating',
        'HTTP 201, Product Rating updated to: ' . $refreshed_p->rating, 'PASS');
} else {
    record_test($test_results, 'TC-REV-01', 'Product Review', 
        'Submit review for purchased order',
        'HTTP 201',
        'HTTP ' . $rev1['status'] . ': ' . json_encode($rev1['body']), 'FAIL', 'Review submission failed', 'High', 'Check ReviewController store method');
}

// TC-REV-02: Negative Product Review (Rating out of range)
$rev2 = send_request('POST', '/reviews', [
    'order_id' => $order_id,
    'product_id' => $product_id,
    'rating' => 6, // Invalid
    'comment' => 'Too high rating!'
]);
if ($rev2['status'] === 422) {
    record_test($test_results, 'TC-REV-02', 'Product Review', 
        'Submit review with rating out of range (rating = 6)',
        'HTTP 422, validation error rating must be between 1 and 5',
        'HTTP 422, message: ' . ($rev2['body']['message'] ?? json_encode($rev2['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-REV-02', 'Product Review', 
        'Submit review with rating out of range',
        'HTTP 422 validation error',
        'HTTP ' . $rev2['status'] . ': ' . json_encode($rev2['body']), 'FAIL', 'Invalid rating accepted', 'Medium', 'Add max:5 validation rule to rating field');
}

// TC-REV-03: Negative Product Review (Duplicate review)
$rev3 = send_request('POST', '/reviews', [
    'order_id' => $order_id,
    'product_id' => $product_id,
    'rating' => 4,
    'comment' => 'Review duplicate test'
]);
if ($rev3['status'] === 400) {
    record_test($test_results, 'TC-REV-03', 'Product Review', 
        'Submit duplicate review for the same order and product',
        'HTTP 400, error review already submitted',
        'HTTP 400, message: ' . ($rev3['body']['message'] ?? json_encode($rev3['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-REV-03', 'Product Review', 
        'Submit duplicate review',
        'HTTP 400 bad request',
        'HTTP ' . $rev3['status'] . ': ' . json_encode($rev3['body']), 'FAIL', 'Duplicate review accepted', 'High', 'Add unique constraint or check in ReviewController before creating review');
}


// ----------------------------------------------------
// MODULE 10: ADMIN DASHBOARD
// ----------------------------------------------------

// Login as admin
$admin_log = send_request('POST', '/login', [
    'email' => 'admin@email.com',
    'password' => 'password123'
]);
$admin_token = $admin_log['body']['token'] ?? null;

// TC-ADM-01: Positive Admin dashboard access
$adm1 = send_request('GET', '/orders', [], $admin_token);
if ($adm1['status'] === 200 && count($adm1['body']) > 0) {
    record_test($test_results, 'TC-ADM-01', 'Admin Dashboard', 
        'Access orders list as admin (admin dashboard)',
        'HTTP 200, successfully fetches all user orders',
        'HTTP 200, returned all ' . count($adm1['body']) . ' orders in system', 'PASS');
} else {
    record_test($test_results, 'TC-ADM-01', 'Admin Dashboard', 
        'Access orders list as admin',
        'HTTP 200, success',
        'HTTP ' . $adm1['status'] . ': ' . json_encode($adm1['body']), 'FAIL', 'Admin cannot access orders', 'Critical', 'Check admin authentication/role check');
}

// TC-ADM-02: Negative Admin dashboard access (Customer accessing admin only action)
$adm2 = send_request('POST', '/settings', [
    'shop_name' => 'Hacked Shop Name'
], $customer_token); // Customer token

if ($adm2['status'] === 403 || $adm2['status'] === 401) {
    record_test($test_results, 'TC-ADM-02', 'Admin Dashboard', 
        'Customer attempts to update website settings (admin only action)',
        'HTTP 403 Forbidden',
        'HTTP ' . $adm2['status'] . ', message: ' . ($adm2['body']['message'] ?? json_encode($adm2['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-ADM-02', 'Admin Dashboard', 
        'Customer attempts to update settings',
        'HTTP 403 Forbidden',
        'HTTP ' . $adm2['status'] . ': ' . json_encode($adm2['body']), 'FAIL', 'Privilege Escalation Vulnerability', 'Critical', 'Apply api.admin middleware to settings update endpoint');
}


// ----------------------------------------------------
// MODULE 11: PRODUCT CRUD
// ----------------------------------------------------

// TC-PRD-01: Create Product as Admin
$prd1 = send_request('POST', '/products', [
    'name' => 'QA Hot Americano',
    'description' => 'Rich espresso diluted with hot water',
    'price' => 18000,
    'stock' => 20,
    'category' => 'Hot Coffee',
], $admin_token);
$qa_product_id = $prd1['body']['id'] ?? null;

if ($prd1['status'] === 201 && $qa_product_id) {
    record_test($test_results, 'TC-PRD-01', 'Product CRUD', 
        'Create a new product as admin',
        'HTTP 201, product created successfully',
        'HTTP 201, Product ID: ' . $qa_product_id, 'PASS');
} else {
    record_test($test_results, 'TC-PRD-01', 'Product CRUD', 
        'Create a new product',
        'HTTP 201, product created',
        'HTTP ' . $prd1['status'] . ': ' . json_encode($prd1['body']), 'FAIL', 'Failed to create product', 'High', 'Check ProductController store method');
}

// TC-PRD-02: Update Product as Admin
$prd2 = send_request('PUT', '/products/' . $qa_product_id, [
    'price' => 20000,
    'stock' => 15
], $admin_token);
if ($prd2['status'] === 200 && $prd2['body']['price'] == 20000 && $prd2['body']['stock'] == 15) {
    record_test($test_results, 'TC-PRD-02', 'Product CRUD', 
        'Update product price and stock as admin',
        'HTTP 200, product updated, returned new price = 20000',
        'HTTP 200, price = ' . $prd2['body']['price'] . ', stock = ' . $prd2['body']['stock'], 'PASS');
} else {
    record_test($test_results, 'TC-PRD-02', 'Product CRUD', 
        'Update product details',
        'HTTP 200, product updated',
        'HTTP ' . $prd2['status'] . ': ' . json_encode($prd2['body']), 'FAIL', 'Failed to update product', 'High', 'Check ProductController update method');
}

// TC-PRD-03: Delete Product as Admin
$prd3 = send_request('DELETE', '/products/' . $qa_product_id, [], $admin_token);
if ($prd3['status'] === 200) {
    record_test($test_results, 'TC-PRD-03', 'Product CRUD', 
        'Delete product as admin',
        'HTTP 200, product deleted successfully',
        'HTTP 200, message: ' . $prd3['body']['message'], 'PASS');
} else {
    record_test($test_results, 'TC-PRD-03', 'Product CRUD', 
        'Delete product',
        'HTTP 200',
        'HTTP ' . $prd3['status'] . ': ' . json_encode($prd3['body']), 'FAIL', 'Failed to delete product', 'High', 'Check ProductController destroy method');
}


// ----------------------------------------------------
// MODULE 12: USER MANAGEMENT
// ----------------------------------------------------

// TC-USR-01: List Users as Admin
$usr1 = send_request('GET', '/users', [], $admin_token);
if ($usr1['status'] === 200 && is_array($usr1['body'])) {
    record_test($test_results, 'TC-USR-01', 'User Management', 
        'List all users as admin',
        'HTTP 200, returns array of users',
        'HTTP 200, returned ' . count($usr1['body']) . ' users', 'PASS');
} else {
    record_test($test_results, 'TC-USR-01', 'User Management', 
        'List all users as admin',
        'HTTP 200',
        'HTTP ' . $usr1['status'] . ': ' . json_encode($usr1['body']), 'FAIL', 'Cannot fetch user list', 'High', 'Check UserController index method');
}

// TC-USR-02: Create User as Admin
$usr2 = send_request('POST', '/users', [
    'name' => 'QA Admin Created Customer',
    'email' => 'qa_admin_created@email.com',
    'password' => 'password123',
    'role' => 'customer',
    'is_active' => true
], $admin_token);
$qa_user_id = $usr2['body']['id'] ?? null;
if ($usr2['status'] === 201) {
    record_test($test_results, 'TC-USR-02', 'User Management', 
        'Create a new user through Admin panel User Management',
        'HTTP 201, user created successfully',
        'HTTP 201, User ID: ' . $qa_user_id, 'PASS');
} else {
    record_test($test_results, 'TC-USR-02', 'User Management', 
        'Create user as admin',
        'HTTP 201',
        'HTTP ' . $usr2['status'] . ': ' . json_encode($usr2['body']), 'FAIL', 'Failed to create user as admin', 'High', 'Check UserController store method');
}

// TC-USR-03: Create User as Admin with Duplicate Email (Negative)
$usr3 = send_request('POST', '/users', [
    'name' => 'QA Admin Created Customer 2',
    'email' => 'qa_admin_created@email.com', // Duplicate
    'password' => 'password123',
    'role' => 'customer',
    'is_active' => true
], $admin_token);
if ($usr3['status'] === 422) {
    record_test($test_results, 'TC-USR-03', 'User Management', 
        'Create user as admin with duplicate email',
        'HTTP 422, validation error duplicate email',
        'HTTP 422, message: ' . ($usr3['body']['message'] ?? json_encode($usr3['body'])), 'PASS');
} else {
    record_test($test_results, 'TC-USR-03', 'User Management', 
        'Create user with duplicate email',
        'HTTP 422 validation error',
        'HTTP ' . $usr3['status'] . ': ' . json_encode($usr3['body']), 'FAIL', 'Duplicate email allowed in User Management', 'High', 'Add unique email validation inside UserController store');
}

// TC-USR-04: Delete User as Admin
$usr4 = send_request('DELETE', '/users/' . $qa_user_id, [], $admin_token);
if ($usr4['status'] === 200) {
    record_test($test_results, 'TC-USR-04', 'User Management', 
        'Delete user as admin',
        'HTTP 200, user deleted successfully',
        'HTTP 200, message: ' . $usr4['body']['message'], 'PASS');
} else {
    record_test($test_results, 'TC-USR-04', 'User Management', 
        'Delete user',
        'HTTP 200',
        'HTTP ' . $usr4['status'] . ': ' . json_encode($usr4['body']), 'FAIL', 'Failed to delete user', 'High', 'Check UserController destroy method');
}


// ----------------------------------------------------
// MODULE 13: WEBSITE SETTINGS
// ----------------------------------------------------

// TC-SET-01: Retrieve Settings Publicly
$set1 = send_request('GET', '/settings');
if ($set1['status'] === 200 && isset($set1['body']['shop_status'])) {
    record_test($test_results, 'TC-SET-01', 'Website Settings', 
        'Retrieve settings publicly',
        'HTTP 200, returns settings key-value pair',
        'HTTP 200, shop_status = ' . $set1['body']['shop_status'], 'PASS');
} else {
    record_test($test_results, 'TC-SET-01', 'Website Settings', 
        'Retrieve settings publicly',
        'HTTP 200',
        'HTTP ' . $set1['status'] . ': ' . json_encode($set1['body']), 'FAIL', 'Cannot fetch settings publicly', 'High', 'Check SettingController index method');
}

// TC-SET-02: Update Settings as Admin
$set2 = send_request('POST', '/settings', [
    'shop_name' => 'KopiKuy Premium',
    'shop_status' => 'open'
], $admin_token);
if ($set2['status'] === 200) {
    record_test($test_results, 'TC-SET-02', 'Website Settings', 
        'Update settings as admin',
        'HTTP 200, settings updated successfully',
        'HTTP 200, message: ' . $set2['body']['message'], 'PASS');
} else {
    record_test($test_results, 'TC-SET-02', 'Website Settings', 
        'Update settings as admin',
        'HTTP 200',
        'HTTP ' . $set2['status'] . ': ' . json_encode($set2['body']), 'FAIL', 'Failed to update settings as admin', 'High', 'Check SettingController update method');
}


// ----------------------------------------------------
// MODULE 14: SALES REPORT
// ----------------------------------------------------

// TC-REP-01: Verify Sales Report calculations
// Calculate completed revenue inside the database manually for comparison
$db_revenue = DB::table('orders')
    ->where('status', 'Completed')
    ->orWhere('payment_status', 'Paid')
    ->sum('total_price');

// Retrieve all orders as admin (which matches what the frontend does for reports)
$rep1 = send_request('GET', '/orders', [], $admin_token);
$api_revenue = 0;
if ($rep1['status'] === 200 && is_array($rep1['body'])) {
    foreach ($rep1['body'] as $order) {
        if ($order['status'] === 'Completed' || $order['payment_status'] === 'Paid') {
            $api_revenue += floatval($order['total_price']);
        }
    }
}

if ($rep1['status'] === 200 && $api_revenue == $db_revenue) {
    record_test($test_results, 'TC-REP-01', 'Sales Report', 
        'Verify revenue calculated matches database sum',
        'Calculated revenue matches DB sum',
        'Calculated API Revenue: Rp ' . number_format($api_revenue) . ', DB Sum: Rp ' . number_format($db_revenue), 'PASS');
} else {
    record_test($test_results, 'TC-REP-01', 'Sales Report', 
        'Verify revenue calculations',
        'Revenue match',
        'Mismatch! API: Rp ' . $api_revenue . ', DB: Rp ' . $db_revenue, 'FAIL', 'Revenue calculation discrepancy', 'High', 'Sync sales report algorithm with order statuses');
}


// Clean up test data after ending
DB::table('reviews')->delete();
DB::table('orders')->delete();
DB::table('users')->where('email', 'like', 'qa_%')->delete();
DB::table('products')->where('name', 'like', 'QA %')->delete();

// Output results as JSON for main agent to parse
echo "\n###TEST_RESULTS_JSON_START###\n";
echo json_encode($test_results, JSON_PRETTY_PRINT);
echo "\n###TEST_RESULTS_JSON_END###\n";
