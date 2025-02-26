<?php

declare(strict_types=1);

namespace App\Http\Controllers;

final class DashboardController extends Controller
{
    /**
     * Display the resource.
     */
    public function show()
    {
        return inertia('Dashboard', [

        ]);
    }
}
