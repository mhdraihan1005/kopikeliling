<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('image_url');
            $table->timestamps();
        });

        // Migrate existing old 'image' from products table
        $products = DB::table('products')->whereNotNull('image')->where('image', '!=', '')->get();
        foreach ($products as $product) {
            $images = explode(',', $product->image);
            foreach ($images as $img) {
                if (trim($img) !== '') {
                    DB::table('product_images')->insert([
                        'product_id' => $product->id,
                        'image_url' => trim($img),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
