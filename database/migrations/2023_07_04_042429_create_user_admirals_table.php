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
        Schema::create('user_admirals', function (Blueprint $table) {
            $table->id('id_user_admiral');
            $table->integer('id_user')->index();
            $table->integer('id_admiral')->index();
            $table->boolean('visible')->default(true);
            $table->integer('level')->default(1);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_admirals');
    }
};
