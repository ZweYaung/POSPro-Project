<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_name',
        'category_id',
        'selling_price',
        'quantity',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
