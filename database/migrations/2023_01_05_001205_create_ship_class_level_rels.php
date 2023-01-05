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
        Schema::create('ship_classes_rel', function (Blueprint $table) {
            $table->integer('id_ship')->index();
            $table->integer('id_class')->index();
            $table->index(['id_ship', 'id_class'], 'ship_class');
        });

        Schema::create('ship_levels_rel', function (Blueprint $table) {
            $table->integer('id_ship')->index();
            $table->integer('id_level')->index();
            $table->index(['id_ship', 'id_level'], 'ship_level');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ship_classes_rel');
        Schema::dropIfExists('ship_levels_rel');
    }
};
