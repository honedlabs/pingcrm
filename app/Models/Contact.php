<?php

declare(strict_types=1);

namespace App\Models;

use App\Builders\ContactBuilder;
use App\Concerns\HasAccount;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Contact extends Model
{
    /** @use HasFactory<\Database\Factories\ContactFactory> */
    use HasFactory;
    use SoftDeletes;
    use HasAccount;

    /**
     * Get the organization that the contact belongs to.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
    
	/**
	 * Create a new Contact query builder for the model.
	 *
	 * @return \App\Builders\ContactBuilder
	 */
	public function newEloquentBuilder($query)
	{
		return new ContactBuilder($query);
	}

	/**
	 * Begin querying the model.
	 *
	 * @return \App\Builders\ContactBuilder
	 */
	public static function query()
	{
		return parent::query();
	}
}
