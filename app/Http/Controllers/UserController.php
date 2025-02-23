<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Models\User\Index;
use App\Models\User;
use App\Tables\UserTable;
use Illuminate\Http\Request;

final class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Index $action): \Inertia\Response
    {
        $this->authorize('index', User::class);

        return $action->handle();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
