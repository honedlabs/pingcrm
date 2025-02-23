<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use App\Models\Account;
use App\Models\Contact;
use App\Models\Organization;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $account = Account::factory()
            ->has(User::factory()
                ->state([
                    'first_name' => 'John',
                    'last_name' => 'Doe',
                    'email' => 'johndoe@example.com',
                    'password' => 'secret',
                    'owner' => true,
                ])
            )
            ->has(User::factory())
            ->has(Organization::factory(100))
            ->create(['name' => 'Acme Corporation']);

        $organization_ids = Organization::query()
            ->where('account_id', $account->id)
            ->pluck('id');

        Contact::factory(100)
            ->for($account)
            ->create()
            ->each(fn (Contact $contact) => $contact->update([
                'organization_id' => $organization_ids->random(),
            ]));
    }
}
