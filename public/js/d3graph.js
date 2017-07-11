var level = 1;

var margin = {top: 150, right: 280, bottom: 150, left: 280},
    radius = Math.min(margin.top, margin.right, margin.bottom, margin.left) - 10;

var hue = d3.scale.ordinal().range(["#388338", "#4aa562", "#20664d", "#5c8250", "#58617c"]);

var luminance = d3.scale.sqrt()
    .domain([0, 1e6])
    .clamp(true)
    .range([90, 20]);

var svg = d3.select(".graph").append("svg")
    .attr("width", 350)
    .attr("height", 350)
  .append("g")
    .attr("transform", "translate(" + 170 + "," + 170 + ")");

var partition = d3.layout.partition()
    .sort(function(a, b) { return d3.ascending(a.name, b.name); })
    .size([2 * Math.PI, radius]);

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx ; })
    .padAngle(.01)
    .padRadius(radius / 3)
    .innerRadius(function(d) { return radius / 3 * d.depth; })
    .outerRadius(function(d) { return radius / 3 * (d.depth + 1) - 1; });

d3.json("/flare", function(error, root) {
  if (error) throw error;

  // Compute the initial layout on the entire tree to sum sizes.
  // Also compute the full name and fill color for each node,
  // and stash the children so they can be restored as we descend.
  partition
      .value(function(d) { return d.size; })
      .nodes(root)
      .forEach(function(d) {
        d._children = d.children;
        d.sum = d.value;
        d.key = key(d);
        d.fill = fill(d);
      });

  // Now redefine the value function to use the previously-computed sum.
  partition
      .children(function(d, depth) { return depth < 2 ? d._children : null; })
      .value(function(d) { return d.sum; });

  var center = svg.append("circle")
      .attr("r", radius / 3)
      .on("click", zoomOut);

  center.append("title")
      .text("zoom out");

  var path = svg.selectAll("path")
      .data(partition.nodes(root).slice(1))
    .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d) { return d.fill; })
      .each(function(d) { this._current = updateArc(d); })
      .on('mouseenter', displayInfo)
      .on('mouseleave', function() {
          path.style("fill", function(d) { return d.fill; })
      })
      .on("click", zoomIn);

    function displayInfo(p) {
        $('#right-info').css('font-size', '11px');
        $('#left-info').css('font-size', '14px');
        $(this).css('fill', 'rgb(225, 225, 225)');
        if (p.level === 3) {
            $('#left-info').html(p.name);
            $('#right-info').html(p.issue + '<br>' + p.time);
        } else if (p.level === 2) {
            $('#left-info').html(p.name + '<br>' + p.type);
            $('#right-info').html('Discount: '+ p.discount + '<br>' + 'Unit Price: ' + p.unit_price);
        } else if (p.level === 1){
            $('#left-info').html(p.name);
            $('#right-info').html(p.description);
        }
    }

  function zoomIn(p) {
      if (level != 3) {
          level++;
      }
    if (level === 1) {
        $('#directions').html('Services<br>Devices');
        $('#right-arrow').show();
    } else if (level === 2) {
        $('#directions').html('Devices<br>Incidents');
        $('#right-arrow').show();
    } else if (level === 3){
        $('#directions').html('Incidents');
        $('#right-arrow').hide();
    }

    $('#left-info, #right-info').html('');
    let deviceNum = 0;
    for (var x = 0; x < p.children.length; x++){
        deviceNum += p.children[x].value;
    }
    populateInc(deviceNum);
    if (p.depth > 1) p = p.parent;
    if (!p.children) return;
    zoom(p, p);
  }

  function zoomOut(p) {
      if (level != 1) {
          level--;
      }
      if (level === 1) {
          $('#directions').html('Services<br>Devices');
          $('#right-arrow').show();
      } else if (level === 2) {
          $('#directions').html('Devices<br>Incidents');
          $('#right-arrow').show();
      } else if (level === 3){
          $('#directions').html('Incidents');
      }
    $('#left-info, #right-info').html('');
    let deviceNum = 0;
    for (var x = 0; x < p.parent.children.length; x++){
        deviceNum += p.parent.children[x].value;
    }
    populateInc(deviceNum);
    if (!p.parent) return;
    zoom(p.parent, p);
  }

  // Zoom to the specified new root.
  function zoom(root, p) {
    if (document.documentElement.__transition__) return;

    // Rescale outside angles to match the new layout.
    var enterArc,
        exitArc,
        outsideAngle = d3.scale.linear().domain([0, 2 * Math.PI]);

    function insideArc(d) {
      return p.key > d.key
          ? {depth: d.depth - 1, x: 0, dx: 0} : p.key < d.key
          ? {depth: d.depth - 1, x: 2 * Math.PI, dx: 0}
          : {depth: 0, x: 0, dx: 2 * Math.PI};
    }

    function outsideArc(d) {
      return {depth: d.depth + 1, x: outsideAngle(d.x), dx: outsideAngle(d.x + d.dx) - outsideAngle(d.x)};
    }

    center.datum(root);

    // When zooming in, arcs enter from the outside and exit to the inside.
    // Entering outside arcs start from the old layout.
    if (root === p) enterArc = outsideArc, exitArc = insideArc, outsideAngle.range([p.x, p.x + p.dx]);

    path = path.data(partition.nodes(root).slice(1), function(d) { return d.key; });

    // When zooming out, arcs enter from the inside and exit to the outside.
    // Exiting outside arcs transition to the new layout.
    if (root !== p) enterArc = insideArc, exitArc = outsideArc, outsideAngle.range([p.x, p.x + p.dx]);

    d3.transition().duration(d3.event.altKey ? 7500 : 750).each(function() {
      path.exit().transition()
          .style("fill-opacity", function(d) { return d.depth === 1 + (root === p) ? 1 : 0; })
          .attrTween("d", function(d) { return arcTween.call(this, exitArc(d)); })
          .remove();

      path.enter().append("path")
          .style("fill-opacity", function(d) { return d.depth === 2 - (root === p) ? 1 : 0; })
          .style("fill", function(d) { return d.fill; })
          .on("mouseover", displayInfo)
          .on('mouseleave', function() {
              path.style("fill", function(d) { return d.fill; })
          })
          .on("click", zoomIn)
          .each(function(d) { this._current = enterArc(d); });

      path.transition()
          .style("fill-opacity", 1)
          .attrTween("d", function(d) { return arcTween.call(this, updateArc(d)); });
    });
  }
});

function key(d) {
  var k = [], p = d;
  while (p.depth) k.push(p.name), p = p.parent;
  return k.reverse().join(".");
}

function fill(d, lum) {
  if (!lum) {lum = 15000;}
  var p = d;
  while (p.depth > 1) p = p.parent;
  var c = d3.lab(hue(p.name));
  c.l = luminance(lum);
  return c;
}

function arcTween(b) {
  var i = d3.interpolate(this._current, b);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

function updateArc(d) {
  return {depth: d.depth, x: d.x, dx: d.dx};
}

d3.select(self.frameElement).style("height", margin.top + margin.bottom + "px");

function populateInc(number) {
    if (number > 20) {number = 20;}
    $('.evAll').empty();
    for (var x = 0; x < number; x++) {
        let random = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        let randColor;
        let border;
        if (random === 1) {
            randColor = '#7AA57D';
            border = '#7AA57D';
        } else if (random === 2) {
            randColor = '#677893';
            border = '#6c7687';
        } else {
            randColor = '#a36f68';
            border = '#cea29f';
        }
        var divH = $('<div>').attr('id', 'evH' + x);
        var div = $('<div>').attr('id', 'ev'+x);
        div.addClass('evX');
        divH.addClass('evHX col-lg-1');
        div.css({'height': 30*random*.75, 'background-color': randColor});
        div.appendTo(divH);
        divH.appendTo('.evAll');
    }
}

populateInc(20);
