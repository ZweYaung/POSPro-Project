<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_update_and_delete_a_product(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('products.store'), [
                'product_name' => 'Mocha Latte',
                'category_name' => 'Drinks',
                'selling_price' => '4.50',
                'quantity' => 10,
            ])
            ->assertRedirect(route('products.index'));

        $product = Product::query()->where('product_name', 'Mocha Latte')->first();
        $this->assertNotNull($product);

        $this->actingAs($user)
            ->put(route('products.update', $product), [
                'product_name' => 'Mocha Latte Deluxe',
                'category_name' => 'Premium Drinks',
                'selling_price' => '5.25',
                'quantity' => 7,
            ])
            ->assertRedirect(route('products.index'));

        $product->refresh();
        $this->assertSame('Mocha Latte Deluxe', $product->product_name);
        $this->assertSame(7, $product->quantity);

        $this->actingAs($user)
            ->delete(route('products.destroy', $product))
            ->assertRedirect(route('products.index'));

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
