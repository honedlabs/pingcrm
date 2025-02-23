<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Contracts\ForAccount;
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

    /**
     * Determine if the model belongs to the given account identifier.
     */
    public function belongsToAccount(Account|ForAccount|int $model): bool
    {
        if ($model instanceof ForAccount) {
            return $this->account_id === $model->account_id;
        }

        if ($model instanceof Account) {
            return $this->account_id === $model->id;
        }

        return $this->account_id === $model;
    }
}