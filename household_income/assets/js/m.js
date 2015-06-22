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
   colors = d3.scale.linear().domain([1, color_step]).range(color_range),
   currency = 2.2432, // default was taken 22.06.2015
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
     savings: 25,
     saving_amount: 250,
     set: function(_m2,_income,_savings) {
       this.m2 = _m2;
       this.income = _income;
       this.savings = _savings;
       this.saving_amount = this.income*this.savings/100;
     }
   },
   _data = {
     m2: [20, 35, 45, 55, 65, 100],
     income: [250, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000],
     saving: [5, 10, 15, 20, 25, 30, 40, 50],
     areas:  {
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
       '206': [1153,	1257], // ძველი თბილისი
       '203': [1011,	1102], // ვაკე-საბურთალო
       '204': [862, 940], // დიდუბე-ჩუღურეთი
       '205': [745,	812], // დიდგორი
       '201': [708,	772], // ისანი-სამგორი
       '202': [649,	707] // გლდანი-ნაძალადევი
     },
     geo_areas: [23,65,9,69,75,29,55,52,31,35,14], // sorted desc
     tbi_areas: [206,203,204,205,201,202], // sorted desc
   },

  //  entries = d3.entries(_data.areas).sort(function(a,b){
  //    if(a.value[0] < b.value[0]) {
  //      return -1;
  //    }
  //    if(a.value[0] > b.value[0]) {
  //      return 1;
  //    }
  //    return 0;
  //  }).reverse(),

    how_long = function(square_meter_price) { // price
     return Math.round10(((user.m2 * square_meter_price)/(user.saving_amount))/12, -1);
    },
    how_long_full = function(square_meter_price) {
      var tmp = ((user.m2 * square_meter_price)/(user.saving_amount));
      var m = Math.round(tmp%12);
      return [Math.floor(tmp/12, -1)+(m==12?1:0), (m==12?0:m)];
    };


   var init = function() {
       loaderStartTime = (new Date()).getTime();
      // blink();
      // d3.select(window).on('resize', resize);
       I18n.init(function(){ init_continue(); });
   };
   var init_continue = function() {
     currency_init();
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

    var tip = d3.tip()
      .attr('class', 'tip loan-warning')
      .offset([-10, 0])
      .html(function(d) { return d3.select(this).attr('title'); })


    d3.select('.output .via-loan .notice').call(tip)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

    I18n.remap();
    loader_stop();
  };
  var filter = function() {
    var filters = d3.select('.filters');

    user.set(filters.select('.filter.m2').property('value'),
              filters.select('.filter.income').property('value'),
              filters.select('.filter.savings').property('value'));

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


    var current_color = color_by_year(how_long(month_amount));
    out.select('.city').text(I18n.t('data-I18n-areas-'+ current_id)).style('color', current_color);

    out.select('.via-saving .amount').text(user.m2 * month_amount);

    var year_month = how_long_full(month_amount);
    out.select('.via-saving .years').text(year_month[0]).style('color', current_color);
    out.select('.via-saving .months').text(year_month[1]).style('color', current_color);

    out.select('.via-loan .amount').text(user.m2 * month_amount_with_loan);

    year_month = how_long_full(month_amount_with_loan);
    out.select('.via-loan .years').text(year_month[0]);

    var title = "";
    var notice = d3.select(".via-loan svg.notice").style("display", "none");
    if(year_month[0]>15) {
      title = I18n.t("loan_warning").replace('XX', year_month[0]);
      notice.attr('title', title).style("display", "block")
    }


    out.select('.via-loan .months').text(year_month[1]);

    d3.selectAll('.map .area').each(function(d){
      var tmp_id = d.properties.OBJECTID;

      var years = how_long(_data.areas[tmp_id][0]);

      var col = color_by_year(years);
      d3.select(this).style('fill', col);

    });
  }

/*------------------------------------------ Georgia Map ------------------------------------------*/

  var init_maps = function() {
    var map_w = 690,
        map_h = 400;

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

        var projection = d3.geo.mercator()
            .scale(4400)
            .translate([map_w/2,map_h/2])
            .center([43.52606083142459,42.18408590602157]);

        var path = d3.geo.path()
            .projection(projection);


            geo_map.append("g")
            .attr("class", "areas")
            .selectAll("path")
              .data(topojson.feature(geo_areas, geo_areas.objects.regions).features)
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
    var bar_geogia = d3.select(".output2 .bar-georgia")
                .append("svg")
                .attr("width", bar_w)
                .attr("height", bar_h);

    var bar_max_value = 0;
    var areas = _data.areas;
    geo_areas.forEach(function(d){
      var tmp = areas[d].value;

      tmp.push(how_long(tmp[0]));
      if (bar_max_value < tmp[2]) {
        bar_max_value = tmp[2];
      }
      tmp.push(how_long(tmp[1]));
      if (bar_max_value < tmp[3]) {
        bar_max_value = tmp[3];
      }
    });
    var y = d3.scale.linear().domain([0,bar_max_value]).range([bar_h-bar_h_legend, 0]);

    var entry_w = bar_w/geo_areas.length-bar_padding;
    var bars = bar_geogia.append("g")
      .attr("class", "bars")
      .selectAll(".bar")
      .data(geo_areas)
      .enter().append('g')
      .attr("class", "bar")
      .attr("id", function(d){ return "bar" + d; });
    var bar_loan = bars.append("rect")
        .attr('class', function(d) { return areas[d].value[3] > 15 ? 'beyond l' : 'l' })
        .attr("width", entry_w)
        .attr("height", function(d) {

          return (bar_h-bar_h_legend) - y(areas[d].value[3]-areas[d].value[2]);
        })
        .attr("x", function(d,i) { return i*(entry_w+bar_padding); })
        .attr("y", function(d) { return y(areas[d].value[3]); });

    var bar_saving = bars.append("rect")
        .attr("class","s")
        .style('fill', function(d) { return color_by_year(areas[d].value[2]); })
        .attr("width", entry_w)
        .attr("height", function(d) {
          return (bar_h-bar_h_legend) - y(areas[d].value[2]);
        })
        .attr("x", function(d,i) { return i*(entry_w+bar_padding); })
        .attr("y", function(d) { return y(areas[d].value[2]); });


    // var legend = bar_geogia.append("g")
    //   .attr("class", "x-axis")
    //   .selectAll("text")
    //   .data(entries)
    //   .enter().append('text')
    //   .attr('id', function(d) { return "x-axis" + d.key; })
    //   .text(function(d){ return I18n.t('areas-' + d.key); });
    //
    //   legend.each(function (d,i) {
    //     // console.log(d,i);
    //     var t = d3.select(this);
    //     var bbox = t.node().getBBox();
    //     t.attr("x", i*(entry_w+bar_padding) - (bbox.width/2 - entry_w/2))
    //       .attr("y", (bar_h-bar_h_legend) + 12 + bbox.width/2);
    //     bbox = t.node().getBBox();
    //     t.attr("transform", 'rotate(90, ' + (bbox.x + bbox.width/2) + ', ' + (bbox.y + bbox.height/2) + ')');
    //
    //   });
    //
    //   var tip = d3.tip()
    //     .attr('class', 'tip')
    //     .offset([-10, 0])
    //     .html(function(d) {
    //       return "<span>"+I18n.t('legend-' + d)+"</span>";
    //     })
    //   bar_geogia.call(tip);
    //
    //   bar_geogia.append("g")
    //    .attr("class", "legend")
    //    .selectAll("rect")
    //     .data(d3.range(1,color_step+1,1))
    //     .enter().append("rect")
    //     .attr("x", function(d, i){ return i * 18;})
    //     .style('fill', function(d){ return colors(d); })
    //
    //   bar_geogia.select('.legend').append("rect")
    //     .data('l')
    //     .attr('fill','#56bfbf')
    //     .attr("x", function(d, i){ return color_step * 18 + 20;})
    //
    //   bar_geogia.select('.legend').append("rect")
    //     .data('b')
    //     .attr('fill','#314451')
    //     .attr("x", function(d, i){ return (color_step+1) * 18 + 20;})
    //
    //   bar_geogia.selectAll('.legend rect')
    //     .attr({'width':'13', 'height':'13'})
    //     .attr("y", bar_h - 16)
    //     .on('mouseover', tip.show)
    //     .on('mouseout', tip.hide);
  }
  var bar_chart_draw = function() {

    var bar_geogia = d3.select(".output2 .bar-georgia svg");

    var bar_max_value = 0;

    entries.forEach(function(d){
      d.value[2] = how_long(d.value[0]);
      if (bar_max_value < d.value[2]) {
        bar_max_value = d.value[2];
      }
      d.value[3] = how_long(d.value[1]);
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

    var len = entries.length;
    for(var i = 0; i < len; ++i) {
      var tmp = entries[i]['value'];

      tmp[0] = Math.round(tmp[0] * currency);
      tmp[1] = Math.round(tmp[1] * currency);
    }

    bar_chart_init();
    init_maps();

  };

  init();
  return obj;

})();



function position() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			// Subtract offsetParent scroll positions
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ) -
				offsetParent.scrollTop();
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true ) -
				offsetParent.scrollLeft();
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	}

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	function offsetParent() {
		return this.map(function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		});
	}
