drawBar();
drawPie();
function drawBar(){
  var margin = {top: 70, right: 20, bottom: 30, left: 40},
     width = 500 - margin.left - margin.right,
     height = 400 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
     .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
     .rangeRound([height, 0]);

  var color = d3.scale.ordinal()
     .range(["#08088A", "#0A122A", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var xAxis = d3.svg.axis()
     .scale(x)
     .orient("bottom");

  var yAxis = d3.svg.axis()
     .scale(y)
     .orient("left")
     .tickFormat(d3.format(".2s"));

  var svg = d3.select("#visits").append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   d3.csv("barchartstacked.csv", function(error, data) {
   color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Month"; }));

   data.forEach(function(d) {
     var y0 = 0;
     d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
     d.total = d.ages[d.ages.length - 1].y1;
   });

   //data.sort(function(a, b) { return b.total - a.total; });

   x.domain(data.map(function(d) { return d.Month; }));
   y.domain([0, d3.max(data, function(d) { return d.total; })]);

   svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);

   svg.append("g")
       .attr("class", "y axis")
       .call(yAxis)
     .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", ".71em")
       .style("text-anchor", "end");

   var months = svg.selectAll(".Month")
       .data(data)
     .enter().append("g")
       .attr("class", "g")
       .attr("transform", function(d) { return "translate(" + x(d.Month) + ",0)"; });

   months.selectAll("rect")
       .data(function(d) { return d.ages; })
     .enter().append("rect")
       .attr("width", x.rangeBand())
       .attr("y", function(d) { return y(d.y1); })
       .attr("height", function(d) { return y(d.y0) - y(d.y1); })
       .style("fill", function(d) { return color(d.name); });

   var legend = svg.selectAll(".legend")
       .data(color.domain().slice().reverse())
     .enter().append("g")
       .attr("class", "legend")
       .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

   legend.append("rect")
       .attr("x", width - 18)
       .attr("width", 18)
       .attr("height", 18)
       .style("fill", color);

   legend.append("text")
       .attr("x", width - 24)
       .attr("y", 9)
       .attr("dy", ".35em")
       .style("text-anchor", "end")
       .text(function(d) { return d; });

  });

}
//pie chart area code
function drawPie(){

	  var width = 300,
	   height = 400,
	   radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
	   .range(["#324B99", "#8A1BC6", "#7b6888", "#01DFD7", "#0B2161", "#170888", "#140718"]);

	var arc = d3.svg.arc()
	   .outerRadius(radius - 10)
	   .innerRadius(0);

	var pie = d3.layout.pie()
	   .sort(null)
	   .value(function(d) { return d.visits; });

	var svg2 = d3.select("#country").append("svg")
	   .attr("width", width)
	   .attr("height", height)
	   .append("g")
	   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	  d3.select('#country svg')
	  .append("text")
	  .attr("x", 150)
	  .attr("y", height-40)
	  .attr("text-anchor", "middle")
	  .text("Views by country")

	d3.csv("piechart.csv", function(error, data) {
	 data.forEach(function(d) {
	   d.visits = +d.visits;
	 });

	 var g = svg2.selectAll(".arc")
	     .data(pie(data))
	     .enter().append("g")
	     .attr("class", "arc");

	 g.append("path")
	     .attr("d", arc)
	     .style("fill", function(d) { return color(d.data.country); });

	 g.append("text")
	     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	     .attr("dy", ".35em")
	     .style("text-anchor", "middle")
	     .text(function(d) { return d.data.country; });

	});
}