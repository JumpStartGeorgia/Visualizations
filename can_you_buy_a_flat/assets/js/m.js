var mw = (function () {
   var obj = { },
   blinkDuration = 900,
   animDuration = 900,
   blinkEase = "linear",

   w = u.width(),
   h = u.height(),
   bar_w = 440,
   bar_h = 310,
   map_w = 620,
   map_h = 400,
   bar_space = 50, // space betweet georgia and tbilisi bar chart
   bar_h_legend = 140,
   bar_h_caption = 30,
   bar_padding = 2,
   geo_map = null,
   tbi_map = null,
   geo_proj = null,
   disabled_area = [1, 15],
   default_area = 65,
   color_step = 9,
   color_range = ['#f9c235', '#ff6043'],
   colors = d3.scale.linear().domain([1, color_step]).range(color_range),
   currency = 2.2432, // default was taken 22.06.2015
   interest_rate = 0.09,
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
   loaderStartTime,
   loaderAtLeast = 0, // milliseconds 3000
   user = {
     m2: 45,
     income: 1000,
     savings: 25,
     saving_amount: 250,
     set: function(_m2,_income,_savings) {
       this.m2 = _m2;
       this.income = _income;
       this.savings = _savings;
       this.saving_amount = this.income*this.savings/100;
     }
   },
   areas = {
     '23': [1074,	1171], // Adjara 23 batumi
     '65': [956, 1042], // tbilisi 65 tbilisi
     '9':  [591, 644], // Samegrelo-Zemo Svaneti 9 zugdidi
     '69': [493, 537], // Mtskheta-Mtianeti 69 mtskheta
     '75': [471, 513], // Shida Kartli 75 gori
     '29': [456,	497], // Imereti 29 kutaisi
     '55': [456, 497], // Samtskhe-Javakheti 55 akhaltsikhe
     '52': [450,	491], // Kvemo Kartli 52 rustavi
     '31': [399,	435], // Kakheti 31 telavi
     '35': [213,	232], // Guria 35 ozurgeti
     '14': [142, 155], // Racha-Lechkhumi and Kvemo Svaneti 14 ambrolauri
     '1': [0, 0], // სოხუმი
     '15': [0, 0], // ცხინვალი
     '206': [1153,	1257], // ძველი თბილისი
     '203': [1011,	1102], // ვაკე-საბურთალო
     '204': [862, 940], // დიდუბე-ჩუღურეთი
     '205': [745,	812], // დიდგორი
     '201': [708,	772], // ისანი-სამგორი
     '202': [649,	707] // გლდანი-ნაძალადევი
   },
   geo_areas = [23,65,9,69,75,29,55,52,31,35,14], // sorted desc
   tbi_areas = [206,203,204,205,201,202], // sorted desc
   entries = geo_areas.concat(tbi_areas),

    how_long = function(smp, type) { // smp square meter price type decimal or [years, months]
        var tmp = type == "loan"
                    ? Math.ceil((Math.log(user.saving_amount) - Math.log(user.saving_amount - (user.m2 * smp)*interest_rate/12)) /  Math.log(1 + interest_rate/12))
                    : Math.round10((user.m2 * smp)/(user.saving_amount));
                    tmp = isNaN(tmp) ? 0 : tmp;
        return { d: Math.round10(tmp/12, -1),
                 t: [Math.floor(tmp/12), tmp%12 ],
                 m: tmp };
    };
    // nnn=(Math.log(payt)-Math.log(payt-(princ*intr)/1200))/Math.log(1+(intr/1200));
   var init = function() {
       loaderStartTime = (new Date()).getTime();
       resize();
       I18n.init(function(){ init_continue(); });
   };
   var init_continue = function() {
     currency_init();
   };
  var bind = function() {
    d3.select(window).on('resize', resize);

    d3.selectAll('.filters select.filter').on('change',function(d){ filter(); });

    d3.selectAll('.map .area:not(.disabled)').on('click', function(d){
      render(d3.select(this).data()[0].properties.OBJECTID, true, false);
    });


    d3.selectAll('.bar-georgia .bar, .bar-georgia .x-axis text').on('click', function(d){
      render(d, true, false);
    });

    d3.selectAll('.map .area').on('mouseover', function(d) {
      render(d.properties.OBJECTID, true, true);
    });

    d3.selectAll('.bar-georgia .bar, .bar-georgia .x-axis text').on('mouseover', function(d){
      render(d, true, true);
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

    var tip = d3.tip()
      .attr('class', 'tip loan-warning')
      .offset([-10, 0])
      .html(function(d) { return d3.select(this).attr('title'); })


    d3.select('.output .via-loan .notice').call(tip)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);


    d3.selectAll('.methodology, .popup .close, .popup .bg').on('click', function() {
      var popup = d3.select('.popup');
      popup.classed('open', !popup.classed('open'));
    });
    d3.select('body').on('keydown', function() {
      if(d3.event.keyCode == 27) {
        d3.select('.popup').classed('open', false);
        d3.selectAll('.dropdown.open').classed('open', false);
      }
    });
    d3.select('body').on('click.dropdown', function() {
      d3.selectAll('.dropdown.open').classed('open', false);
    });
    d3.selectAll('.dropdown .dropdown-toggle').on('click', function() {
      d3.selectAll('.dropdown.open').classed('open', false);
      var dropdown = d3.select(this.parentNode);
      dropdown.classed('open', !dropdown.classed('open'));
      d3.event.preventDefault();
      d3.event.stopPropagation();
    });
    d3.selectAll('.dropdown .dropdown-menu a').on('click', function(e) {

      var dropdown = d3.select(this.parentNode.parentNode.parentNode);
      var dropdown_toggle = dropdown.select('.dropdown-toggle');
      var dropdown_menu = d3.select(this.parentNode.parentNode);
      var dropdown_menu_li = d3.select(this.parentNode);

      dropdown_menu.selectAll('li').classed('selected', false);
      dropdown_menu_li.classed('selected', true);
      dropdown_toggle.text(d3.select(this).text());
      dropdown.classed('open', false);
      filter();
      d3.event.preventDefault();
      d3.event.stopPropagation();
    });
    d3.select('.poster .stop').on('click', function() {
      var t = d3.select(this.parentNode);
      t.classed('paused', !t.classed('paused'));
    });
    I18n.remap();
    loader_stop();
  };
  var filter = function() {
    var filters = d3.select('.filters');

    user.set(filters.select('.filter.m2 .dropdown-menu li.selected a').attr('value'),
              filters.select('.filter.income .dropdown-menu li.selected a').attr('value'),
              filters.select('.filter.savings .dropdown-menu li.selected a').attr('value'));
    render(d3.select('.map .georgia path.active').data()[0].properties.OBJECTID, false, false);
    bar_chart_draw();
  };
  var loader_stop = function() {
    var show = function() {
      d3.select('body').classed('noscroll', false);
      d3.select('.wrapper').style({"visibility":"visible", "opacity": 0.2});
      d3.select('.loader').style("display","none");
      d3.select('.wrapper').transition().duration(1000).style('opacity',1);
    };
    var elapsed = (new Date()).getTime() - loaderStartTime;

    if(elapsed > loaderAtLeast)
    {
      show();
    }
    else
    {
      setTimeout(function(){ show(); }, loaderAtLeast - elapsed);
    }
  };
  var resize = function() {
    console.log(w,h);
    w = u.width();
    h = u.height();

    map_w = w<620 ? w-40 : 620;
    bar_w = w<440 ? w-40-20 : 440;
    var scaler = w<620 ? 4000 : 4400;

    // geo_proj = d3.geo.mercator()
    //     .scale(scaler)
    //     .translate([map_w/2+40,map_h/2])
    //     .center([43.52606083142459,42.18408590602157]);
    //
    // var path = d3.geo.path()
    //     .projection(geo_proj);
    //
    //   geo_map
    //   .attr("width", map_w)
    //   .attr("height", map_h);
    //   // resize the map
    //   geo_map.select('.area').attr('d', path);
  };
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

      tmp.selectAll(".area").sort(function (a, b) {
        if (a.properties.OBJECTID == current_id) return 1;
        else if (a.properties.OBJECTID == active_id) return 2;
        else return -1;
      });
    }

    var d = areas[current_id];
    var month_amount = d[0];

    var out = d3.select('.output');

    var hl = how_long(month_amount);
    var hll = how_long(month_amount, 'loan');

    var current_color = hl.d != 0 ? color_by_year(hl.d) : '#314451';

    out.select('.city').text(I18n.t('data-I18n-areas-'+ current_id)).style('color', current_color);

    out.select('.via-saving .amount').text(zero(reformat(user.m2 * month_amount,0))).classed('symbol', hl.d != 0);
    out.select('.via-saving .years').text(zero(hl.t[0])).style('color', current_color);
    out.select('.via-saving .months').text(zero(hl.t[1])).style('color', current_color);

    out.select('.via-loan .amount').text(zero(reformat(hll.m * user.saving_amount,0))).classed('symbol', hll.d != 0);

    out.select('.via-loan .years').text(zero(hll.t[0]));

    var title = "";
    var notice = d3.select(".via-loan svg.notice").style("display", "none");
    var b = false;
    if(hll.t[0]>15) {
      title = I18n.t("loan_warning").replace('XX', hll.t[0]);
      notice.attr('title', title).style("display", "block");
      b = true;
    }
    out.select('.via-loan .years-box').classed('disabled', b);

    out.select('.via-loan .months').text(zero(hll.t[1]));

    d3.selectAll('.map .area').each(function(d){
      var tmp_id = d.properties.OBJECTID;

      var years = how_long(areas[tmp_id][0]).d;

      if(disabled_area.indexOf(tmp_id) == -1)
      {
        var col = color_by_year(years);
        d3.select(this).style('fill', col);
      }

    });
  }

/*------------------------------------------ Georgia Map ------------------------------------------*/

  var init_maps = function() {
    map_w = w<620 ? w-40 : 620;
      var scaler = w<620 ? 4000 : 4400;
        geo_map = d3.select(".map .georgia")
                    .append("svg")
                    .attr("width", map_w)
                    .attr("height", map_h);

    var map_tbi_w = 180,
        map_tbi_h = 160;

        tbi_map = d3.select(".map .tbilisi")
                    .append("svg")
                    .attr("width", map_tbi_w)
                    .attr("height", map_tbi_h);

    var tip = d3.tip()
      .attr('class', 'tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span>"+I18n.t('legend-' + d)+"</span>";
      })
      geo_map.call(tip);



    queue()
    	.defer(d3.json, 'assets/data/georgia.json')
    	.defer(d3.json, 'assets/data/tbilisi.json')
    	.await(build_maps);

      function build_maps(error, geo_areas, tbilisi_areas) {
        if (error) throw error;

        geo_proj = d3.geo.mercator()
            .scale(scaler)
            .translate([map_w/2+40,map_h/2])
            .center([43.52606083142459,42.18408590602157]);

        var path = d3.geo.path()
            .projection(geo_proj);


            geo_map.append("g")
            .attr("class", "areas")
            .selectAll("path")
              .data(topojson.feature(geo_areas, geo_areas.objects.regions).features)
              .enter().append("path")
              .attr("id", function(d) { return 'area' + d.properties.OBJECTID; })
                .attr("class", function(d) {
                  return (disabled_area.indexOf(d.properties.OBJECTID) >= 0 ?  'area disabled' : 'area') })
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
          .datum(topojson.feature(geo_areas, geo_areas.objects.cities))
          .attr("d", path)
          .attr("class", "place");

        // tbilisi map *********************************************************

        projection = d3.geo.mercator()
          .scale(20000)
          .translate([map_tbi_w/2,(map_tbi_h-20)/2])
          .center([44.81,  41.73]);
        path = d3.geo.path()
          .projection(projection);

        tbi_map.append("g")
        .attr("class", "areas")
        .selectAll("path")
          .data(topojson.feature(tbilisi_areas, tbilisi_areas.objects.tbilisi_area).features)
          .enter().append("path")
          .attr("id", function(d) { return 'area' + d.properties.OBJECTID; })
            .attr("class", 'area')
            .attr("d", path);

        areas_box = tbi_map.select('.areas').node().getBBox();
        tbi_map.select('.areas')
          .append("text")
          .attr('class', 'tbilisi-caption')
          .text(I18n.t('georgia_capital'))
          .attr('y', areas_box.height + areas_box.y + 35);

        areas_box = tbi_map.select('.tbilisi-caption').node().getBBox();
        d3.select('.tbilisi-caption')
          .attr('x', areas_box.width/2 + 20 );


        // bind *********************************************************
        d3.select(self.frameElement).style("height", map_h + "px");

        bind();
      }
  };

  var bar_chart_init = function() {
    var bar_georgia = d3.select(".output2 .bar-georgia")
                .append("svg")
                .attr("width", bar_w)
                .attr("height", bar_h);

    var bar_max_value = 0,
      geo_index = 0,
      tbi_index = 0;

    entries.forEach(function(d){
      var tmp = areas[d];
      tmp.push(how_long(tmp[0]).d);
      if (bar_max_value < tmp[2]) {
        bar_max_value = tmp[2];
      }
      tmp.push(how_long(tmp[0]).d, 'loan');
      if (bar_max_value < tmp[3]) {
        bar_max_value = tmp[3];
      }
    });
    var y = d3.scale.linear().domain([0,bar_max_value]).range([bar_h-bar_h_legend, bar_h_caption+40]);
    var entry_w = (bar_w-bar_space)/entries.length-bar_padding;

    // caption block
    var captions = bar_georgia.append("g")
       .attr("class", "captions");
    var caption = captions
        .append("text")
        .style('visibility', 'hidden')
        .attr('class', 'caption')
        .text(I18n.t('georgia'));
    var caption_box = caption.node().getBBox();
    var cap_h = caption_box.height;
    var cap_line_h = cap_h + 18;
    caption.attr({'x': 5, 'y': cap_h }).style('visibility', 'visible');

    captions
      .append("line")
      .attr({'x1': 5, 'y1': cap_line_h , 'x2': Math.round5(caption_box.width) + 40, 'y2': cap_line_h });

    caption = captions
        .append("text")
        .style('visibility', 'hidden')
        .attr('class', 'caption')
        .text(I18n.t('georgia_capital'));
    caption_box = caption.node().getBBox();
    caption.attr({'x': bar_w-(entry_w*6+bar_padding*6), 'y': cap_h }).style('visibility', 'visible');

    captions
      .append("line")
      .attr({'x1': Math.round5(bar_w-(entry_w*6+bar_padding*6)), 'y1': cap_line_h, 'x2':  Math.round5(bar_w), 'y2': cap_line_h });

      // bars block


    var bars = bar_georgia.append("g")
      .attr("class", "bars")
      .selectAll(".bar")
      .data(entries)
      .enter().append('g')
      .attr("class", "bar")
      .attr("id", function(d){ return "bar" + d; });

    var bar_loan = bars.append("rect")
        .attr('class', function(d) { return areas[d][3] > 15 ? 'beyond l' : 'l' })
        .attr("width", entry_w)
        .attr("height", function(d) {

          return (bar_h-bar_h_legend) - y(areas[d][3]-areas[d][2]);
        })
        .attr("x", function(d,i) {return i*(entry_w+bar_padding) + bar_space * (d>100 ? 1 : 0); })
        .attr("y", function(d) { return y(areas[d][3]); });

    var bar_saving = bars.append("rect")
        .attr("class","s")
        .style('fill', function(d) { return color_by_year(areas[d][2]); })
        .attr("width", entry_w)
        .attr("height", function(d) {
          return (bar_h-bar_h_legend) - y(areas[d][2]);
        })
        .attr("x", function(d,i) { return i*(entry_w+bar_padding) + bar_space * (d>100 ? 1 : 0); })
        .attr("y", function(d) { return y(areas[d][2]); });


        // x-axis block

    var legend = bar_georgia.append("g")
      .attr("class", "x-axis")
      .selectAll("text")
      .data(entries)
      .enter().append('text')
      .attr('id', function(d) { return "x-axis" + d; })
      .text(function(d){ return I18n.t('areas-' + d); });

      legend.each(function (d,i) {
        var t = d3.select(this);
        var bbox = t.node().getBBox();
        t.attr("x", i*(entry_w+bar_padding) - (bbox.width/2 - entry_w/2) + bar_space * (d>100 ? 1 : 0) )
          .attr("y", (bar_h-bar_h_legend) + 12 + bbox.width/2);
        bbox = t.node().getBBox();
        t.attr("transform", 'rotate(-90, ' + (bbox.x + bbox.width/2) + ', ' + (bbox.y + bbox.height/2) + ')');

      });

      // legend block

      var tip = d3.tip()
        .attr('class', 'tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<span>"+I18n.t('legend-' + d)+"</span>";
        })
      bar_georgia.call(tip);

      bar_georgia.append("g")
       .attr("class", "legend")
       .selectAll("rect")
        .data(d3.range(1,color_step+1,1))
        .enter().append("rect")
        .attr("x", function(d, i){ return i * 18;})
        .style('fill', function(d){ return colors(d); })

      bar_georgia.select('.legend').append("rect")
        .data('l')
        .attr('fill','#56bfbf')
        .attr("x", function(d, i){ return color_step * 18 + 20;})

      bar_georgia.select('.legend').append("rect")
        .data('b')
        .attr('fill','#314451')
        .attr("x", function(d, i){ return (color_step+1) * 18 + 20;})

      bar_georgia.selectAll('.legend rect')
        .attr({'width':'13', 'height':'13'})
        .attr("y", bar_h - 16)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

  }
  var bar_chart_draw = function() {

    var bar_georgia = d3.select(".output2 .bar-georgia svg");

    var bar_max_value = 0;

    entries.forEach(function(d){
      var tmp = areas[d];
      tmp[2] = how_long(tmp[0]).d;
      if (bar_max_value < tmp[2]) {
        bar_max_value = tmp[2];
      }
      tmp[3] = how_long(tmp[0],'loan').d;
      if (bar_max_value < tmp[3]) {
        bar_max_value = tmp[3];
      }
    });
    var y = d3.scale.linear().domain([0,bar_max_value]).range([bar_h-bar_h_legend, bar_h_caption+40]);

    var entry_w = bar_w/entries.length-bar_padding;

    var bars = bar_georgia.selectAll('.bars .bar')

    bars.selectAll('rect.l')
        .classed('beyond', function(d) { return areas[d][3] > 15; })
        .attr("height", function(d) {
          return (bar_h-bar_h_legend) - y(areas[d][3]-areas[d][2]);
        })
        .attr("y", function(d) { return y(areas[d][3]); });

    bars.selectAll('rect.s')
      .style('fill', function(d) { return color_by_year(areas[d][2]); })
      .attr("height", function(d) {
        return (bar_h-bar_h_legend) - y(areas[d][2]);
      })
      .attr("y", function(d) { return y(areas[d][2]); });
  };
  var currency_init = function() {

    var now = new Date(Date.now());
    var d = new Date(now.getFullYear(),now.getMonth(), now.getDate());
    d.setDate(d.getDate() - 1);

    // d3.jsonp("http://lari.jumpstart.ge/en/api/v1/nbg_rates?currency=USD&start_date=" + d.getTime() + "&end_date=" + now.getTime() + "&callback=d3.jsonp.test", function(d) {
    //
    //   if(typeof d !== 'undefined' && d.hasOwnProperty('valid') && d.valid == true) {
    //     var len = d.result[0].rates.length;
    //     currency = d.result[0].rates[len-1][1]
    //   }
    //   move here below code
    // });

    for(var i = 0; i < entries.length; ++i) {
      var tmp = areas[entries[i]];
      tmp[0] = Math.round(tmp[0] * currency);
      tmp[1] = Math.round(tmp[1] * currency);
    }

    bar_chart_init();
    init_maps();

  };

  init();
  return obj;

})();
