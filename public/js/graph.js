//graph.js
// set the dimensions of the canvas
var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


// set the ranges
// width
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
// height
var y = d3.scale.linear().range([height, 0]);

// define the axis
// 축 정의
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);


// add the SVG element
$(function(){
var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

console.log(svg);
// load the data
d3.json("/myapp/container/data.json", function(error, data) {
  console.log(typeof data);
  console.log(data);
  console.log(data.data);
  var data = data.data;
    /*
    Array.prototype.forEach.call(data, function(d) {
        d.Letter = d.Id;
        d.Freq +=1;
    });
*/
	var i = 0;
  data.forEach(function(d) {
      d.Letter = d.Id;
      d.Freq =  i++;

  });
  // scale the range of the data
  x.domain(data.map(function(d) { return d.Id; }));
  y.domain([0, d3.max(data, function(d) { return d.Freq; })]);

  // add axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");


  // Add bar chart
  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Id); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Freq); })
      .attr("height", function(d) { return height - y(d.Freq); });

  console.log(svg);

});
});
