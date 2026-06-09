<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'shop_name' => 'E-Coffee Keliling',
            'shop_address' => '123 Coffee St, Jakarta, Indonesia',
            'shop_phone' => '08123456789',
            'shop_instagram' => '@ecoffee.keliling',
            'shop_status' => 'open', // open or closed
            'shop_open_hours' => '08:00 - 20:00',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
