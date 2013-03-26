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

$(function () {
        $('#container').highcharts({
            chart: {
                type: 'column',
                margin: [ 50, 50, 100, 80]
            },
            title: {
                text: 'World\'s largest cities per 2008'
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
                    text: 'Population (millions)'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function() {

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

                  var data = {values: [], values_with_keys: {}, categories: []};
                  $.each(chart_data, function (key, value)
                  {
                    data.categories.push(key);
                    data.values_with_keys[key] = value.values[value.axis.indexOf(_key)];
                    data.values.push(data.values_with_keys[key]);
                  });
                  build_tooltip(data);

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
    });
