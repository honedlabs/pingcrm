<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->foreignId('organization_id')->nullable()->constrained()->onDelete('set null');
            $table->string('first_name', 64);
            $table->string('last_name', 64);
            $table->string('email', 64)->nullable();
            $table->string('phone', 64)->nullable();
            $table->string('address', 128)->nullable();
            $table->string('city', 64)->nullable();
            $table->string('region', 64)->nullable();
            $table->string('country', 2)->nullable();
            $table->string('postal_code', 32)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
