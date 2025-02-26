<?php

declare(strict_types=1);

namespace App\Actions\Organization;

use App\Tables\OrganizationTable;
use Honed\Action\Contracts\Actionable;

final class Index implements Actionable
{
    /**
     * Display all organizations for the account.
     */
    public function handle(): \Inertia\Response
    {
        $table = OrganizationTable::make();

        return inertia('Organization/Index', [
            'organizations' => $table
        ]);
    }
}
