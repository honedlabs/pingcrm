<?php

declare(strict_types=1);

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Vite;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureCommands();
        $this->configureDates();
        $this->configureModels();
        $this->configureUrl();
        $this->configureVite();
    }

    /**
     * It's recommended to use CarbonImmutable as it's immutable and thread-safe to avoid issues with mutability.
     *
     * @see https://dyrynda.com.au/blog/laravel-immutable-dates
     */
    private function configureDates(): void
    {
        Date::use(CarbonImmutable::class);
    }
    
    /**
     * Configure the application's commands.
     */
    private function configureCommands(): void
    {
        DB::prohibitDestructiveCommands(app()->isProduction());
    }

    /**
     * Configure the application's models.
     */
    private function configureModels(): void
    {
        Model::shouldBeStrict();
        Model::unguard();
    }

    /**
     * Configure the application's URL.
     */
    private function configureUrl(): void
    {
        URL::forceHttps(app()->isProduction());
    }

    /**
     * Configure the application's Vite loading strategy.
     */
    private function configureVite(): void
    {
        Vite::useAggressivePrefetching();
    }    
}
