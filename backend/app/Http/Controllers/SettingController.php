<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;

class SettingController extends Controller
{
    public function index()
    {
        return response()->json(Setting::all()->pluck('value', 'key'));
    }

    public function update(Request $request)
    {
        $allowedKeys = [
            'shop_name',
            'shop_address',
            'shop_phone',
            'shop_instagram',
            'shop_status',
            'shop_open_hours'
        ];

        $settings = $request->only($allowedKeys);
        
        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
