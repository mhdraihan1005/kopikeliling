<?php
App\Models\Product::withCount('reviews')->having('reviews_count', '=', 0)->get()->each(function($p) { $p->update(['rating' => '0.0']); });
