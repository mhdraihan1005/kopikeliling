<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Make user_id nullable
            $table->unsignedBigInteger('user_id')->nullable()->change();
            
            // Add new columns
            $table->string('fulfillment_type')->default('Dine In')->after('items');
            $table->string('table_number')->nullable()->after('fulfillment_type');
            $table->string('guest_name')->nullable()->after('table_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->dropColumn(['fulfillment_type', 'table_number', 'guest_name']);
        });
    }
};
