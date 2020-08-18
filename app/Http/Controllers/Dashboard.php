<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Mada;
use \App\CountryData;
use DB;

class Dashboard extends Controller
{
    //
    public function home(){
        //  Recuperation des donnees totals pour madagascar

        $madaData = json_encode(Mada::all());
        
        //  Recuperation des  derniers nouveau cas

        $mada = DB::table('OurWorldIndata')
                ->select('total_cases', 'total_deaths', 'date')
                ->orderByDesc('date')
                ->where('location', 'Madagascar')
                ->limit(2)
            ->get();
        $lastCases = [
            'dates' => [$mada[1]->date, $mada[0]->date],
            'new_cases' => [$mada[1]->total_cases, $mada[0]->total_cases],
            'deaths' => [$mada[1]->total_deaths, $mada[0]->total_deaths]
            // 'gueris' => [3459, 3678],
        ];
        //  Recuperation des donnees par region a madagascar
        $madaParRegion = '';

        //  Affichage de la page
        return view('dashboard', compact('lastCases', 'madaParRegion', 'madaData', 'mada'));
    }

    
}
