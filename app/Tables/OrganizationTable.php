<?php

declare(strict_types=1);

namespace App\Tables;

use App\Enums\AppIcon;
use Honed\Table\Table;
use App\Models\Organization;
use Honed\Action\BulkAction;
use Honed\Action\PageAction;
use Honed\Refine\Sorts\Sort;
use Honed\Action\InlineAction;
use Honed\Table\Columns\Column;
use Honed\Table\Filters\Filter;
use Honed\Table\Columns\KeyColumn;
use Honed\Refine\Filters\SetFilter;
use Honed\Table\Columns\DateColumn;
use Honed\Table\Columns\TextColumn;
use Honed\Table\Columns\NumberColumn;
use Honed\Refine\Filters\CallbackFilter;

final class OrganizationTable extends Table
{
    public $toggle = true;

    // public $remember = true;
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
            TextColumn::make('name')
                ->sortable()
                ->searchable()
                ->always(),
            TextColumn::make('email')
                ->sortable()
                ->searchable(),
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
            ])->multiple(),
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
            Sort::make('created_at')->default()
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
            InlineAction::make('view', 'View')
                ->default()
                ->icon(AppIcon::View)
                ->route(fn ($organization) => route('organizations.show', $organization->id)),
                
            InlineAction::make('edit', 'Edit')
                ->icon(AppIcon::Edit)
                ->route(fn ($organization) => route('organizations.edit', $organization->id)),

            InlineAction::make('delete', 'Delete')
                ->icon(AppIcon::Delete)
                ->allow(fn ($organization) => ($organization->id % 2) === 0)
                ->action(fn ($organization) => $organization->delete()),

            BulkAction::make('delete', 'Delete')
                ->icon(AppIcon::Delete)
                ->action(fn ($organization) => $organization->delete()),

            BulkAction::make('touch')
                ->icon(AppIcon::Touch)
                ->action(fn ($organizations) => $organizations
                    ->each(fn ($organization) => $organization->touch())
                ),

            PageAction::make('create')
                
                ->route('organizations.create')

        ];
    }
}