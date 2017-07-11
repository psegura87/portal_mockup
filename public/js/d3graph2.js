var width = 960,
    height = 500;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "health")
  .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

var g = svg.append("g");
    // .call(twizzle, 20000);

var path = g.append("path")
    .attr("d", d3.svg.symbol().type("cross").size(10000))
    .attr("class", "paths")
    .call(plonk, 2500);

function twizzle(selection, duration) {
  selection.transition()
      .duration(duration)
      .attrTween("transform", function() {
        return d3.interpolateString("rotate(0)", "rotate(720)");
      });

  setTimeout(function() { twizzle(selection, duration); }, (Math.random() + 1) * duration);
}

function plonk(selection, duration) {
  selection.transition()
      .duration(duration)
      .style("stroke-width", "5px")
    .transition()
      .style("stroke-width", "0px");

  setTimeout(function() { plonk(selection, duration); }, (Math.random() + 2) * duration);
}
