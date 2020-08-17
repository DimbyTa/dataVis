<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Dashboard extends Controller
{
    //
    public function home(){
        //  Recuperation des donnees totals pour madagascar
        $madaData = '';
        
        //  Recuperation des  derniers nouveau cas
        $lastCases = [
            'dates' => ['2020-08-12', '2020-08-13'],
            'new_cases' => [123, 130],
            'deaths' => [12, 14],
            'gueris' => [50, 55],
        ];
        //  Recuperation des donnees par region a madagascar
        $madaParRegion = '';

        //  Affichage de la page
        return view('dashboard', compact('lastCases', 'madaParRegion', 'madaData'));
    }

    
}
