<?php

declare(strict_types=1);

namespace App\Builders;

use App\Models\Organization;
use Illuminate\Database\Eloquent\Builder;

/**
* @template TModel of \App\Models\Contact
*/
final class ContactBuilder extends Builder
{
    /**
     * Scope the query to the organization.
     * 
     * @return $this
     */
    public function whereOrganization(Organization $organization): static
    {
        return $this->where('organization_id', $organization->id);
    }
}