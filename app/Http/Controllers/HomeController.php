<?php

namespace App\Http\Controllers;

use App\Tables\UserTable;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function __invoke()
    {
        return inertia('Welcome', [
            'users' => UserTable::make()
        ]);
    }
}
