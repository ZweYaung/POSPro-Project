<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if(!User::where('email', 'admin@pospro.com')->exists()) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@pospro.com',
                'password' => Hash::make('1*AdminPOSpro'),
                'role' => 'Admin'
            ]);
        }
    }
}
