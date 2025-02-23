<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\HasAccount;
use App\Contracts\ForAccount;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}
