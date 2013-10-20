/*
Object.prototype.key_by_value = function (value)
{
  for (var i in this)
  {
    console.log(this.hasOwnProperty(i));
    if (this[i] === value)
    {
      return i;
    }
  }
  return false;
};
*/

var chart_type = "trust";
var chart;

function create_chart_axis(axis){
  x = [];
  for (var i = 0; i<axis.length; i++){
    x[i] = '<img src="images/categories/' + axis[i] + '" alt="' + translations[locale]['categories'][axis[i]] + '" title="' + translations[locale]['categories'][axis[i]] + '"/>';
  }
  return x;
}

function create_xaxis_hover(){
  $('div.highcharts-axis-labels span').mouseover(function(){
    var offset = $('#main_chart').offset(),
    img_offset = $(this).children('img').width()/2;

    var position = {
      x: parseInt($(this).css('left').replace('px','')) + offset.left + img_offset,
      y: parseInt($(this).css('top').replace('px','')) + offset.top
    };

    var _key = $(this).children('img').data('source');

    var data = {
      values: [{y: 0, color: '#23a570'}, {y: 0, color: '#db5d5d'}, {y: 0, color: '#48617a'}, {y: 0, color: '#666666'}], 
      values_with_keys: {}, 
      categories: [],
      title: translations[locale].categories[_key],
      position: position
    };
    var index = 0;
    $.each(chart_data, function (key, value)
    {
      data.categories.push(key);
      data.values_with_keys[key] = value.values[value.axis.indexOf(_key)];
      data.values[index]['y'] = data.values_with_keys[key];
      index++;
    });
    build_tooltip(data);  
  });
}

function create_main_chart(){

    if ($(window).width() >= 1170){
      $('#chart_container').css('width', $(window).width()-$('#explanation').width()-$('#chart_nav').width()-70);
    } else {
      $('#chart_container').css('width', $(window).width()-$('#chart_nav').width()-70);
    }

  $('#main_chart').highcharts({
      chart: {
          type: 'column',
          margin: [ 50, 50, 100, 80],
          events: {
            load: function(event) {
                $('#main_chart svg').height(300).find('rect[fill]').filter(function (){ return ($(this).attr('fill').toLowerCase() == '#ffffff'); }).first().attr('height', 300);
                create_xaxis_hover();
                if (locale == 'ka'){
                  $('.highcharts-button').children('title').text(translations[locale].export_text.menu_title);
                  $('.highcharts-button').click(function(){
                    $('.highcharts-contextmenu div:first div:first').html(translations[locale].export_text.printButtonTitle);
                  });
                }
            }
          },
          borderRadius: 0,
      },
      title: {
          text: null,
//          text: translations[locale]['groups'][chart_type],
          style: {
            fontSize: '20px',
            color: chart_data[chart_type]['bar_color'],
            fontFamily: 'dejavu, ingiri, arial'
          }
      },
      xAxis: {
          categories: chart_data[chart_type]['axis'],
          labels: {
            formatter: function() {
            return '<img src="images/categories/' + this.value + '.png" alt="' + translations[locale]['categories'][this.value] + '" data-source="' + this.value + '"/>';
            },
            useHTML: true,
            style: {
              textAlign: 'center',
              paddingTop: '5px',
              fontFamily: 'ingiri, arial'
            }
          },
          tickWidth: 0,
          lineColor: '#cfcfcf',
          lineWidth: 0
      },
      yAxis: {
          min: 0,
          max: 100,
          title: {
              text: null
          },
          labels: {
            y: -2,
            style: {
              fontFamily: 'ingiri, arial'
            }
          },
          gridLineColor: '#f2f2f2'
      },
      legend: {
          enabled: false
      },
      credits: {
          enabled: false
      },
      lang: {
          downloadPNG: translations[locale].export_text.downloadPNG,
          downloadJPEG: translations[locale].export_text.downloadJPEG,
          downloadPDF: translations[locale].export_text.downloadPDF,
          downloadSVG: translations[locale].export_text.downloadSVG,
          exportButtonTitle: translations[locale].export_text.exportButtonTitle,
          printButtonTitle: translations[locale].export_text.printButtonTitle
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
          color: chart_data[chart_type]['bar_color']
        }
      },
      tooltip: {
          formatter: function() {

              var transform = $('#main_chart .highcharts-series').attr('transform').match(/translate\(([0-9]+\.?[0-9]*)(,\s*|\s+)([0-9]+\.?[0-9]*)\)/),
              offset = $('#main_chart').offset();
              var position = {
                x: this.point.plotX + offset.left + +transform[1],
                y: this.point.plotY + offset.top + +transform[3]
              };

            /*
              var _key = (function (collection, _value)
              {
                var found = false, _key;
                $.each (collection, function (key, value)
                {
                  if (value == _value)
                  {
                    found = true;
                    _key = key;
                    return false;
                  }
                });
                return (found ? _key : false);
              })(translations[locale].categories, this.x);
            */
              var _key = this.x;

              var data = {
                values: [{y: 0, color: '#23a570'}, {y: 0, color: '#db5d5d'}, {y: 0, color: '#48617a'}, {y: 0, color: '#666666'}], 
                values_with_keys: {}, 
                categories: [],
                title: translations[locale].categories[_key],
                position: position
              };
              var index = 0;
              $.each(chart_data, function (key, value)
              {
                data.categories.push(key);
                data.values_with_keys[key] = value.values[value.axis.indexOf(_key)];
                data.values[index]['y'] = data.values_with_keys[key];
                index++;
              });
              build_tooltip(data);

              return false;
          }
      },
      series: [{
          name: 'Population',
          data: chart_data[chart_type]['values']
      }]
  });
}
