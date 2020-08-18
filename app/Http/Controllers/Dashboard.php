<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Mada;
use \App\CountryData;

class Dashboard extends Controller
{
    //
    public function home(){
        //  Recuperation des donnees totals pour madagascar

        $madaData = json_encode(Mada::all());
        
        //  Recuperation des  derniers nouveau cas

        // $mada = DB::table('madas')->lists('name_region').lists('deces');
        $lastCases = [
            'dates' => ['2020-08-17', '2020-08-18'],
            'new_cases' => [13678, 13789],
            'deaths' => [163, 170],
            'gueris' => [3459, 3678],
        ];
        //  Recuperation des donnees par region a madagascar
        $madaParRegion = '';

        //  Affichage de la page
        return view('dashboard', compact('lastCases', 'madaParRegion', 'madaData', 'mada'));
    }

    
}
