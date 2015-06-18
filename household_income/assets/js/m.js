var mw = (function () {

   var obj = { },
   blinkDuration = 900,
   animDuration = 900,
   blinkEase = "linear",

   w = u.width(),
   h = u.height(),
   geo_map = null,
   disabled_region = [1, 15],
   default_region = 65,
   color_step = 9,
   color_range = ['#f9c235', '#ff6043'],
   colors = d3.scale.linear().domain([1, color_step]).range(color_range);
   color_by_year = function(year) {
     var tmp = 1;

     if(year < 1) {
       tmp = 1;
     }
     else if(year >= 1 && year < 3) {
       tmp = 2;
     }
     else if(year >= 3 && year < 5) {
       tmp = 3;
     }
     else if(year >= 5 && year < 7) {
       tmp = 4;
     }
     else if(year >= 7 && year < 9) {
       tmp = 5;
     }
     else if(year >= 9 && year < 11) {
       tmp = 6;
     }
     else if(year >= 11 && year < 14) {
       tmp = 7;
     }
     else if(year >= 14 && year <= 15) {
       tmp = 8;
     }
     else if(year > 15) {
       tmp = 9;
     }
     return colors(tmp);
   },
   loaderStartTime = 0,
   loaderAtLeast = 0, // milliseconds 3000
   user = {
     m2: 45,
     income: 1000,
     savings: 25
   },
   _data = {
     m2: [20, 35, 45, 55, 65, 100],
     income: [250, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000],
     saving: [5, 10, 15, 20, 25, 30, 40, 50],
     cities:  {

       '65': [956, 1042], // tbilisi 65 tbilisi
       '23': [1074,	1171], // Adjara 23 batumi
       '9':  [591, 644], // Samegrelo-Zemo Svaneti 9 zugdidi
       '69': [493, 537], // Mtskheta-Mtianeti 69 mtskheta
       '75': [471, 513], // Shida Kartli 75 gori
       '29': [456,	497], // Imereti 29 kutaisi
       '55': [456, 497], // Samtskhe-Javakheti 55 akhaltsikhe
       '52': [450,	491], // Kvemo Kartli 52 rustavi
       '31': [399,	435], // Kakheti 31 telavi
       '35': [213,	232], // Guria 35 ozurgeti
       '14': [142, 155] // Racha-Lechkhumi and Kvemo Svaneti 14 ambrolauri
     },
     tbilisi:
     {
       gldani_nazaladevi: [649,	707],
       isani_samgori: [708,	772],
       didgori: [745,	812],
       didube_chugureti: [862, 940],
       vake_saburtalo: [1011,	1102],
       zveli_tbilisi: [1153,	1257]
     },
   };
   var init = function() {
       loaderStartTime = (new Date()).getTime();
      // blink();
      // d3.select(window).on('resize', resize);
       I18n.init(function(){ init_continue(); });
   };
   var init_continue = function() {
     bar_chart_draw();
     georgia_map_draw();
   };
   var blink = function () {
      d3.select('.loader .woman')
         .transition()
         .duration(blinkDuration)
         .ease(blinkEase)
         .style("opacity",0.2)
         .each("end", function(){
            d3.select('.loader .woman')
            .transition()
            .delay(100)
            .duration(blinkDuration)
            .ease(blinkEase)
            .style("opacity",1)
            .each("end", blink);
         });
   };

  var bind = function() {

    d3.selectAll('.filters select.filter').on('change',function(d){ filter(); });

    d3.selectAll('.map .georgia .region').on('click', function(d){
      render(d3.select(this).data()[0].properties.OBJECTID, true);
    });

    d3.selectAll('.bar-georgia .bar').on('click', function(d){
      console.log(d);
      // d3.selectAll('.map .georgia .region.active').classed('active',false);
      // var t = d3.select(this).classed('active', true);
      render(d.key, true);
    });


    d3.selectAll('.map .georgia .region').on('mouseover', function(d) {

      d3.select('.bar-georgia .bar.hover').classed('hover', false);

      render(d.properties.OBJECTID, true);

      d3.select('.bar-georgia #bar_' + d.properties.OBJECTID).classed('hover',true);
    });

    d3.selectAll('.map .georgia .region').on('mouseout', function() {
      d3.select('.bar-georgia .bar.hover').classed('hover',false);

      var tmp = d3.select('.map .georgia path.active').data()[0].properties;
      render(tmp.OBJECTID, true);

      d3.select('.bar-georgia #bar_' + tmp.OBJECTID).classed('hover',true);
    });

    d3.selectAll(".map .georgia path#region" + default_region).each(function(d, i) {
        d3.select(this).on("click").apply(this, [d, i]);
    });

    I18n.remap();
    loader_stop();
  };
  var filter = function() {
    user.m2 = d3.select('.filters .filter.m2').property('value');
    user.income = d3.select('.filters .filter.income').property('value');
    user.savings = d3.select('.filters .filter.savings').property('value');

    render(d3.select('.map .georgia path.active').data()[0].properties.OBJECTID, false);
  };
  var loader_stop = function()
  {
    var show = function() {
      d3.select('.wrapper').style({"visibility":"visible", "opacity": 0});
      d3.select('.loader').style("display","none");
      d3.select('.wrapper').transition().duration(1000).style('opacity',1).each("end", function(){
        // trigger_drag(1,3000);
      });
    };
    if(loaderStartTime - (new Date()).getTime() > loaderAtLeast)
    {
      show();
    }
    else
    {
      setTimeout(function(){ show(); }, loaderAtLeast);
    }
  };
  // var resize = function() {
  //   w = u.width();
  //   h = u.height();
  // };
  var render = function(current_id, sort) {
    // make active and hover states for map and for bar chart
    // var map_georgia = d3.select('.map .georgia');
    // map_georgia.selectAll('.region.active').classed('active',false);
    // map_georgia.select('#region' + current_id).classed('active',true);

    if(sort)
    {
      var active_id = d3.select('.map .georgia path.active').data()[0].properties.OBJECTID;
      geo_map.selectAll(".map .georgia .region").sort(function (a, b) {
        if (a.properties.OBJECTID == current_id) return 1;
        else if (a.properties.OBJECTID == active_id) return 2;
        else return -1;
      });
    }

    var d = _data.cities[current_id];

    var month_amount = d[0];
    var month_amount_with_loan = d[1];

    var out = d3.select('.output');
    var years = Math.round(((user.m2 * month_amount)/( user.income*user.savings/100))/12);
    var saving_per_month = user.income*user.savings/100;
    var current_color = color_by_year(years);
    out.select('.city').text(I18n.t('data-I18n-cities-'+ current_id)).style('color', current_color);

    out.select('.via-saving .amount').text(user.m2 * month_amount);
    out.select('.via-saving .years').text(years).style('color', current_color);
    out.select('.via-loan .amount').text(user.m2 * month_amount_with_loan);
    out.select('.via-loan .years').text(Math.round(((user.m2 * month_amount_with_loan)/( saving_per_month))/12));



    var bar_chart_data = [];
    d3.selectAll('.map .georgia .region').each(function(d){
      var tmp_id = d.properties.OBJECTID;

      var years = Math.round(((user.m2 * _data.cities[tmp_id][0])/(saving_per_month))/12);
      var year_with_loan = Math.round(((user.m2 * _data.cities[tmp_id][1])/(saving_per_month))/12);

      var col = color_by_year(years);
      d3.select(this).style('fill', col);

      bar_chart_data.push({id: tmp_id,  y1: years, y2: year_with_loan});

    });
  }



/*------------------------------------------ Georgia Map ------------------------------------------*/

  var georgia_map_draw = function() {
    var map_w = 690,
        map_h = 400;

        geo_map = d3.select(".map .georgia")
                    .append("svg")
                    .attr("width", map_w)
                    .attr("height", map_h);

    var tip = d3.tip()
      .attr('class', 'tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span>"+I18n.t('legend-' + d)+"</span>";
      })
      geo_map.call(tip);

    d3.json("assets/data/georgia.json", function(error, shapes) {
      if (error) throw error;

      var projection = d3.geo.mercator()
          .scale(5000)
          .translate([map_w/2,map_h/2])
          .center([43.52606083142459,42.18408590602157]);

      var path = d3.geo.path()
          .projection(projection);


          geo_map.append("g")
          .attr("class", "regions")
          .selectAll("path")
            .data(topojson.feature(shapes, shapes.objects.regions).features)
            .enter().append("path")
            .attr("id", function(d) { return 'region' + d.properties.OBJECTID; })// return quantize(rateById.get(d.id)); })
              .attr("class", function(d) {
                return (disabled_region.indexOf(d.properties.OBJECTID) >= 0 ?  '' : 'region') })// return quantize(rateById.get(d.id)); })
              .attr("d", path);

      var regions_box = geo_map.select('.regions').node().getBBox();
      geo_map.select('.regions')
        .append("text")
        .attr('class', 'georgia-caption')
        .text(I18n.t('georgia'))
        .attr('y', regions_box.height + regions_box.y + 20);

        var georgia_caption = geo_map.select('.georgia-caption').node().getBBox();
        d3.select('.georgia-caption')
          .attr('x', regions_box.width/2 );

        geo_map.append("g")
         .attr("class", "legend")
         .selectAll("rect")
          .data(d3.range(1,color_step+1,1))
          .enter().append("rect")
          .attr({'width':'15', 'height':'15'})
          .attr("x", function(d, i){ return i * 20 + 30;})
          .attr("y", map_h - 20 )
          .style('fill', function(d){ return colors(d); })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);


      geo_map.select('.regions').append("path")
        .datum(topojson.feature(shapes, shapes.objects.cities))
        .attr("d", path)
        .attr("class", "place");

      // svg.selectAll(".place-label")
      // .data(topojson.feature(shapes, shapes.objects.cities).features)
      // .enter().append("text")
      // .attr("class", "place-label")
      // .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
      // .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
      // .attr("dy", ".35em")
      // .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; })
      // .text(function(d) { return 'blah'; });

      d3.select(self.frameElement).style("height", map_h + "px");

      bind();

    });
  };
  var bar_chart_draw = function() {
    var bar_w = 220,
        bar_h = 280,
        bar_h_legend = 120,
        bar_padding = 2;

    var bar_geogia = d3.select(".output2 .bar-georgia")
                .append("svg")
                .attr("width", bar_w)
                .attr("height", bar_h);

    var bar_max_value = 0;
    var entries = d3.entries(_data.cities).sort(function(a,b){
      if(a.value[0] < b.value[0]) {
        return -1;
      }
      if(a.value[0] > b.value[0]) {
        return 1;
      }
      return 0;
    }).reverse();

    entries.forEach(function(d){
      d.value.push(Math.round(((user.m2 * d.value[0])/( user.income*user.savings/100))/12));
      if (bar_max_value < d.value[2]) {
        bar_max_value = d.value[2];
      }
      d.value.push(Math.round(((user.m2 * d.value[1])/( user.income*user.savings/100))/12));
      if (bar_max_value < d.value[3]) {
        bar_max_value = d.value[3];
      }
    });
    var y = d3.scale.linear().domain([0,bar_max_value]).range([bar_h-bar_h_legend, 0]);

    var entry_w = bar_w/entries.length-bar_padding;

    var bars = bar_geogia.append("g")
      .attr("class", "bars")
      .selectAll(".bar")
      .data(entries)
      .enter().append('g')
      .attr("class", "bar")
      .attr("id", function(d){ return "bar" + d.key; });

    var bar_loan = bars.append("rect")
        .attr('class', function(d) { return d.value[3] > 15 ? 'beyond l' : 'l' })
        .attr("width", entry_w)
        .attr("height", function(d) {
          return (bar_h-bar_h_legend) - y(d.value[3]-d.value[2]);
        })
        .attr("x", function(d,i) { return i*(entry_w+bar_padding); })
        .attr("y", function(d) { return y(d.value[3]); });

    var bar_saving = bars.append("rect")
        .attr("class","s")
        .style('fill', function(d) { return color_by_year(d.value[2]); })
        .attr("width", entry_w)
        .attr("height", function(d) {
          return (bar_h-bar_h_legend) - y(d.value[2]);
        })
        .attr("x", function(d,i) { return i*(entry_w+bar_padding); })
        .attr("y", function(d) { return y(d.value[2]); });


    var legend = bar_geogia.append("g")
      .attr("class", "xaxis")
      .selectAll("text")
      .data(entries)
      .enter().append('text')
      .text(function(d){ return I18n.t('cities-' + d.key); });

      legend.each(function (d,i) {
        // console.log(d,i);
        var t = d3.select(this);
        var bbox = t.node().getBBox();
        t.attr("x", i*(entry_w+bar_padding) - (bbox.width/2 - entry_w/2))
          .attr("y", (bar_h-bar_h_legend) + 12 + bbox.width/2);
        bbox = t.node().getBBox();
        t.attr("transform", 'rotate(-90, ' + (bbox.x + bbox.width/2) + ', ' + (bbox.y + bbox.height/2) + ')');

      });

      var tip = d3.tip()
        .attr('class', 'tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<span>"+I18n.t('legend-' + d)+"</span>";
        })
      bar_geogia.call(tip);

      bar_geogia.append("g")
       .attr("class", "legend")
       .selectAll("rect")
        .data(d3.range(1,color_step+1,1))
        .enter().append("rect")
        .attr("x", function(d, i){ return i * 18;})
        .style('fill', function(d){ return colors(d); })

      bar_geogia.select('.legend').append("rect")
        .data('l')
        .attr('fill','#62dadd')
        .attr("x", function(d, i){ return color_step * 18 + 20;})

      bar_geogia.select('.legend').append("rect")
        .data('b')
        .attr('fill','#314451')
        .attr("x", function(d, i){ return (color_step+1) * 18 + 20;})

      bar_geogia.selectAll('.legend rect')
        .attr({'width':'13', 'height':'13'})
        .attr("y", bar_h - 16)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
  }

  init();
  return obj;

})();
