// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.

var svgWidth = 600;
var svgHeight = 400;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
//and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "depression";


var globaldata;

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.98,
      d3.max(data, d => d[chosenXAxis]) * 1.02
    ])
    .range([0, width])

  return xLinearScale

};

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale)

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis)

  return xAxis
};

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[chosenYAxis]) * 1.1
    ])
    .range([height, 0])

  return yLinearScale

};

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale)

  yAxis.transition()
    .duration(1000)
    .call(leftAxis)

  return yAxis
};

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]))

  return circlesGroup
};

// function used for updating text with a transition to
// new text
function renderText(textGroup, newXScale, chosenXaxis, newYScale, chosenYAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]))

  return textGroup
};

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis == "poverty") {
    var label1 = "In poverty %:"
  } else if (chosenXAxis == "American_Indian") {
    var label1 = "# of American_Indian:"
  } else {
  	var label1 = "% uninsured:"
  }

  if (chosenYAxis == "depression") {
    var label2 = "depression %:"
  } else if (chosenYAxis == "skin_cancer") {
    var label2 = "skin cancer %:"
  } else {
  	var label2 = "diabetes %:"
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.states}<br>${label1} ${d[chosenXAxis]}<br>${label2} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup
}


// Retrieve data from the CSV file
d3.csv("data.csv", function (err, data) {
	if (err) throw err;
	
	console.log(data);
	globaldata = data;

	// parse data
  	data.forEach(function (data) {
	    data.poverty = +data.poverty;
	    data.depression = +data.depression;
	    data.American_Indian = +data.American_Indian;
	    data.uninsured = +data.uninsured;
	    data.skin_cancer = +data.skin_cancer;
      data.diabetes = +data.diabetes;
	});

  	// LinearScales function above csv import
  	var xLinearScale = xScale(data, chosenXAxis);
  	var yLinearScale = yScale(data, chosenYAxis);

    // Create initial axis functions
	var bottomAxis = d3.axisBottom(xLinearScale);
  	var leftAxis = d3.axisLeft(yLinearScale);

  	// append x axis
	var xAxis = chartGroup.append("g")
	    .classed("x-axis", true)
	    .attr("transform", `translate(0, ${height})`)
	    .call(bottomAxis)

	// append y axis
	var yAxis = chartGroup.append("g")
	    .call(leftAxis)

	// append initial circles
	var circlesGroup = chartGroup.selectAll("circle")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr("cx", d => xLinearScale(d[chosenXAxis]))
	    .attr("cy", d => yLinearScale(d[chosenYAxis]))
	    .attr("r", 10)
	    .attr("fill", "blue")
	    .attr("opacity", ".5")

	// append text
	var textGroup = chartGroup.selectAll(".abbr")
		.data(data)
		.enter()
		.append("text")
		.attr("class", "abbr")
		.attr("x", d => xLinearScale(d[chosenXAxis]))
	    .attr("y", d => yLinearScale(d[chosenYAxis]))
	    .attr("dy", ".35em")
		.text(function (d) {
			return d.abbr
		});

	// Create group for  3 x- axis labels
	var XlabelsGroup = chartGroup.append("g")
	    .attr("transform", `translate(${width/2}, ${height + 20})`)

	var povertyLabel = XlabelsGroup.append("text")
	    .attr("x", 0)
	    .attr("y", 20)
	    .attr("value", "poverty") //value to grab for event listener
	    .classed("active", true)
	    .classed("axis-text", true)
	    .text("In Poverty %");

	var American_IndianLabel = XlabelsGroup.append("text")              
	    .attr("x", 0)
	    .attr("y", 40)
	    .attr("value", "American_Indian") //value to grab for event listener
	    .classed("inactive", true)
	    .classed("axis-text", true)
	    .text("# American_Indian");

	var uninsuredLabel = XlabelsGroup.append("text")
	    .attr("x", 0)
	    .attr("y", 60)
	    .attr("value", "uninsured") //value to grab for event listener
	    .classed("inactive", true)
	    .classed("axis-text", true)
	    .text("% uninsured");

	// Create group for  3 y- axis labels
	var YlabelsGroup = chartGroup.append("g")
	    .attr("transform", "rotate(-90)")

	var depressionLabel = YlabelsGroup.append("text")           
	    .attr("y", 0 - margin.left + 40)
	    .attr("x", 0 - (height / 2))
	    .attr("dy", "1em")
	    .attr("value", "depression") //value to grab for event listener
	    .classed("axis-text", true)
	    .classed("active", true)
	    .text("depression %");

	var skin_cancerLabel = YlabelsGroup.append("text")
	    .attr("y", 0 - margin.left + 20)
	    .attr("x", 0 - (height / 2))
	    .attr("dy", "1em")
	    .attr("value", "skin_cancer") //value to grab for event listener
	    .classed("axis-text", true)
	    .classed("inactive", true)
	    .text("skin_cancer %");

	var diabetesLabel = YlabelsGroup.append("text")
	    .attr("y", 0 - margin.left)
	    .attr("x", 0 - (height / 2))
	    .attr("dy", "1em")
	    .attr("value", "diabetes") //value to grab for event listener
	    .classed("axis-text", true)
	    .classed("inactive", true)
	    .text("diabetes %");

	// updateToolTip function above csv import
  	var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

	// x axis labels event listener
	XlabelsGroup.selectAll("text")
	    .on("click", function () {
	      // get value of selection
	      var value = d3.select(this).attr("value")
	      if (value != chosenXAxis) {

	        // replaces chosenXAxis with value
	        chosenXAxis = value;
	        // console.log(chosenXAxis);

	        // updates x scale for new data
	        xLinearScale = xScale(data, chosenXAxis);


	        // updates x axis with transition
	        xAxis = renderXAxes(xLinearScale, xAxis);

	        // updates circles with new x values
	        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

	        // updates text with new x values
	        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

	        // updates tooltips with new info
	        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

	        // changes classes to change bold text
	        if (chosenXAxis == "poverty") {      
	          povertyLabel
	            .classed("active", true)
	            .classed("inactive", false)
            American_IndianLabel
	            .classed("active", false)
	            .classed("inactive", true)
            uninsuredLabel
	          	.classed("active", false)
	            .classed("inactive", true)
	        } else if (chosenXAxis == "American_Indian") {
	          povertyLabel
	            .classed("active", true)
	            .classed("inactive", false)
            American_IndianLabel
	            .classed("active", false)
	            .classed("inactive", true)
            uninsuredLabel
	          	.classed("active", false)
	            .classed("inactive", true)
	        } else {
	        	povertyLabel
	            .classed("active", true)
	            .classed("inactive", false)
            American_IndianLabel
	            .classed("active", false)
	            .classed("inactive", true)
            uninsuredLabel
	          	.classed("active", false)
	            .classed("inactive", true)
	        };
	      };
	    });

	// y axis labels event listener
	YlabelsGroup.selectAll("text")
	    .on("click", function () {
	      // get value of selection
	      var value = d3.select(this).attr("value")
	      if (value != chosenYAxis) {

	        // replaces chosenXAxis with value
	        chosenYAxis = value;
	        // console.log(chosenYAxis);

	        // updates x scale for new data
	        yLinearScale = yScale(data, chosenYAxis);


	        // updates x axis with transition
	        yAxis = renderYAxes(yLinearScale, yAxis);

	        // updates circles with new x values
	        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

	        // updates text with new x values
	        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

	        // updates tooltips with new info
	        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

	        // changes classes to change bold text
	        if (chosenYAxis == "depression") {                       
	          depressionLabel
	            .classed("active", true)
	            .classed("inactive", false)
            skin_cancerLabel
	            .classed("active", false)
	            .classed("inactive", true)
            diabetesLabel
	          	.classed("active", false)
	            .classed("inactive", true)
	        } else if (chosenYAxis == "skin_cancer") {
	          depressionLabel
	            .classed("active", true)
	            .classed("inactive", false)
            skin_cancerLabel
	            .classed("active", false)
	            .classed("inactive", true)
            diabetesLabel
	          	.classed("active", false)
	            .classed("inactive", true)
	        } else {
	        	depressionLabel
	            .classed("active", true)
	            .classed("inactive", false)
            skin_cancerLabel
	            .classed("active", false)
	            .classed("inactive", true)
            diabetesLabel
	          	.classed("active", false)
	            .classed("inactive", true)
	        };
	      };
	    });

});