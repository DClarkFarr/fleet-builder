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
        Schema::create('recommendations', function (Blueprint $table) {
            $table->id('id_recommendation');
            $table->integer('id_resource')->index();
            $table->string('resource', 25);
            $table->text('text');
            $table->integer('sort');
            $table->timestamps();
            $table->index(['id_resource', 'resource'], 'id_resource_resource');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('recommendations');
    }
};
