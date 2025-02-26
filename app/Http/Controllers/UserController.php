<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Actions\Models\User\EditUser;
use App\Actions\Models\User\IndexUser;
use App\Actions\Models\User\StoreUser;
use App\Actions\Models\User\CreateUser;
use App\Actions\Models\User\UpdateUser;

final class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(IndexUser $action)
    {
        $this->authorize('viewAny', User::class);

        return $action->handle();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(CreateUser $action)
    {
        $this->authorize('create', User::class);

        return $action->handle();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, StoreUser $action)
    {
        $this->authorize('create', User::class);

        return $action->handle();
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user, $action)
    {
        $this->authorize('view', $user);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user, EditUser $action)
    {
        $this->authorize('update', $user);

        return $action->handle();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user, UpdateUser $action)
    {
        $this->authorize('update', $user);

        return $action->handle();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $user->delete();

        return to_route('users.index');
    }
}
