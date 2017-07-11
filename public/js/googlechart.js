var chart = AmCharts.makeChart("chartdiv", {
  "type": "serial",
  "theme": "light",
  "marginRight": 20,
  "dataProvider": [{
    "status": "Minimal",
    "count": 54,
    "color": "green"
  }, {
    "status": "Moderate",
    "count": 18,
    "color": "#45597a"
  }, {
    "status": "Critical",
    "count": 5,
    "color": "red"
  }],
  "valueAxes": [{
    "axisAlpha": 0,
    "position": "left",
    "title": ""
  }],
  "startDuration": 1,
  "graphs": [{
    "balloonText": "<b>[[category]]: [[value]]</b>",
    "fillColorsField": "color",
    "fillAlphas": 0.5,
    "lineAlpha": 0.5,
    "type": "column",
    "valueField": "count"
  }],
  "chartCursor": {
    "categoryBalloonEnabled": false,
    "cursorAlpha": 0,
    "zoomable": false
  },
  "categoryField": "status",
  "categoryAxis": {
    "gridPosition": "start",
    "labelRotation": 0
  },
  "export": {
    "enabled": false
  }

});


var chart2 = AmCharts.makeChart("chartdiv2", {
  "type": "serial",
  "theme": "light",
  "marginRight": 20,
  "dataProvider": [{
    "status": "Minimal",
    "count": 5,
    "color": "green"
  }, {
    "status": "Moderate",
    "count": 15,
    "color": "#45597a"
  }, {
    "status": "Critical",
    "count": 3,
    "color": "red"
  }],
  "valueAxes": [{
    "axisAlpha": 0,
    "position": "right",
    "title": ""
  }],
  "startDuration": 1,
  "graphs": [{
    "balloonText": "<b>[[category]]: [[value]]</b>",
    "fillColorsField": "color",
    "fillAlphas": 0.5,
    "lineAlpha": 0.5,
    "type": "column",
    "valueField": "count"
  }],
  "chartCursor": {
    "categoryBalloonEnabled": false,
    "cursorAlpha": 0,
    "zoomable": false
  },
  "categoryField": "status",
  "categoryAxis": {
    "gridPosition": "start",
    "labelRotation": 0
  },
  "export": {
    "enabled": false
  }

});











// google.charts.load('current', {packages: ['corechart', 'bar']});
// google.charts.setOnLoadCallback(drawBasic);
//
// function drawBasic() {
//
//       var data = new google.visualization.DataTable();
//       data.addColumn('number', 'Priority');
//       data.addColumn('number', 'Quantity');
//
//       data.addRows([
//         [1, 10],
//         [2, 5],
//         [3, 2]
//       ]);
//
//       var options = {
//         title: 'Open Tickets',
//         titleTextStyle: {
//             color: 'white'
//         },
//         hAxis: {
//           title: 'Priority',
//           titleTextStyle: {
//             color: 'white'
//         },
//           gridlines: {
//               count: 0
//           }
//         },
//         vAxis: {
//           title: 'Quantity',
//           titleTextStyle: {
//               color: 'white'
//           },
//           gridlines: {
//               count: 0
//           }
//       },
//       backgroundColor: "transparent",
//       colors: ["white", "red", "blue"],
//       width: 300
//       };
//
//       var chart = new google.visualization.ColumnChart(
//         document.getElementById('chart_div'));
//
//       chart.draw(data, options);
//     }
