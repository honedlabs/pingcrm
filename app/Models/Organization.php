<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\HasAccount;
use App\Contracts\ForAccount;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class Organization extends Model implements ForAccount
{
    /** @use HasFactory<\Database\Factories\OrganizationFactory> */
    use HasFactory;
    use SoftDeletes;
    use HasAccount;

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}
