<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menuItems = [
            ['name' => 'Espresso', 'description' => 'Rich black coffee with a strong flavor and intense aroma', 'price' => 15000, 'image' => '/espresso.jpg', 'rating' => '4.8', 'prepTime' => '2 min', 'category' => 'Hot Coffee'],
            ['name' => 'Cappuccino', 'description' => 'A perfect blend of espresso, steamed milk, and foam', 'price' => 20000, 'image' => '/cappuccino.jpg', 'rating' => '4.9', 'prepTime' => '3 min', 'category' => 'Hot Coffee'],
            ['name' => 'Latte', 'description' => 'Espresso with creamy and smooth steamed milk', 'price' => 22000, 'image' => '/latte.jpg', 'rating' => '4.7', 'prepTime' => '3 min', 'category' => 'Hot Coffee'],
            ['name' => 'Cold Brew', 'description' => 'Cold coffee brewed for 12 hours for a smooth taste', 'price' => 18000, 'image' => '/coldbrew.jpg', 'rating' => '4.6', 'prepTime' => '1 min', 'category' => 'Cold Coffee'],
            ['name' => 'Iced Latte', 'description' => 'Refreshing iced latte with ice', 'price' => 24000, 'image' => '/icedlatte.jpg', 'rating' => '4.8', 'prepTime' => '2 min', 'category' => 'Cold Coffee'],
            ['name' => 'Mocha', 'description' => 'A blend of espresso, chocolate, and steamed milk', 'price' => 25000, 'image' => '/mocha.jpg', 'rating' => '4.9', 'prepTime' => '4 min', 'category' => 'Specialty'],
        ];

        foreach ($menuItems as $item) {
            \App\Models\Product::create($item);
        }
    }
}
