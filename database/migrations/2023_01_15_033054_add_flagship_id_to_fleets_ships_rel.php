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
        Schema::table('workshop_fleet_rel', function (Blueprint $table) {
            $table->boolean('flagship')->nullable()->after('id_user_ship');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('workshop_fleet_rel', function (Blueprint $table) {
            $table->dropColumn('flagship');
        });
    }
};
