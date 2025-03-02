<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Country extends Model
{
    protected $hidden = [
        'id',
    ];

    public function organizations(): HasMany
    {
        return $this->hasMany(Organization::class);
    }
}
