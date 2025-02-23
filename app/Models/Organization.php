<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\HasAccount;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Organization extends Model
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
