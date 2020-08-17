@extends('templates.default')
@section('jsImport')
<script> var test = <?php echo $test ?>;</script>

@endsection

@section('content')
<div class="container ">
    <div class="row">
        <div class="col-md-8">
            <h2>2020 - 08 - 12 </h2>
            <table class="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>hier</th>
                        <th>aujourd'hui</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tr>
                        <th>Nouveau cas</th>
                        <td>125</td>
                        <td>134</td>
                        <td>234</td>
                    </tr>
                    <tr>
                        <th>Deces</th>
                        <td>125</td>
                        <td>134</td>
                        <td>345</td>
                    </tr>
                <tbody>
                
                </tbody>
            </table>
        </div>
    </div>
    <div class="row">
		<div class="col-md-3">


		</div>
        <div class="col-md-7 col-sm-12">
			<div class="section">
				<div class="card">
					<div class="card-header"><h2>Nouveau cas</h2></div>
					<div class="card_body" style="padding: 1.25rem">
						<div id="newCases">
							<svg width="100%" height="400px"></svg>
						</div>
					</div>
				</div>
			</div>
			<div class="section">
				<div class="card">
					<div class="card-header"><h2>Cas cumulés lineaire</h2></div>
					<div class="card-body"  style="padding: 1.25rem">
						<div id="casesCumul">
							<svg width="100%" height="400px"></svg>						
						</div>
					</div>
				</div>
			</div>
			<div class="section">
				<div class="card">
					<div class="card-header"><h2>Cas cumulés log</h2></div>
					<div class="card-body"  style="padding: 1.25rem">
						<div id="casesCumulLog">
							<svg width="100%" height="400px"></svg>						
						</div>
					</div>
				</div>
			</div>
			<div class="section">
				<div class="card">
					<div class="card-header"><h2>Nouveau cas</h2></div>
					<div class="card_body" style="padding: 1.25rem">
						<div id="newCases2">
							<svg width="100%" height="400px"></svg>
						</div>
					</div>
				</div>
			</div>
        </div>
    </div>
</div>
@endsection