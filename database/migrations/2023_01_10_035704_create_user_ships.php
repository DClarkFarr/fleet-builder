<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_ships', function (Blueprint $table) {
            $table->id('id_user_ship');
            $table->integer('id_user')->index();
            $table->integer('id_ship')->index();
            $table->string('name')->nullable();
            $table->integer('chip_level')->default(1);
            $table->boolean('visible');

            $table->timestamps();
            $table->index(['id_user', 'id_ship'], 'user_ship');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_ships');
    }
};
