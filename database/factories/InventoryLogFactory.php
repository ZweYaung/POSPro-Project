<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryLogFactory extends Factory
{
    public function definition(): array
    {
        $changeTypes = ['sale', 'purchase', 'adjustment', 'return'];
        $changeType = $this->faker->randomElement($changeTypes);

        $quantityChange = $changeType === 'sale'
            ? $this->faker->numberBetween(-20, -1)
            : $this->faker->numberBetween(1, 50);

        return [
            'product_id' => Product::factory(),
            'user_id' => User::factory(),
            'quantity_change' => $quantityChange,
            'change_type' => $changeType,
            'log_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
