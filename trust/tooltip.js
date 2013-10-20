var tooltip_options = {
  chart: {
    type: 'column'
  },
  title: {
    style: {
      fontFamily: 'ingiri, arial',
      fontSize: '14px'
    }
  },
  xAxis: {
    labels: {
      formatter: function() {
      return '<img src="images/' + this.value + '_active.png" alt="' + translations[locale]['groups'][this.value] + '" title="' + translations[locale]['groups'][this.value] + '"/>';
      },
      useHTML: true,
      style: {
        textAlign: 'center',
        paddingTop: '5px',
        fontFamily: 'ingiri, arial'
      }
    },
    tickWidth: 0,
    lineColor: '#cfcfcf'
  },
  yAxis: {
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
        style: {
          fontFamily: 'ingiri, arial'
        },
        formatter: function() {
          return this.y + '%';
        },
        color: '#000'
      },
      animation: false
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
  
  var top = $('div.highcharts-axis-labels > span').height() + $('div.highcharts-axis-labels > span').offset().top;
  var left = data.position.x - $('#tooltip').width() / 2;

  if (left + $('#tooltip .chart').width() > $(window).width())
  {
    new_left = $(window).width() - $('#tooltip .chart').width();
    $('#tooltip .before').css({marginLeft: (data.position.x - new_left - $('#tooltip .before').outerWidth() / 2)});
    left = new_left;
  }
  else
  {
    $('#tooltip .before').removeAttr('style');
  }

  $('#tooltip').show().css({left: left, top: top}).children('.chart').highcharts(tooltip_options);
}



