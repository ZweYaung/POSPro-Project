<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_method',
        'total_amount',
        'sale_date',
    ];

    public function customer()
{
    return $this->belongsTo(Customer::class);
}
}
