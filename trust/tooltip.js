var tooltip_options = {
  chart: {
    type: 'column'
  },
  title: {
  },
  xAxis: {
  },
  yAxis: {
    min: 0,
    max: 100,
    title: {
      text: null
    },
    labels:{
      enabled: false
    },
    gridLineWidth: 0
  },
  legend: {
    enabled: false
  },
  credits: {
    enabled: false
  },
  tooltip: {
    enabled: false
  },
  exporting: {
    enabled: false
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
        formatter: function() {
          return this.y + '%';
        },
        color: '#000'
      }
    }
  },
  series: [{
    name: 'Category'
  }]
};

$(function ()
{
  tooltip_options.plotOptions.column.color = chart_data[chart_type]['bar_color'];
});

function build_tooltip (data)
{
  tooltip_options.xAxis.categories = data.categories;
  tooltip_options.title.text = data.title;
  tooltip_options.series[0].data = data.values;
  
  var top = $('#main_chart').height() + $('#main_chart').offset().top;
  var left = data.position.x - $('#tooltip').width() / 2;

  if (left + $('#tooltip .chart').width() > $(window).width())
  {
    //$('#tooltip .chart').css({position: 'absolute', left: left});
    left = $(window).width() - $('#tooltip .chart').width();
  }

  $('#tooltip').css({left: left, top: top}).children('.chart').highcharts(tooltip_options);
}





