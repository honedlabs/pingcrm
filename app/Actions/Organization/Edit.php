<?php

declare(strict_types=1);

namespace App\Actions\Organization;

use Honed\Action\Contracts\Actionable;
use Honed\Modal\Modal;

final class Edit implements Actionable
{
    /**
     * Handle the action.
     */
    public function handle(): Modal
    {
        return inertia()->modal('Organization/Edit', [
            'organization' => $this->organization,
        ]);
    }
}
