<?php

declare(strict_types=1);

namespace App\Actions\Models\User;

use App\Tables\UserTable;
use Honed\Action\Contracts\Actionable;

final class IndexUser implements Actionable
{
    /**
     * Handle the action.
     */
    public function handle(): \Inertia\Response
    {
        $table = UserTable::make();

        return inertia('Users/Index')
            ->with('users', $table);
    }
}
