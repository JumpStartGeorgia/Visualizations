var mw = (function () {
   var obj = { },
   blinkDuration = 900,
   animDuration = 900,
   blinkEase = "linear",

   w = u.width(),
   h = u.height(),
   bar_w = 220,
   bar_h = 280,
   bar_h_legend = 120,
   bar_padding = 2,
   geo_map = null,
   tbi_map = null,
   disabled_area = [1, 15],
   default_area = 65,
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
     areas:  {
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
       '14': [142, 155], // Racha-Lechkhumi and Kvemo Svaneti 14 ambrolauri
       '202': [649,	707], // გლდანი-ნაძალადევი
       '201': [708,	772], // ისანი-სამგორი
       '205': [745,	812], // დიდგორი
       '204': [862, 940], // დიდუბე-ჩუღურეთი
       '203': [1011,	1102], // ვაკე-საბურთალო
       '206': [1153,	1257] // ძველი თბილისი
     }
   },
   entries = d3.entries(_data.areas).sort(function(a,b){
     if(a.value[0] < b.value[0]) {
       return -1;
     }
     if(a.value[0] > b.value[0]) {
       return 1;
     }
     return 0;
   }).reverse();



   var init = function() {
       loaderStartTime = (new Date()).getTime();
      // blink();
      // d3.select(window).on('resize', resize);
       I18n.init(function(){ init_continue(); });
   };
   var init_continue = function() {
     bar_chart_init();
     georgia_map_init();
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

    d3.selectAll('.map .area').on('click', function(d){
      render(d3.select(this).data()[0].properties.OBJECTID, true, false);
    });


    d3.selectAll('.bar-georgia .bar, .bar-georgia .x-axis text').on('click', function(d){
      render(d.key, true, false);
    });

    d3.selectAll('.map .area').on('mouseover', function(d) {
      render(d.properties.OBJECTID, true, true);
    });

    d3.selectAll('.bar-georgia .bar, .bar-georgia .x-axis text').on('mouseover', function(d){
      render(d.key, true, true);
    });

    d3.selectAll('.map .area').on('mouseout', function() {
      render(d3.select('.map path.active').data()[0].properties.OBJECTID, true, false);
    });

    d3.selectAll('.bar-georgia .bar, .bar-georgia .x-axis text').on('mouseout', function(d){
      render(d3.select('.map path.active').data()[0].properties.OBJECTID, true, false);
    });

    d3.selectAll(".map path#area" + default_area).each(function(d, i) {
        d3.select(this).on("click").apply(this, [d, i]);
    });

    I18n.remap();
    loader_stop();
  };
  var filter = function() {
    user.m2 = d3.select('.filters .filter.m2').property('value');
    user.income = d3.select('.filters .filter.income').property('value');
    user.savings = d3.select('.filters .filter.savings').property('value');

    render(d3.select('.map .georgia path.active').data()[0].properties.OBJECTID, false, false);
    bar_chart_draw();
  };
  var loader_stop = function() {
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
  var render = function(current_id, sort, hover) {
    // make active and hover states for map and for bar chart
    var maps = d3.select('.map');
    var bar_georgia = d3.select('.bar-georgia');
    var bar_georgia_legend = d3.select('.bar-georgia .x-axis');

    maps.selectAll('.area.hover').classed('hover',false);
    bar_georgia.selectAll('.bar.hover').classed('hover',false);
    bar_georgia_legend.selectAll('text.hover').classed('hover',false);
    if(!hover) {
      maps.selectAll('.area.active').classed('active',false);
      maps.select('#area' + current_id).classed('active',true);
      bar_georgia.selectAll('.bar.active').classed('active',false);
      bar_georgia.select('#bar' + current_id).classed('active',true);
      bar_georgia_legend.selectAll('text.active').classed('active',false);
      bar_georgia_legend.select('#x-axis' + current_id).classed('active',true);
    }
    else {
      maps.select('#area' + current_id).classed('hover',true);
      bar_georgia.select('#bar' + current_id).classed('hover',true);
      bar_georgia_legend.select('#x-axis' + current_id).classed('hover',true);
    }

    if(sort)
    {
      var active_id = d3.select('.map path.active').data()[0].properties.OBJECTID;
      var tmp = geo_map;
      if(+current_id > 100)
      {
        tmp = tbi_map;
      }

      tmp.selectAll(".map .georgia .area").sort(function (a, b) {
        if (a.properties.OBJECTID == current_id) return 1;
        else if (a.properties.OBJECTID == active_id) return 2;
        else return -1;
      });
    }

    var d = _data.areas[current_id];

    var month_amount = d[0];
    var month_amount_with_loan = d[1];

    var out = d3.select('.output');
    var years = Math.round10(((user.m2 * month_amount)/( user.income*user.savings/100))/12, -1);
    var saving_per_month = user.income*user.savings/100;
    var current_color = color_by_year(years);
    out.select('.city').text(I18n.t('data-I18n-areas-'+ current_id)).style('color', current_color);

    out.select('.via-saving .amount').text(user.m2 * month_amount);
    out.select('.via-saving .years').text(years).style('color', current_color);
    out.select('.via-loan .amount').text(user.m2 * month_amount_with_loan);
    out.select('.via-loan .years').text(Math.round10(((user.m2 * month_amount_with_loan)/( saving_per_month))/12, -1));

    d3.selectAll('.map .area').each(function(d){
      var tmp_id = d.properties.OBJECTID;

      var years = Math.round10(((user.m2 * _data.areas[tmp_id][0])/(saving_per_month))/12, -1);

      var col = color_by_year(years);
      d3.select(this).style('fill', col);

    });
  }

/*------------------------------------------ Georgia Map ------------------------------------------*/

  var georgia_map_init = function() {
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
          .scale(4400)
          .translate([map_w/2,map_h/2])
          .center([43.52606083142459,42.18408590602157]);

      var path = d3.geo.path()
          .projection(projection);


          geo_map.append("g")
          .attr("class", "areas")
          .selectAll("path")
            .data(topojson.feature(shapes, shapes.objects.regions).features)
            .enter().append("path")
            .attr("id", function(d) { return 'area' + d.properties.OBJECTID; })// return quantize(rateById.get(d.id)); })
              .attr("class", function(d) {
                return (disabled_area.indexOf(d.properties.OBJECTID) >= 0 ?  '' : 'area') })// return quantize(rateById.get(d.id)); })
              .attr("d", path);

      var areas_box = geo_map.select('.areas').node().getBBox();
      geo_map.select('.areas')
        .append("text")
        .attr('class', 'georgia-caption')
        .text(I18n.t('georgia'))
        .attr('y', areas_box.height + areas_box.y + 20);

        var georgia_caption = geo_map.select('.georgia-caption').node().getBBox();
        d3.select('.georgia-caption')
          .attr('x', areas_box.width/2 );

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


      geo_map.select('.areas').append("path")
        .datum(topojson.feature(shapes, shapes.objects.cities))
        .attr("d", path)
        .attr("class", "place");

      d3.select(self.frameElement).style("height", map_h + "px");

      tbilisi_map_init();
    });
  };
  var tbilisi_map_init = function() {
    var map_w = 180,
        map_h = 160;

        tbi_map = d3.select(".map .tbilisi")
                    .append("svg")
                    .attr("width", map_w)
                    .attr("height", map_h);

                    // d3.jsonp("http://lari.jumpstart.ge/en/api/v1/nbg_rates?currency=USD&start_date=" + Date.now() + "&end_date=" + Date.now(), function() {
                    //   // console.log('here',d);
                    // });


    d3.json("assets/data/tbilisi.json", function(error, shapes) {
      if (error) throw error;

      var projection = d3.geo.mercator()
          .scale(20000)
          .translate([map_w/2,(map_h-20)/2])
          .center([44.81,  41.73]);
      var path = d3.geo.path()
          .projection(projection);


          tbi_map.append("g")
          .attr("class", "areas")
          .selectAll("path")
            .data(topojson.feature(shapes, shapes.objects.tbilisi_area).features)
            .enter().append("path")
            .attr("id", function(d) { return 'area' + d.properties.OBJECTID; })
              .attr("class", 'area')
              .attr("d", path);

      var areas_box = tbi_map.select('.areas').node().getBBox();
      tbi_map.select('.areas')
        .append("text")
        .attr('class', 'tbilisi-caption')
        .text(I18n.t('georgia_capital'))
        .attr('y', areas_box.height + areas_box.y + 35);

        var areas_box = tbi_map.select('.tbilisi-caption').node().getBBox();
        d3.select('.tbilisi-caption')
          .attr('x', areas_box.width/2 + 20 );

      d3.select(self.frameElement).style("height", map_h + "px");

      bind();

    });
  };
  var bar_chart_init = function() {
    var bar_geogia = d3.select(".output2 .bar-georgia")
                .append("svg")
                .attr("width", bar_w)
                .attr("height", bar_h);

    var bar_max_value = 0;

    entries.forEach(function(d){
      d.value.push(Math.round10(((user.m2 * d.value[0])/( user.income*user.savings/100))/12, -1));
      if (bar_max_value < d.value[2]) {
        bar_max_value = d.value[2];
      }
      d.value.push(Math.round10(((user.m2 * d.value[1])/( user.income*user.savings/100))/12, -1));
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
      .attr("class", "x-axis")
      .selectAll("text")
      .data(entries)
      .enter().append('text')
      .attr('id', function(d) { return "x-axis" + d.key; })
      .text(function(d){ return I18n.t('areas-' + d.key); });

      legend.each(function (d,i) {
        // console.log(d,i);
        var t = d3.select(this);
        var bbox = t.node().getBBox();
        t.attr("x", i*(entry_w+bar_padding) - (bbox.width/2 - entry_w/2))
          .attr("y", (bar_h-bar_h_legend) + 12 + bbox.width/2);
        bbox = t.node().getBBox();
        t.attr("transform", 'rotate(90, ' + (bbox.x + bbox.width/2) + ', ' + (bbox.y + bbox.height/2) + ')');

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
  var bar_chart_draw = function() {

    var bar_geogia = d3.select(".output2 .bar-georgia svg");

    var bar_max_value = 0;

    entries.forEach(function(d){
      d.value[2] = Math.round10(((user.m2 * d.value[0])/( user.income*user.savings/100))/12, -1);
      if (bar_max_value < d.value[2]) {
        bar_max_value = d.value[2];
      }
      d.value[3] = Math.round10(((user.m2 * d.value[1])/( user.income*user.savings/100))/12, -1);
      if (bar_max_value < d.value[3]) {
        bar_max_value = d.value[3];
      }
    });
    var y = d3.scale.linear().domain([0,bar_max_value]).range([bar_h-bar_h_legend, 0]);

    var entry_w = bar_w/entries.length-bar_padding;

    var bars = bar_geogia.selectAll('.bars .bar')

    bars.selectAll('rect.l')
        .classed('beyound', function(d) { return d.value[3] > 15; })
        .attr("height", function(d) {
          return (bar_h-bar_h_legend) - y(d.value[3]-d.value[2]);
        })
        .attr("y", function(d) { return y(d.value[3]); });

    bars.selectAll('rect.s')
      .style('fill', function(d) { return color_by_year(d.value[2]); })
      .attr("height", function(d) {
        return (bar_h-bar_h_legend) - y(d.value[2]);
      })
      .attr("y", function(d) { return y(d.value[2]); });


  };

  init();
  return obj;

})();


d3.jsonp = function (url, callback) {
  function rand() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      c = '', i = -1;
    while (++i < 15) c += chars.charAt(Math.floor(Math.random() * 52));
    return c;
  }

  function create(url) {
    var e = url.match(/callback=d3.jsonp.(\w+)/),
      c = e ? e[1] : rand();
    d3.jsonp[c] = function(data) {
      callback(data);
      delete d3.jsonp[c];
      script.remove();
    };
    return 'd3.jsonp.' + c;
  }

  var cb = create(url),
    script = d3.select('head')
    .append('script')
    .attr('type', 'text/javascript')
    .attr('src', url.replace(/(\{|%7B)callback(\{|%7D)/, cb));
};
