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
        $madaData = DB::table('OurWorldIndata')
                ->select('total_cases','new_cases', 'total_deaths', 'new_deaths', 'date')
                ->where('location', 'Madagascar')
                ->get();
        $madaData = json_encode($madaData);
        
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
        $madaPerRegion = json_encode(Mada::all());


        //  Recuperation des 10 premiers pays les plus touchees

        $mostCasesInCountry = DB::table('Latest')
                ->select('Country','total_cases', 'total_deaths')
                ->limit(10)
                ->get();
        $mostCasesInCountry = json_encode($mostCasesInCountry);

        //  Affichage de la page
        return view('dashboard', compact('lastCases', 'madaPerRegion', 'madaData', 'mostCasesInCountry'));
    }

    
}
