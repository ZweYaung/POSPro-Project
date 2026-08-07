<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Sale;
use App\Models\InventoryLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SaleInventoryLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_sale_creation_records_inventory_log(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'quantity' => 10,
            'selling_price' => 40,
        ]);

        $this->actingAs($user);

        $response = $this->post('/sales', [
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 3,
                ],
            ],
            'payment_method' => 'Cash',
        ]);

        $response->assertRedirect('/sales');
        $this->assertDatabaseHas('sales', [
            'user_id' => $user->id,
        ]);
        $this->assertDatabaseHas('inventory_logs', [
            'product_id' => $product->id,
            'user_id' => $user->id,
            'quantity_change' => -3,
            'change_type' => 'sale',
        ]);
        $this->assertEquals(7, $product->fresh()->quantity);
    }
}
