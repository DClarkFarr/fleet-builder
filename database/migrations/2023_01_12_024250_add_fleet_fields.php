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
        Schema::table('workshop_fleets', function (Blueprint $table) {
            $table->string('location', 25)->index()->after('name');
            $table->integer('leadership')->after('location');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('workshop_fleets', function (Blueprint $table) {
            $table->dropColumn('location');
            $table->dropColumn('leadership');
        });
    }
};
