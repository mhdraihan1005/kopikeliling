<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Product;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        // check if review already exists
        $existing = Review::where('order_id', $validated['order_id'])
                          ->where('product_id', $validated['product_id'])
                          ->first();
        if ($existing) {
            return response()->json(['message' => 'Review already submitted for this product.'], 400);
        }

        $review = Review::create($validated);

        // Update product average rating
        $product = Product::findOrFail($validated['product_id']);
        $avgRating = Review::where('product_id', $product->id)->avg('rating');
        $product->update(['rating' => number_format($avgRating, 1)]);

        return response()->json($review, 201);
    }

    public function index()
    {
        $reviews = Review::with(['product.images', 'order.user'])->orderBy('created_at', 'desc')->get();
        return response()->json($reviews);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $productId = $review->product_id;
        $review->delete();

        // Update product average rating after deletion
        $product = Product::findOrFail($productId);
        $avgRating = Review::where('product_id', $product->id)->avg('rating') ?? 0;
        $product->update(['rating' => number_format($avgRating, 1)]);

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
