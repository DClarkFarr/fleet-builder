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
        Schema::create('abilities', function (Blueprint $table) {
            $table->id('id_ability');
            $table->integer('abilities_id')->index();
            $table->string('abilities_type')->index();
            $table->string('location', 75)->index()->nullable();
            $table->string('type', 75)->index();
            $table->text('variants')->nullable();
            $table->string('amount_type')->nullable();
            $table->string('amount')->nullable();
            $table->text('weapon_classes')->nullable();
            $table->text('weapon_sizes')->nullable();
            $table->text('notes')->nullable();
            $table->string('duration_type')->nullable();
            $table->string('duration')->nullable();
            $table->boolean('applies_to_fleet')->default(false);
            $table->text('for_class_ids')->nullable();
            $table->text('target_class_ids')->nullable();
            $table->text('conditions')->nullable();

            $table->index(['abilities_id', 'abilities_type'], 'abilities');
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
        Schema::dropIfExists('abilities');
    }
};
