<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\InventoryLog;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@pospro.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );

        $manager = User::firstOrCreate(
            ['email' => 'manager@pospro.com'],
            [
                'name' => 'Manager User',
                'password' => bcrypt('password'),
                'role' => 'manager',
            ]
        );

        $cashier = User::firstOrCreate(
            ['email' => 'cashier@pospro.com'],
            [
                'name' => 'Cashier User',
                'password' => bcrypt('password'),
                'role' => 'cashier',
            ]
        );

        $this->command->info('Users created successfully');

        $categories = [
            'Electronics',
            'Clothing',
            'Food',
            'Beverages',
            'Home & Garden',
            'Toys',
            'Books',
            'Health & Beauty',
            'Sports',
            'Automotive'
        ];

        $categoryIds = [];
        foreach ($categories as $catName) {
            $category = Category::firstOrCreate(['category_name' => $catName]);
            $categoryIds[] = $category->id;
        }

        $this->command->info('Categories created successfully');

        if (Product::count() === 0) {
            $productNames = [
                'iPhone 15 Pro', 'Samsung Galaxy S24', 'Sony Headphones',
                'Nike Running Shoes', 'Adidas T-Shirt', "Levi's Jeans",
                'Coffee Maker', 'Blender', 'Toaster',
                'Desk Lamp', 'Office Chair', 'Bookshelf',
                'Toy Car', 'Lego Set', 'Board Game',
                'Cookbook', 'Notebook', 'Pen Set',
                'Shampoo', 'Soap', 'Lotion',
                'Basketball', 'Yoga Mat', 'Dumbbell',
                'Car Wax', 'Tire Inflator', 'Oil Filter',
                'Laptop Bag', 'Water Bottle', 'Desk Organizer',
                'Wall Clock', 'Picture Frame', 'Vase',
                'Necklace', 'Bracelet', 'Watch',
                'Sunglasses', 'Backpack', 'Wallet',
                'Umbrella', 'Slippers', 'Blanket',
                'Pillow', 'Towels', 'Cutlery Set'
            ];

            foreach (range(1, 50) as $i) {
                $name = $productNames[array_rand($productNames)] . ' ' . rand(100, 999);
                $categoryId = $categoryIds[array_rand($categoryIds)];

                Product::create([
                    'product_name' => $name,
                    'category_id' => $categoryId,
                    'selling_price' => rand(5, 500) + 0.99,
                    'quantity' => rand(0, 100),
                    'created_at' => now()->subDays(rand(1, 180)),
                    'updated_at' => now(),
                ]);
            }
            $this->command->info('50 products created successfully');
        } else {
            $this->command->info('Products already exist');
        }

        if (Sale::count() === 0) {
            $users = User::all();
            $paymentMethods = ['Cash', 'Card'];
            $products = Product::all();

            for ($s = 0; $s < 30; $s++) {
                $sale = Sale::create([
                    'user_id' => $users->random()->id,
                    'sale_date' => now()->subDays(rand(1, 30))->setTime(rand(8, 20), rand(0, 59)),
                    'total_amount' => 0,
                    'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                ]);

                $numItems = rand(1, 5);
                $total = 0;
                $productsList = $products->random(min(10, $products->count()));

                for ($i = 0; $i < $numItems; $i++) {
                    $product = $productsList->random();
                    $quantity = rand(1, 3);
                    $unitPrice = $product->selling_price;
                    $subtotal = $quantity * $unitPrice;
                    $total += $subtotal;

                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'subtotal' => $subtotal,
                    ]);
                }

                $sale->update(['total_amount' => $total]);
            }
            $this->command->info('30 sales created successfully');
        } else {
            $this->command->info('Sales already exist');
        }

        if (InventoryLog::count() === 0) {
            $products = Product::all();
            $users = User::all();
            $changeTypes = ['sale', 'purchase', 'adjustment'];

            foreach ($products->take(min(30, $products->count())) as $product) {
                $numLogs = rand(1, 3);
                for ($i = 0; $i < $numLogs; $i++) {
                    $changeType = $changeTypes[array_rand($changeTypes)];
                    $quantityChange = $changeType === 'sale'
                        ? rand(-10, -1)
                        : rand(1, 20);

                    InventoryLog::create([
                        'product_id' => $product->id,
                        'user_id' => $users->random()->id,
                        'quantity_change' => $quantityChange,
                        'change_type' => $changeType,
                        'log_date' => now()->subDays(rand(1, 30)),
                    ]);
                }
            }
            $this->command->info('Inventory logs created successfully');
        } else {
            $this->command->info('Inventory logs already exist');
        }

        $this->command->newLine();
        $this->command->info('Seeding completed');
        $this->command->info('Users: ' . User::count());
        $this->command->info('Categories: ' . Category::count());
        $this->command->info('Products: ' . Product::count());
        $this->command->info('Sales: ' . Sale::count());
        $this->command->info('Sale Items: ' . SaleItem::count());
        $this->command->info('Inventory Logs: ' . InventoryLog::count());
        $this->command->newLine();
        $this->command->info('Admin: admin@pospro.com / password');
        $this->command->info('Manager: manager@pospro.com / password');
        $this->command->info('Cashier: cashier@pospro.com / password');
    }
}
