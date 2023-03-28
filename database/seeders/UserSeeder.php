<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        collect([
            [
                'name' => 'IT RSBM',
                // 'username' => 'maesa',
                // 'address' => 'Pemogan',
                'email' => 'teamit@gmail.com',
                'email_verified_at' => now(),
                'password' => bcrypt('rsbm')
            ],
        ])->each(fn ($q)=>User::create($q));
    }
}
