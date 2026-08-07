<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $productNames = [
            'iPhone 15 Pro', 'Samsung Galaxy S24', 'Sony Headphones',
            'Nike Running Shoes', 'Adidas T-Shirt', "Levi's Jeans",
            'Coffee Maker', 'Blender', 'Toaster',
            'Desk Lamp', 'Office Chair', 'Bookshelf',
            'Toy Car', 'Lego Set', 'Board Game',
            'Cookbook', 'Notebook', 'Pen Set',
            'Shampoo', 'Soap', 'Lotion',
            'Basketball', 'Yoga Mat', 'Dumbbell',
            'Car Wax', 'Tire Inflator', 'Oil Filter'
        ];

        return [
            'product_name' => $this->faker->randomElement($productNames) . ' ' . $this->faker->numberBetween(100, 999),
            'selling_price' => $this->faker->randomFloat(2, 5, 500),
            'quantity' => $this->faker->numberBetween(0, 100),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
