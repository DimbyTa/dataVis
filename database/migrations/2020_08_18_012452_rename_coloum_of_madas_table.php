<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameColoumOfMadasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('madas', function (Blueprint $table) {
            //Checking if column exists
            if(Schema::hasColumn('madas', 'cas_comfirmes')){
                $table->renameColumn('cas_comfirmes', 'cas_confirmes');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('madas', function (Blueprint $table) {
            //
        });
    }
}
