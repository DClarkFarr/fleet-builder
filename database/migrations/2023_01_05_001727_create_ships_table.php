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
        /*
        id_ship
        id_class
        id_level
        energy
        name
        public
         */
        Schema::create('ships', function (Blueprint $table) {
            $table->id('id_ship');
            $table->integer('id_class')->index();
            $table->integer('id_level')->index();
            $table->integer('energy');
            $table->string('name', 150);
            $table->boolean('public')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ships');
    }
};
