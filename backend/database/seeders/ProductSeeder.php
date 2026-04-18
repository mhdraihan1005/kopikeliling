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
            ['name' => 'Espresso', 'description' => 'Kopi hitam pekat dengan rasa kuat dan aroma yang intens', 'price' => 15000, 'image' => '/espresso.jpg', 'rating' => '4.8', 'prepTime' => '2 min', 'category' => 'Hot Coffee'],
            ['name' => 'Cappuccino', 'description' => 'Perpaduan sempurna antara espresso, steamed milk, dan foam', 'price' => 20000, 'image' => '/cappuccino.jpg', 'rating' => '4.9', 'prepTime' => '3 min', 'category' => 'Hot Coffee'],
            ['name' => 'Latte', 'description' => 'Espresso dengan steamed milk yang creamy dan lembut', 'price' => 22000, 'image' => '/latte.jpg', 'rating' => '4.7', 'prepTime' => '3 min', 'category' => 'Hot Coffee'],
            ['name' => 'Cold Brew', 'description' => 'Kopi dingin yang diseduh selama 12 jam untuk rasa yang smooth', 'price' => 18000, 'image' => '/coldbrew.jpg', 'rating' => '4.6', 'prepTime' => '1 min', 'category' => 'Cold Coffee'],
            ['name' => 'Iced Latte', 'description' => 'Latte dingin dengan es yang menyegarkan', 'price' => 24000, 'image' => '/icedlatte.jpg', 'rating' => '4.8', 'prepTime' => '2 min', 'category' => 'Cold Coffee'],
            ['name' => 'Mocha', 'description' => 'Perpaduan espresso, coklat, dan steamed milk', 'price' => 25000, 'image' => '/mocha.jpg', 'rating' => '4.9', 'prepTime' => '4 min', 'category' => 'Specialty'],
        ];

        foreach ($menuItems as $item) {
            \App\Models\Product::create($item);
        }
    }
}
