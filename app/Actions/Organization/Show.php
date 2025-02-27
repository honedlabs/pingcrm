<?php

declare(strict_types=1);

namespace App\Actions\Organization;

use App\Models\Organization;
use Honed\Action\Contracts\Actionable;

final class Show implements Actionable
{
    /**
     * Handle the action.
     */
    public function handle(Organization $organization): \Inertia\Response
    {
        // $contacts = ContactTable::make(
        //     fn ($query) => $query->whereOrganization($organization)
        // );

        return inertia('Organization/Show', [
            'organization' => $organization,
        ]);
    }
}
