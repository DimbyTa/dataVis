require('./bootstrap');

// console.log(madaData, madaPerRegion);
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
	event,
	format,
	text
} from "d3";

//	Creating Object date for the Timescale
madaData.forEach( d => {
	d.dateObject = new Date(d.date);
})

//	Creating the tooltip
select('body')
   .append('div')
	.attr('id', 'tooltip')
	.style('opacity', 0);

var svgContainer = document.querySelector('#newCases svg');
const width = parseInt(getComputedStyle(svgContainer).width);
const height = parseInt(getComputedStyle(svgContainer).height);

const margin = {top : 40, right : 20, bottom : 80, left : 90};

//	Selecting svgs where graphs will be drawn
const svgDataParRegion = select("#casesPerRegion svg");
const svgNewCases = select("#newCases svg");
const svgCumulLog = select("#casesCumulLog svg");
const svgCumul = select("#casesCumul svg");
const svgLast10Country = select("#last-10-country svg");

console.log(svgLast10Country, lastCountry);
//	Drawing graphs
renderHorizontalBarChart(lastCountry, "total_cases", "Country", svgLast10Country, 'Top 10 des pays les plus touchés');
renderBarChart(madaPerRegion, "name_region", "cas_confirmes", svgDataParRegion);
renderBarChartWithTimeAxis(madaData, "dateObject", "new_cases", svgNewCases);
renderLineChart(madaData, "dateObject", "total_cases", svgCumulLog, 'log');
renderLineChart(madaData, "dateObject", "total_cases", svgCumul, 'linear');

//	Importing datas
csv('data/cumul-mada.csv').then( (data, error) => {
	// console.log(data);
	//	Les données sont importées, debut du processing
 	//	Formating data(parsing to int)
	// data.forEach( d => {
	// 	d.Date_formated = d.Date_reported;
	// 	d.Date_reported = new Date(d.Date_reported);
	// 	d.New_cases = +d.New_cases;
	// 	d.Cumulative_cases = +d.Cumulative_cases;
	// 	d.New_deaths = +d.New_deaths;
	// 	d.Cumulative_deaths = +d.Cumulative_deaths;
	// });

	//	Recuperation des svg containers
	// const svgCumul = select("#casesCumul svg");
	// const svgCumulLog = select("#casesCumulLog svg");
	// const svgNewCases = select("#newCases svg");

	//	Show the data into a bar chart model
	// render(data, "New_cases", "Date_formated");
	// renderLineChart(data, "Date_reported", "New_cases", svgNewCases, 'linear');
	// renderLineChart(data, "Date_reported", "Cumulative_cases", svgCumul, 'linear');
	// renderLineChart(data, "Date_reported", "Cumulative_cases", svgCumulLog, 'log');
});

/**
 * 
 * @param {*} data 
 * @param {*} xIndex 
 * @param {*} yIndex 
 * @param {*} svgContainer 
 */
function renderHorizontalBarChart(data, xIndex, yIndex, svgContainer, title){
	console.log("Rendering horizontal bar chart");
	// console.log(svgContainer);
	const xValue = d => d[xIndex];
	const yValue = d => d[yIndex];

	//Values for plotting(size of the images)
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	
	//	Creating scales
	const yScale = scaleBand()
		.domain(data.map( d => d[yIndex]))
		.range([0, innerHeight])
		.padding(0.2);
	const xScale = scaleLinear()
		.domain([0, max(data, xValue)])
		.range([0, innerWidth]);


	//	Creating the wrapper of the graph(container)
	const graphWrapper = svgContainer.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);
	

	//	Creating axis
	
	// const yAxis = axisLeft(invertYScale);
	// console.log("Type de donnees");
	// console.log(typeof(data[0][xIndex]));
	// const xAxis = axisBottom(xScale);
	// const xAxis = axisBottom(scaleTime().domain(extent(data, xValue)).range([0,innerWidth]))
	// console.log(yScale.domain()); 

	//	Adding axis to the graphWrapper
	graphWrapper.append('g').call(axisLeft(yScale))
		.selectAll(".domain, .tick line")
		.remove();
	const xAxisg = graphWrapper.append('g').call(axisBottom(xScale).tickFormat(format('.3s')))
		.attr('transform', `translate(0, ${innerHeight})`);
	xAxisg.selectAll(".tick line")
		   .attr('y2', -innerHeight);
	xAxisg.selectAll('.domain')
		   .remove();	
		
		// .attr('text-anchor', 'end');
		// .attr('transform', 'rotate(-60)');

	//	Rect wrapper
	graphWrapper.append('rect')
		.attr('class', 'graph-wrapper')
		.attr('height', innerHeight)
		.attr('width', innerWidth)
		// .on("mouseover", function(a,b,c){ console.log("Tafiditra")})
		.on("mousemove", tracking);

	//	Creating rect for the bars

	graphWrapper.selectAll("rect.bar").data(data)
		.enter().append('rect')
		.attr('class', 'bar')
		.attr('x',0)
		.attr('y', d => yScale(d[yIndex]))
		.attr('width', d => xScale(d[xIndex]))
		.attr('height', d => yScale.bandwidth())
		.on("mouseover", function(a, b, c) {
			select(this).attr('class', 'bar focused').attr("r", 6);
			select("#tooltip").html(dataGlobalToHTMLTest(a)).transition().duration(200).style('opacity', 1);
			})
		.on("mouseout", function() { 
			select("#tooltip")
				.transition().duration(100)
				.style('opacity', 0);
			// select(this)
			// 	.attr('class', 'bar');
			})
		.on("mousemove", function() {
			// console.log(event.clientX);
			let x = event.clientX;
			let y = event.clientY;
			x += 10;
		   select("#tooltip")
			.style('left', x + 'px')
			.style('top', y+ 'px');
		});
	graphWrapper.append('text')
		.attr('y', -10)
		.attr('class', 'graph-title')
		.text(title);
}
//	Functions
/**
 * 
 * @param {*} data Data to plot
 * @param {*} xIndex The absciss value
 * @param {*} yIndex The ordonate value
 * @param {*} svgContainer The svg element where the graph will be drawn
 */
function renderBarChartWithTimeAxis(data, xIndex, yIndex, svgContainer){
	console.log("Rendering bar chart");
	// console.log(svgContainer);
	const xValue = d => d[xIndex];
	const yValue = d => d[yIndex];

	//Values for plotting(size of the images)
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	
	//	Creating scales
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
	// console.log("Type de donnees");
	// console.log(typeof(data[0][xIndex]));
	// const xAxis = axisBottom(xScale);
	const xAxis = axisBottom(scaleTime().domain(extent(data, xValue)).range([0,innerWidth]))
	// console.log(yScale.domain()); 

	//	Adding axis to the graphWrapper
	graphWrapper.append('g').call(axisLeft(invertYScale))
		.selectAll(".domain")
		.remove();
	graphWrapper.append('g').call(xAxis)
		.attr('transform', `translate(0, ${innerHeight})`)
		.selectAll(".tick text")
		.attr('text-anchor', 'end')
		.attr('transform', 'rotate(-60)');


	//	Rect wrapper
	graphWrapper.append('rect')
	.attr('class','graph-wrapper')
	.attr('height', innerHeight)
	.attr('width', innerWidth)
	// .on("mouseover", function(a,b,c){ console.log("Tafiditra")})
	.on("mousemove", tracking);

	graphWrapper.selectAll("rect.bar").data(data)
		.enter().append('rect')
		.attr('class', 'bar')
		.attr('x', d => xScale(d[xIndex]))
		.attr('y', d => innerHeight - yScale(d[yIndex]))
		.attr('height', d => yScale(d[yIndex]))
		.attr('width', d => xScale.bandwidth())
		.on("mouseover", function(a, b, c) {
			// Object { Date_reported: Date Mon Jul 06 2020 03:00:00 GMT+0300 (East Africa Time), Country_code: "MG", Country: "Madagascar", WHO_region: "AFRO", New_cases: 213, Cumulative_cases: 2941, New_deaths: 3, Cumulative_deaths: 32, Date_formated: "2020-07-06" }
			select(this).attr('class', 'bar focused').attr("r", 6);
			select("#tooltip").style('opacity', 1).html(dataGlobalToHTML(a));
			})
		.on("mouseout", function() { 
			select("#tooltip")
				.style('opacity', 0)
				.attr('class', 'bar');
			})
		.on("mousemove", function() {
			console.log(event.clientX);
			let x = event.clientX;
			let y = event.clientY;
			x += 10;
		   select("#tooltip")
			.style('left', x + 'px')
			.style('top', y+ 'px');
		});
		

//	Creating rect for the bars
}
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
	// console.log(svgContainer);
	const xValue = d => d[xIndex];
	const yValue = d => d[yIndex];

	//Values for plotting(size of the images)
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	
	//	Creating scales
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
	console.log("Type de donnees");
	console.log(typeof(data[0][xIndex]));
	const xAxis = axisBottom(xScale);
	// const xAxis = axisBottom(scaleTime().domain(extent(data, xValue)).range([0,innerWidth]))
	// console.log(yScale.domain()); 

	//	Adding axis to the graphWrapper
	graphWrapper.append('g').call(axisLeft(invertYScale))
		.selectAll('.tick line')
		.attr('x2', innerWidth)
		.selectAll(".domain")
		.remove();
	graphWrapper.append('g').call(xAxis)
		.attr('transform', `translate(0, ${innerHeight})`)
		.selectAll(".tick text")
		.attr('text-anchor', 'end')
		.attr('transform', 'rotate(-60), translate(-10,-10)');
		// .attr('transform', 'translate(0,-10)');


	//	Rect wrapper
	graphWrapper.append('rect')
		.attr('class', 'graph-wrapper')
		.attr('height', innerHeight)
		.attr('width', innerWidth)
		// .on("mouseover", function(a,b,c){ console.log("Tafiditra")})
		.on("mousemove", tracking);

	//	Creating rect for the bars

	graphWrapper.selectAll("rect.bar").data(data)
		.enter().append('rect')
		.attr('class', 'bar')
		.attr('x', d => xScale(d[xIndex]))
		.attr('y', d => innerHeight - yScale(d[yIndex]))
		.attr('height', d => yScale(d[yIndex]))
		.attr('width', d => xScale.bandwidth())
		.on("mouseover", function(a, b, c) {
			// Object { Date_reported: Date Mon Jul 06 2020 03:00:00 GMT+0300 (East Africa Time), Country_code: "MG", Country: "Madagascar", WHO_region: "AFRO", New_cases: 213, Cumulative_cases: 2941, New_deaths: 3, Cumulative_deaths: 32, Date_formated: "2020-07-06" }
			select(this).attr('class', 'bar focused');
			select("#tooltip").style('opacity', 1).html(dataRegionToHTML(a));
			})
		.on("mouseout", function() { 
			select("#tooltip")
			.style('opacity', 0);
			select(this).attr('class', 'bar');
			})
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
	const xValue = d => d[xIndex];
	const yValue = d => d[yIndex];

	//	Constant for the width and height of the graph
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;
	
	//	Creating scale
	// console.log(extent(data, xValue));
	console.log(data[0]);
	console.log(extent(data), yValue);
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

	graphWrapper.append('rect')
		.attr('height', innerHeight)
		.attr('width', innerWidth)
		.style('fill', 'rgba(0,0,0,0.1')
		// .on("mouseover", function(a,b,c){ console.log("Tafiditra")})
		.on("mousemove", tracking);
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
		.attr('r', 2)
		.on("mouseover", function(a) {
			//Creating text for the tooltip
			// let text = `<strong> ${a.Date_formated}</strong></br>`;
			// text += `Total cas: ${a.Cumulative_cases}</br>`;
			// text += `Nouveau cas: ${a.New_cases}</br>`;
			// text += `Nouveau décès: ${a.New_deaths}</br>`;

			//Debugging
			// console.log(a); 
			select('#tooltip').style('opacity', 1).html(dataGlobalToHTML(a));
			select(this).attr('class', 'focused').attr("r", 6);
			})
		.on("mouseout", function() { select("#tooltip").style('opacity', 0);select(this).attr('class', '').attr("r", 2);})
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

function dataGlobalToHTMLTest(a){
	// console.log('formating via function');
	let text = `<strong> ${a.Country}</strong></br>`;
			text += `Total cas: ${a.total_cases}</br>`;
			text += `Total décès: ${a.total_deaths}</br>`;
	return text;
}

function dataGlobalToHTML(a){
	// console.log('formating via function');
	let text = `<strong> ${a.date}</strong></br>`;
			text += `Total cas: ${a.total_cases}</br>`;
			text += `Nouveau cas: ${a.new_cases}</br>`;
			text += `Nouveau décès: ${a.new_deaths}</br>`;
	return text;
}

function dataRegionToHTML(a){
	let text = `<strong> ${a.name_region}</strong></br>`;
			text += `Total cas: ${a.cas_confirmes}</br>`;
			text += `Guerris: ${a.gueris}</br>`;
			text += `Décès: ${a.deces}</br>`;
	return text;
}

const tracking = function(){
	const x = mouse(this)[1];	
}