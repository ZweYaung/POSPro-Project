<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleFactory extends Factory
{
    public function definition(): array
    {
        $paymentMethods = ['Cash', 'Card'];

        return [
            'user_id' => User::factory(),
            'sale_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'total_amount' => $this->faker->randomFloat(2, 10, 1000),
            'payment_method' => $this->faker->randomElement($paymentMethods),
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
