function build_tooltip (data)
{
  
  $('#tooltip').highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: data.title
      },
      xAxis: {
        categories: data.categories
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
            text: null
        }
      },
      legend: {
          enabled: false
      },
      credits: {
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
          },
          color: chart_data[chart_type]['bar_color']
        }
      },
      tooltip: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: 'category',
        data: data.values
      }]
  });
  };


