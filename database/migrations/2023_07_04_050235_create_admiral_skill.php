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
        Schema::create('admiral_skills', function (Blueprint $table) {
            $table->id('id_admiral_skill');
            $table->integer('id_admiral')->index();
            $table->integer('level')->default(0);
            $table->string('location');
            $table->string('name');
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
        Schema::dropIfExists('admiral_skills');
    }
};
