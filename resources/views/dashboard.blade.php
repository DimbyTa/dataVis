@extends('templates.default')
@section('content')
<div class="container ">
    <div class="tableau-resume">
        <div class="col-md-8">
            <h2><?=$lastCases['dates'][1]?> </h2>
            <table class="table">
                <thead>
                    <tr>
                        <th></th>
                        <th><?=$lastCases['dates'][0]?></th>
                        <th><?=$lastCases['dates'][1]?></th>
                        <th></th>
                    </tr>
                </thead>
                <tr>
                        <th>Nouveau cas</th>
                        <td><?=$lastCases['new_cases'][0]?></td>
                        <td><?=$lastCases['new_cases'][1]?></td>
                        <td><?=$lastCases['new_cases'][1] - $lastCases['new_cases'][0]?></td>
                    </tr>
                    <tr>
						<th>Gueris</th>
                        <td><?=$lastCases['gueris'][0]?></td>
                        <td><?=$lastCases['gueris'][1]?></td>
                        <td><?=$lastCases['gueris'][1] - $lastCases['gueris'][0]?></td>
                    </tr>
					<tr>
						<th>Déces</th>
                        <td><?=$lastCases['deaths'][0]?></td>
                        <td><?=$lastCases['deaths'][1]?></td>
                        <td><?=$lastCases['deaths'][1] - $lastCases['deaths'][0]?></td>
                    </tr>
                
                </tbody>
            </table>
        </div>
    </div>
	<section class="section-diagrame">
		<div class="row">
			<div class="col-md-3">
				<h2 class="titre-diagrame">Nouveau cas</h2>
				<p>
					Ce graphe montre l'évolution de la pandemie 
					ici à Madagascar en affichant les nombres de 
					nouveaux cas depuis	<em>21 Mars 2020</em> .
				</p>
			</div>
			<div class="col-md-7">
				<div class="section">
					<div class="card">
						<div class="card-header"><h4></h4></div>
						<div class="card_body" style="padding: 1.25rem">
							<div id="newCases">
								<svg width="100%" height="400px"></svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<hr>
	<section class="section-diagrame">
		<div class="row">
			<div class="col-md-7">
				<div class="section">
					<div class="card">
						<div class="card-header"><h4></h4></div>
						<div class="card-body"  style="padding: 1.25rem">
							<div id="casesCumul">
								<svg width="100%" height="400px"></svg>						
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-3">
				<h2 class="diagrame-title">Cas cumulés à echelle linéaire</h2>
				Ce diagramme represente les nombres des cas depuis le debut du premier cas,
				en Mars 2020, les données sont representer  à une echelle linéaire
			</div>
		</div>
	</section>
	<section class="section-diagrame">
		<div class="row">
			<div class="col-md-3">
			<h2 class="diagrame-title">Cas cumulés à echelle logarithmique</h2>
				En revanche, ceci utilise l'echelle logarithmique qui permet d'evaluer l'ordre de 
				grandeur des nombres de cas.
			</div>
			<div class="col-md-7">
				<div class="section">
					<div class="card">
						<div class="card-header"><h4></h4></div>
						<div class="card-body"  style="padding: 1.25rem">
							<div id="casesCumulLog">
								<svg width="100%" height="400px"></svg>						
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<hr>
	<section class="section-diagrame">
		<div class="row">
			<div class="col-md-7">
				<div class="section">
					<div class="card">
						<div class="card-header"><h4>Cas par région</h4></div>
						<div class="card-body"  style="padding: 1.25rem">
							<div id="casesPerRegion">
								<svg width="100%" height="400px"></svg>						
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-3">
			<h2 class="diagrame-title">Statistique par région</h2>
				Un résume de toutes les données dans toutes les régions de Madagascar

			</div>
		</div>
	</section>
</div>
@endsection

@section('jsImport')
<script> var madaData = <?=$madaData?>;</script>
@endsection