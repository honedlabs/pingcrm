<?php

declare(strict_types=1);

namespace App\Actions\Organization;

use App\Models\Organization;
use Honed\Action\Contracts\Actionable;
use Honed\Modal\Modal;

final class Edit implements Actionable
{
    /**
     * Handle the action.
     */
    public function handle(Organization $organization): Modal
    {
        return inertia()->modal('Organization/Edit', [
            'organization' => $organization,
        ])->baseRoute('organizations.index');
    }
}
