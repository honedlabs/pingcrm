<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Actions\Models\User\IndexUser;

final class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(IndexUser $action)
    {
        $this->authorize('index', User::class);

        return $action->handle();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($action)
    {
        $this->authorize('create', User::class);

        return $action->handle();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $action)
    {
        $this->authorize('create', User::class);

        return $action->handle();
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user, $action)
    {
        $this->authorize('show', $user);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user, $action)
    {
        $this->authorize('update', $user);

        return $action->handle();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user, $action)
    {
        $this->authorize('update', $user);

        return $action->handle();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, $action)
    {
        $this->authorize('delete', $user);

        return $action->handle();
    }
}
