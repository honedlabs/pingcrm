<?php

namespace App\Tables;

use App\Models\User;
use Honed\Table\Table;
use Honed\Table\Sorts\Sort;
use Honed\Table\Columns\Column;
use Honed\Table\Filters\Filter;
use Honed\Table\Actions\BulkAction;
use Honed\Table\Actions\PageAction;
use Honed\Table\Actions\InlineAction;
use Illuminate\Contracts\Database\Query\Builder;

class UserTable extends Table
{
    public $search = [];
    public $count = 10;

    /**
     * Define the database resource to use.
     * 
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function resource()
    {
        return User::query();
        // return Model::query();
    }

    /**
     * Define the columns to apply.
     * 
     * @return array<int, \Honed\Table\Columns\BaseColumn>
     */
    public function columns(): array
    {
        return [
            Column::make('id')->key(),
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