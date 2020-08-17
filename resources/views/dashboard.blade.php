@extends('templates.default')
@section('content')
<div class="container ">
    <div class="tableau-resume">
        <div class="col-md-8">
            <h2>2020 - 08 - 12 </h2>
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
				<h2></h2>
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid beatae suscipit quidem maiores nobis aut reiciendis perferendis nemo, consequatur neque modi eos laudantium aliquam. Ipsum iste minima voluptatibus ad quas!
			</div>
			<div class="col-md-7">
				<div class="section">
					<div class="card">
						<div class="card-header"><h3>Nouveau cas</h3></div>
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
	<section class="section-diagrame">
		<div class="row">
			<div class="col-md-7">
				<div class="section">
					<div class="card">
						<div class="card-header"><h3>Cas cumulés lineaire</h3></div>
						<div class="card-body"  style="padding: 1.25rem">
							<div id="casesCumul">
								<svg width="100%" height="400px"></svg>						
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-3">
			
			</div>
		</div>
	</section>
	<section class="section-diagrame">
		<div class="row">
			<div class="col-md-3">
			</div>
			<div class="col-md-7">
				<div class="section">
					<div class="card">
						<div class="card-header"><h3>Cas cumulés log</h3></div>
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
	<section class="section-diagrame">
		<div class="row">
			<div class="col-md-7">
				<div class="section">
					<div class="card">
						<div class="card-header"><h3>Cas cumulés log</h3></div>
						<div class="card-body"  style="padding: 1.25rem">
							<div id="casesPerRegion">
								<svg width="100%" height="400px"></svg>						
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-3">
			</div>
		</div>
	</section>
</div>
@endsection

@section('jsImport')
<script> var madaData = <?=$madaData?>;</script>
@endsection