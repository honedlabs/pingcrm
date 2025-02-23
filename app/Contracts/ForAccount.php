<?php

declare(strict_types=1);

namespace App\Contracts;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

interface ForAccount
{
    /**
     * Get the account that the model belongs to.
     */
    public function account(): BelongsTo;
}
