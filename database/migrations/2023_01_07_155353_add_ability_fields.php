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
            $table->text('amounts')->nullable()->after('variants');
            $table->string('repeat_type')->nullable();
            $table->string('repeat')->nullable();
            $table->boolean('flagship_required')->default(false)->after('applies_to_fleet');
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
            //
        });
    }
};
