<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Coffee Admin',
            'email' => 'admin@email.com',
            'password' => 'password123',
            'role' => 'admin'
        ]);

        User::factory()->create([
            'name' => 'Loyal Customer',
            'email' => 'customer@email.com',
            'password' => 'password123',
            'role' => 'customer'
        ]);

        $this->call([
            ProductSeeder::class
        ]);
    }
}
