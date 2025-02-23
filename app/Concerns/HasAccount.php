<?php

declare(strict_types=1);

namespace App\Concerns;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Account;
use App\Models\Scopes\AccountScope;

/**
 * This trait must only be applied to classes extending 
 * \Illuminate\Database\Eloquent\Model.
 * 
 * @phpstan-require-extends \Illuminate\Database\Eloquent\Model
 */
trait HasAccount
{
    /**
     * Boot the HasAccount trait to register the account scope.
     */
    public static function bootHasAccount(): void
    {
        static::addGlobalScope(new AccountScope());
    }

    /**
     * Get the account that the model belongs to.
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}