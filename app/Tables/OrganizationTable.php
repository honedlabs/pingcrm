<?php

declare(strict_types=1);

namespace App\Tables;

use Honed\Table\Table;
use App\Models\Organization;
use Honed\Refine\Filters\SetFilter;
use Honed\Refine\Sorts\Sort;
use Honed\Table\Columns\Column;
use Honed\Table\Filters\Filter;
use Honed\Table\Columns\KeyColumn;
use Honed\Table\Actions\BulkAction;
use Honed\Table\Actions\PageAction;
use Honed\Table\Columns\DateColumn;
use Honed\Table\Columns\TextColumn;
use Honed\Table\Actions\InlineAction;
use Honed\Table\Columns\NumberColumn;
use Illuminate\Contracts\Database\Query\Builder;

final class OrganizationTable extends Table
{
    public $pagination = [5, 10, 25, 50, 100];

    public function resource()
    {
        return Organization::query()
            ->withCount('contacts');
    }

    /**
     * Define the columns to apply.
     * 
     * @return array<int, \Honed\Table\Columns\BaseColumn>
     */
    public function columns(): array
    {
        return [
            KeyColumn::make('id'),
            TextColumn::make('name')->sortable()->searchable()->always(),
            TextColumn::make('email')->sortable()->searchable(),
            TextColumn::make('phone'),
            TextColumn::make('address'),
            NumberColumn::make('contacts_count', 'Contacts')->sortable(),
            TextColumn::make('city')->sometimes(),
            TextColumn::make('region')->sometimes(),
            TextColumn::make('country')->sometimes(),
            TextColumn::make('postal_code')->sometimes(),
            DateColumn::make('created_at', 'Created')->sortable()->sometimes(),
        ];
    }

    /**
     * Define the filters available to refine the resource query.
     * 
     * @return array<int, \Honed\Table\Filters\BaseFilter>
     */
    public function filters(): array
    {
        return [
            SetFilter::make('country')->options([
                'US' => 'United States',
                'CA' => 'Canada',
                'MX' => 'Mexico',
                'GB' => 'United Kingdom',
                'AU' => 'Australia',
                'NZ' => 'New Zealand',
            ])
        ];
    }

    /**
     * Define the sorts available to order the records.
     * 
     * @return array<int, \Honed\Table\Sorts\BaseSort>
     */
    public function sorts(): array
    {
        return [
            Sort::make('city', 'City A-Z')->asc(),
            Sort::make('city', 'City Z-A')->desc(),
        ];
    }

    /**
     * Define the actions available on the records, or the page itself.
     * 
     * @return array<int, \Honed\Table\Actions\BaseAction>
     */
    public function actions(): array
    {
        return [

        ];
    }
}