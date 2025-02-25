<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Honed\Nav\Facades\Nav;
use Illuminate\Http\Request;

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

    /**
     * Show the form for editing the resource.
     */
    public function edit()
    {
        //
    }

    /**
     * Update the resource in storage.
     */
    public function update(Request $request)
    {
        //
    }

    /**
     * Remove the resource from storage.
     */
    public function destroy(): never
    {
        abort(404);
    }
}
