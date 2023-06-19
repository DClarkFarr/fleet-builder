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
        Schema::table('user_ships', function (Blueprint $table) {
            $table->string('stat_img')->after('columns')->nullable();
            $table->integer('stat_dpr')->after('stat_img')->nullable()->default(null);
            $table->integer('stat_acu')->after('stat_dpr')->nullable()->default(null);
            $table->integer('stat_hp')->after('stat_acu')->nullable()->default(null);
            $table->integer('stat_shd')->after('stat_hp')->nullable()->default(null);
            $table->integer('stat_armor')->after('stat_shd')->nullable()->default(null);
            $table->integer('stat_evd')->after('stat_armor')->nullable()->default(null);
            $table->integer('stat_ftl')->after('stat_evd')->nullable()->default(null);
            $table->integer('stat_stl')->after('stat_ftl')->nullable()->default(null);
            $table->integer('stat_res_kinetic')->after('stat_stl')->nullable()->default(null);
            $table->integer('stat_res_beam')->after('stat_res_kinetic')->nullable()->default(null);
            $table->integer('stat_res_missile')->after('stat_res_beam')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_ships', function (Blueprint $table) {
            $table->dropColumn('stat_img');
            $table->dropColumn('stat_dpr');
            $table->dropColumn('stat_acu');
            $table->dropColumn('stat_hp');
            $table->dropColumn('stat_shd');
            $table->dropColumn('stat_armor');
            $table->dropColumn('stat_evd');
            $table->dropColumn('stat_ftl');
            $table->dropColumn('stat_stl');
        });
    }
};
