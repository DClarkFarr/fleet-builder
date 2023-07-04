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
        Schema::table('abilities', function (Blueprint $table) {
            $table->float('step_value')->after('amounts')->nullable();
            $table->boolean('has_condition_boost')->after('conditions')->default(false);
            $table->text('condition_boost')->after('has_condition_boost')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('abilities', function (Blueprint $table) {
            $table->dropColumn('step_value');
            $table->dropColumn('has_condition_boost');
            $table->dropColumn('condition_boost');
        });
    }
};
