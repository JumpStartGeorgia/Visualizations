var chart_type = "trust";
var chart;
function create_main_chart(){
  $('#main_chart').css('width', $(window).width()-$('#chart_nav').width()-80);
  $('#main_chart').highcharts({
      chart: {
          type: 'column',
          margin: [ 50, 50, 100, 80],
          events: {
            redraw: function() {
                alert ('new chart type = ' + chart_type);
            }
        }
      },
      title: {
          text: translations[locale]['groups'][chart_type]
      },
      xAxis: {
          categories: create_chart_axis(chart_data[chart_type]['axis']),
          labels: {
              rotation: -45,
              align: 'right',
              style: {
                  fontSize: '13px',
                  fontFamily: 'Verdana, sans-serif'
              }
          }
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Percent (%)'
          }
      },
      legend: {
          enabled: false
      },
      tooltip: {
          formatter: function() {
              return '<b>'+ this.x +'</b><br/>'+
                  'Population in 2008: '+ Highcharts.numberFormat(this.y, 1) +
                  ' millions';
          }
      },
      series: [{
          name: 'Population',
          data: chart_data[chart_type]['values'],
          dataLabels: {
              enabled: true,
              rotation: -90,
              color: '#FFFFFF',
              align: 'right',
              x: 4,
              y: 10,
              style: {
                  fontSize: '13px',
                  fontFamily: 'Verdana, sans-serif'
              }
          }
      }]
  });
}

