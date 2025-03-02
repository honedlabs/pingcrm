<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use App\Models\Account;
use App\Models\Country;
use App\Models\Organization;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Country::create([
            'name' => 'United States',
            'code' => 'US',
        ]);

        Country::create([
            'name' => 'Canada',
            'code' => 'CA',
        ]);

        Country::create([
            'name' => 'Mexico',
            'code' => 'MX',
        ]);

        Country::create([
            'name' => 'United Kingdom',
            'code' => 'GB',
        ]);

        Country::create([
            'name' => 'Australia',
            'code' => 'AU',
        ]);

        Country::create([
            'name' => 'New Zealand',
            'code' => 'NZ',
        ]);

        $account = Account::factory()
            ->has(User::factory(1)
                ->state([
                    'first_name' => 'John',
                    'last_name' => 'Doe',
                    'email' => 'johndoe@example.com',
                    'password' => 'secret',
                    'owner' => true,
                ])
            )
            ->has(User::factory(5))
            ->has(Organization::factory(100))
            ->create(['name' => 'Acme Corporation']);

        $organization_ids = Organization::query()
            ->where('account_id', $account->id)
            ->pluck('id');

        // Contact::factory(100)
        //     ->state([
        //         'account_id' => $account->id,
        //     ])
        //     ->create()
        //     ->each(fn (Contact $contact) => $contact->update([
        //         'organization_id' => $organization_ids->random(),
        //     ]));
    }
}
