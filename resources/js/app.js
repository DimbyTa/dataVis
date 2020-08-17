require('./bootstrap');

console.log(madaData);
import { 
	select, 
	csv, 
	scaleBand, 
	scaleLinear,
	scaleTime,
	scaleSymlog,
	axisBottom, 
	axisLeft, 
	max, 
	line, 
	extent,
	mouse,
	event
} from "d3";


//	Bar chart
var svgContainer = document.querySelector('#newCases svg');
const width = parseInt(getComputedStyle(svgContainer).width);
const height = parseInt(getComputedStyle(svgContainer).height);
select('body')
   .append('div')
	.attr('id', 'tooltip')
	.style('opacity', 0);
// const svgCumul = select("#cumulMada svg");

const margin = {top : 20, right : 20, bottom : 80, left : 80};

const tracking = function(){
	const x = mouse(this)[1];	
}

const svgDataParRegion = select("#casesPerRegion svg");
renderBarChart(madaData, "name_region", "cas_confirmes", svgDataParRegion);

//	Importing datas
csv('data/cumul-mada.csv').then( (data, error) => {
	// console.log(data);
	//	Les données sont importées, debut du processing
 	//	Formating data(parsing to int)
	data.forEach( d => {
		d.Date_formated = d.Date_reported;
		d.Date_reported = new Date(d.Date_reported);
		d.New_cases = +d.New_cases;
		d.Cumulative_cases = +d.Cumulative_cases;
		d.New_deaths = +d.New_deaths;
		d.Cumulative_deaths = +d.Cumulative_deaths;
	});
	const svgCumul = select("#casesCumul svg");
	const svgCumulLog = select("#casesCumulLog svg");
	const svgNewCases = select("#newCases svg");
	//	Show the data into a bar chart model
	// render(data, "New_cases", "Date_formated");
	renderLineChart(data, "Date_reported", "New_cases", svgNewCases, 'linear');
	renderLineChart(data, "Date_reported", "Cumulative_cases", svgCumul, 'linear');
	renderLineChart(data, "Date_reported", "Cumulative_cases", svgCumulLog, 'log');
});

//	Functions
/**
 * 
 * @param {*} data Data to plot
 * @param {*} xIndex The absciss value
 * @param {*} yIndex The ordonate value
 * @param {*} svgContainer The svg element where the graph will be drawn
 */

function renderBarChart(data, xIndex, yIndex, svgContainer){
	console.log("Rendering bar chart");
	console.log(svgContainer);
	const xValue = d => d[xIndex];
	const yValue = d => d[yIndex];

	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	
	//	Creating scale
	const xScale = scaleBand()
		.domain(data.map( d => d[xIndex]))
		.range([0, innerWidth])
		.padding(0.5);
	const yScale = scaleLinear()
		.domain([0, max(data, yValue)])
		.range([0, innerHeight]);
	//	Creating the wrapper of the graph(container)
	const graphWrapper = svgContainer.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);
	
	//	Creating axis
	const invertYScale = scaleLinear()
		.domain([0, max(data, yValue)])
		.range([innerHeight, 0]);
	// const yAxis = axisLeft(invertYScale);
	// const xAxis = axisBottom(xScale);
	// console.log(yScale.domain()); 

	//	Adding axis to the graphWrapper
	graphWrapper.append('g').call(axisLeft(invertYScale))
		.selectAll(".domain")
		.remove();
	graphWrapper.append('g').call(axisBottom(scaleTime().domain(extent(data, xValue)).range([0,innerWidth])))
		.attr('transform', `translate(0, ${innerHeight})`)
		.selectAll(".tick text")
		.attr('text-anchor', 'end')
		.attr('transform', 'rotate(-60)');

	// //	Creating rect for the bars
	// graphWrapper.selectAll("rect").data(data)
	// 	.enter().append('rect')
	// 	.attr('y', d => yScale(d[yIndex]))
	// 	.attr('width', d => xScale(d[xIndex]))
	// 	.attr('height', d => yScale.bandwidth());

	//	Creating rect for the bars
	graphWrapper.append('rect')
		.attr('height', innerHeight)
		.attr('width', innerWidth)
		.style('fill', 'rgba(0,0,0,0.1')
		// .on("mouseover", function(a,b,c){ console.log("Tafiditra")})
		.on("mousemove", tracking);

	graphWrapper.selectAll("rect").data(data)
		.enter().append('rect')
		.attr('x', d => xScale(d[xIndex]))
		.attr('y', d => innerHeight - yScale(d[yIndex]))
		.attr('height', d => yScale(d[yIndex]))
		.attr('width', d => xScale.bandwidth())
		.on("mouseover", function(a, b, c) {
			// Object { Date_reported: Date Mon Jul 06 2020 03:00:00 GMT+0300 (East Africa Time), Country_code: "MG", Country: "Madagascar", WHO_region: "AFRO", New_cases: 213, Cumulative_cases: 2941, New_deaths: 3, Cumulative_deaths: 32, Date_formated: "2020-07-06" }
			let text = `<strong> ${a.Date_formated}</strong></br>`;
			text += `Total cas: ${a.Cumulative_cases}</br>`;
			text += `Nouveau cas: ${a.New_cases}</br>`;
			text += `Nouveau décès: ${a.New_deaths}</br>`;
			select(this).attr('class', 'focused').attr("r", 6);
			})
		.on("mouseout", function() { select("#tooltip").style('opacity', 0);select(this).attr('class', '').attr("r", 4);})
		.on("mousemove", function() {
			// console.log(event.clientX);
			let x = event.clientX;
			let y = event.clientY;
			x += 10;
		   select("#tooltip")
			.style('left', x + 'px')
			.style('top', y+ 'px');
		});
}

// //	Line chart
/**
 * 
 * @param {*} data Data to plot
 * @param {*} xIndex The absciss value
 * @param {*} yIndex The ordonate value
 * @param {*} svgContainer The svg element where the graph will be drawn
 * @param {*} mode The mode of scale of y(linear or logarithmic)
 */
function renderLineChart(data, xIndex, yIndex, svgContainer, mode){
	const xValue = d => d.Date_reported;
	const yValue = d => d[yIndex];

	//	Constant for the width and height of the graph
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;
	
	//	Creating scale
	// console.log(extent(data, xValue));
	const xScale = scaleTime()
		.domain(extent(data, xValue))
		.range([0, innerWidth]);

	//	Choosing the mode of the yScale
	if(mode === 'log'){
		var yScale = scaleSymlog()
			.domain([0, max(data, yValue)])
			.range([innerHeight, 0]);
	}
	else{
		var yScale = scaleLinear()
			.domain([0, max(data, yValue)])
			.range([innerHeight, 0]);
	}

	//	Creating the wrapper of the graph(container)
	const graphWrapper = svgContainer.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);
		// .attr('class', 'graph-wrapper');
		// .attr('id', `${xIndex}-${yIndex}`);
	
	//	Creating axis
	// const yAxis = axisLeft(invertYScale);
	// const xAxis = axisBottom(xScale);
	// console.log(yScale.domain()); 

	//	Adding axis to the graphWrapper
	graphWrapper.append('g').call(axisLeft(yScale));
	graphWrapper.append('g').call(axisBottom(xScale))
		.attr('transform', `translate(0, ${innerHeight})`)
		.selectAll(".tick text")
		.attr('text-anchor', 'end')
		.attr('transform', 'rotate(-60)');

	//	Creating path
	const lineGenerator = line()
		.x(d => xScale(d[xIndex]))
		.y(d => yScale(d[yIndex]));

	graphWrapper.append('path')
		.attr('class', 'line-path')
		.attr('d', lineGenerator(data))
		.on("mouseover", function(a, b, c) { 
			// console.log(a); 
			select(this).attr('class', 'line-path path-focus');
			})
		.on("mouseout", function() { select(this).attr('class', 'line-path');});
		// .on("mousemove", mousemove);

	//	Creating circle for point
	graphWrapper.selectAll("circle").data(data)
		.enter().append('circle')
		.attr('cx', d => xScale(d[xIndex]))
		.attr('cy', d => yScale(d[yIndex]))
		.attr('r', 4)
		.on("mouseover", function(a, b, c) {
			//Creating text for the tooltip
			let text = `<strong> ${a.Date_formated}</strong></br>`;
			text += `Total cas: ${a.Cumulative_cases}</br>`;
			text += `Nouveau cas: ${a.New_cases}</br>`;
			text += `Nouveau décès: ${a.New_deaths}</br>`;
			// text += `Gueris: ${a.New_}</br>`;

			//Debugging
			console.log(a); 
			select('#tooltip').style('opacity', 1).html(text);
			select(this).attr('class', 'focused').attr("r", 6);
			})
		.on("mouseout", function() { select("#tooltip").style('opacity', 0);select(this).attr('class', '').attr("r", 4);})
		.on("mousemove", function() {
			console.log(event.clientX);
			let x = event.clientX;
			let y = event.clientY;
			x += 10;
		   select("#tooltip")
			.style('left', x + 'px')
			.style('top', y + 'px');
		});


}

// //	Loading data
// csv('cumul-mada.csv').then( (data) => {
// 	//	Les données sont importées, debut du processing
// 	//	Formating data(parsing to int)
// 	data.forEach( d => {
// 		d.Date_formated = d.Date_reported;
// 		d.Date_reported = new Date(d.Date_reported);
// 		d.New_cases = +d.New_cases;
// 		d.Cumulative_cases = +d.Cumulative_cases;
// 		d.New_deaths = +d.New_deaths;
// 		d.Cumulative_deaths = +d.Cumulative_deaths;
// 	});

// 	//	Show the data into a bar chart model
// 	// render(data, "New_cases", "Date_formated");
// 	render(data, "Date_reported", "New_cases");
// });

