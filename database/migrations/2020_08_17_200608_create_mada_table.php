<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMadaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
	if(!Schema::hasTable('madas')){
        Schema::create('madas', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('cas_comfirmes');
            $table->integer('deces');
            $table->integer('en_traitement');
            $table->integer('formes_graves');
            $table->integer('gueris');
            $table->string('name_region');
            $table->date('date');
	});
	}
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mada');
    }
}
