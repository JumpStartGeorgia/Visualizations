/*global document, window, d3, topojson, u, I18n, queue, noUiSlider, self, setTimeout*/
/*eslint camelcase: 0*/
(function () {
  "use strict";
  var obj = { },
  // blinkDuration = 900,
  // animDuration = 900,
  //blinkEase = "linear",

  w = u.width(),
  h = u.height(),
  bar = {
    w: 340,
    h: 310,
    gap: 50, // space betweet georgia and tbilisi bar chart
    x_h: 140,
    y_w: 40,
    caption_h: 30,

    //margin: [10, 10, 10, 10],
    canvas: {
      w: 0,
      fw: 0, // full width
      h: 0,
      fh:0, // full height with margins
      margin: [10, 10, 10, 10]
    },
    node: {
      padding: [0, 2, 0, 0],
      horizontal_padding: 0,
      vertical_padding: 0
    },
    legend_h: 20,
    calc: function() {
      var t = this;
      t.w = w < 340 ? w - 40 - 20 : 340;
      t.canvas.w = t.w - (t.y_w + t.canvas.margin[3] + t.canvas.margin[1]);
      t.canvas.h = t.h - (t.canvas.margin[0] + t.canvas.margin[2] + t.x_h + t.caption_h + t.legend_h);
      t.canvas.fw = t.w - (t.y_w );
      t.canvas.fh = t.h - (t.x_h + t.caption_h + t.legend_h);
      t.canvas.x = t.y_w + t.canvas.margin[3];
      t.canvas.y = t.canvas.margin[0];
      t.node.horizontal_padding = t.node.padding[1] + t.node.padding[3];
      t.node.vertical_padding = t.node.padding[0] + t.node.padding[2];
    }
  },
  map_h = 400,
  map_w = 760,

  geo_map = null,
  tbi_map = null,
  geo_proj = null,
  disabled_area = [1, 15],
  default_area = 65,
  color_step = 9,
  color_range = ["#f9c235", "#f73737"],
  colors = d3.scale.linear().domain([1, color_step]).range(color_range),
  currency = 2.2432, // default was taken 22.06.2015
  interest_rate = 0.09,
  loaderStartTime,
  loaderAtLeast = 0, // milliseconds 3000
  user = {
   m2: 45,
   savings: 250
  },
  areas = {
   "23": [958.18],    // Adjara 23 batumi
   "65": [928.8],     // tbilisi 65 tbilisi
   "69": [668.93],    // Mtskheta-Mtianeti 69 mtskheta
   "9": [587.19],     // Samegrelo-Zemo Svaneti 9 zugdidi
   "55": [566.63],    // Samtskhe-Javakheti 55 akhaltsikhe
   "29": [465.01],    // Imereti 29 kutaisi
   "75": [450.67],    // Shida Kartli 75 gori
   "52": [427.17],    // Kvemo Kartli 52 rustavi
   "14": [250],       // Racha-Lechkhumi and Kvemo Svaneti 14 ambrolauri
   "31": [244.69],    // Kakheti 31 telavi
   "35": [199],       // Guria 35 ozurgeti
   "1": [0],          // სოხუმი
   "15": [0],         // ცხინვალი
   "206": [1136.41],  // ძველი თბილისი
   "203": [970.71],   // ვაკე-საბურთალო
   "204": [833.68],   // დიდუბე-ჩუღურეთი
   "205": [751.16],   // დიდგორი
   "201": [715.58],   // ისანი-სამგორი
   "202": [637.69]    // გლდანი-ნაძალადევი
  },
  geoAreas = [23, 65, 69, 9, 55, 29, 75, 52, 14, 31, 35], // sorted desc
  tbiAreas = [206, 203, 204, 205, 201, 202], // sorted desc
  entries = geoAreas.concat(tbiAreas),
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
  how_long = function(smp) { // smp square meter price type decimal or [years, months]
    var tmp0 = Math.round10((user.m2 * smp) / (user.savings)),
        tmp1 = Math.ceil((Math.log(user.savings) - Math.log(user.savings - (user.m2 * smp) * interest_rate / 12)) / Math.log(1 + interest_rate / 12));
    tmp1 = isNaN(tmp1) ? 0 : tmp1;

    return [ {
                d: Math.round10(tmp0 / 12, -1),
                t: [Math.floor(tmp0 / 12), tmp0 % 12 ],
                m: tmp0
              }, {
                d: Math.round10(tmp1 / 12, -1),
                t: [Math.floor(tmp1 / 12), tmp1 % 12 ],
                m: tmp1
              }
            ];
  },
  resize = function() {
    // console.log(w, h);
    w = u.width();
    h = u.height();

    map_w = w < 760 ? w - 40 : 760;
    bar.calc();
    //     var scaler = w < 760 ? 4000 : 4400;

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
  },
  render = function(current_id, sort, hover) {

    // make active and hover states for map and for bar chart
    var maps = d3.select(".map");
    var barGeorgia = d3.select(".bar-georgia");
    var barGeorgia_legend = d3.select(".bar-georgia .x-axis");

    maps.selectAll(".area.hover").classed("hover", false);
    barGeorgia.selectAll(".bar.hover").classed("hover", false);
    barGeorgia_legend.selectAll("text.hover").classed("hover", false);
    if(!hover) {
     maps.selectAll(".area.active").classed("active", false);
     maps.select("#area" + current_id).classed("active", true);
     barGeorgia.selectAll(".bar.active").classed("active", false);
     barGeorgia.select("#bar" + current_id).classed("active", true);
     barGeorgia_legend.selectAll("text.active").classed("active", false);
     barGeorgia_legend.select("#x-axis" + current_id).classed("active", true);
    }
    else {
     maps.select("#area" + current_id).classed("hover", true);
     barGeorgia.select("#bar" + current_id).classed("hover", true);
     barGeorgia_legend.select("#x-axis" + current_id).classed("hover", true);
    }

    if(sort)
    {
     var active_id = d3.select(".map path.active").data()[0].properties.OBJECTID;
     var tmp = geo_map;
     if(+current_id > 100)
     {
       tmp = tbi_map;
     }

     tmp.selectAll(".area").sort(function (a) {
       if (a.properties.OBJECTID === current_id) { return 1; }
       else if (a.properties.OBJECTID === active_id) { return 2; }
       else { return -1; }
     });
    }


    var month_amount = areas[current_id][0];

    var out = d3.select(".output");

    var hl = how_long(month_amount);

    var current_color = hl[0].d !== 0 ? color_by_year(hl[0].d) : "#314451";

    out.select(".city").html(I18n.t("data-I18n-areas-" + current_id)).style("color", current_color);
    var amount1 = user.m2 * month_amount;
    out.select(".via-saving .amount").text(u.zero(u.reformat(amount1, 0))).classed("symbol", hl[0].d !== 0);
    out.select(".via-saving .years").text(u.zero(hl[0].t[0])).style("color", current_color);
    out.select(".via-saving .months").text(u.zero(hl[0].t[1])).style("color", current_color);

    var loan = out.select(".via-loan");
    var amount2 = hl[1].m * user.savings;
    loan.select(".amount-box .amount").text(u.zero(u.reformat(amount2, 0))).classed("symbol", hl[1].d !== 0);
    loan.select(".diff-box .amount").text(u.zero(u.reformat(amount2 - amount1, 0))).classed("symbol", hl[1].d !== 0);
    loan.select(".years").text(u.zero(hl[1].t[0]));
    loan.select(".months").text(u.zero(hl[1].t[1]));
    loan.classed("hide1 hide2", false);
    var state = 0;
    var state_class = "";
    if(hl[1].m === 0) {
      state = 2;
      state_class = "hide2";
    }
    else if(hl[1].m > 60) {
      state = 1;
      state_class = "hide1";
    }
    loan.selectAll("[data-state-" + state + "]").each(function(){
        var t = d3.select(this);
        t.html(t.attr("data-state-" + state));
    });
    loan.classed(state_class, true);
    loan.select(".bank").classed("bank0 bank1 bank2", false).classed("bank" + state, true);

    d3.selectAll(".map .area").each(function(d) {
      var tmp_id = d.properties.OBJECTID,
          years = how_long(areas[tmp_id][0])[0].d;

      if(disabled_area.indexOf(tmp_id) === -1) {
        d3.select(this).style("fill", color_by_year(years));
      }
    });
  },
  loader_stop = function() {
    var show = function() {
      d3.select("body").classed("noscroll", false);
      d3.select(".wrapper").style({"visibility": "visible", "opacity": 0.2});
      d3.select(".loader").style("display", "none");
      d3.select(".wrapper").transition().duration(1000).style("opacity", 1);
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
  },
  bar_chart_draw = function() {
    var barGeorgia = d3.select(".bar-georgia svg");

    var maxPoint = 0;

    entries.forEach(function(d){
      var tmp = areas[d],
          hl = how_long(tmp[0]);
      tmp[1] = hl[0].d;
      tmp[2] = hl[1].d;

      if (maxPoint < tmp[1]) {
        maxPoint = tmp[1];
      }
      if (maxPoint < tmp[2]) {
        maxPoint = tmp[2];
      }
    });
    var y = d3.scale.linear().domain([0, maxPoint]).range([bar.h - bar.x_h, bar.caption_h + 40]);


    var bars = barGeorgia.selectAll(".bars .bar");
    //
    bars.selectAll("rect.l")
        .classed("beyond", function(d) { return areas[d][2] > 15; })
        .attr("height", function(d) {
          return areas[d][2] !== 0 ? (bar.h - bar.x_h) - y(areas[d][2] - areas[d][1]) : 0;
        })
        .attr("y", function(d) { return y(areas[d][2]); });

    bars.selectAll("rect.s")
      .style("fill", function(d) { return color_by_year(areas[d][1]); })
      .attr("height", function(d) {
        return (bar.h - bar.x_h) - y(areas[d][1]);
      })
      .attr("y", function(d) { return y(areas[d][1]); });
  },
  filter = function() {
    render(d3.select(".map .georgia path.active").data()[0].properties.OBJECTID, false, false);
    bar_chart_draw();
  },
  bind = function() {
    d3.select(window).on("resize", resize);

    d3.selectAll(".map .area:not(.disabled)").on("click", function(){
      render(d3.select(this).data()[0].properties.OBJECTID, true, false);
    });


    d3.selectAll(".bar-georgia .bar, .bar-georgia .x-axis text").on("click", function(d){
      render(d, true, false);
    });

    d3.selectAll(".map .area").on("mouseover", function(d) {
      render(d.properties.OBJECTID, true, true);
    });

    d3.selectAll(".bar-georgia .bar, .bar-georgia .x-axis text").on("mouseover", function(d){
      render(d, true, true);
    });

    d3.selectAll(".map .area").on("mouseout", function() {
      render(d3.select(".map path.active").data()[0].properties.OBJECTID, true, false);
    });

    d3.selectAll(".bar-georgia .bar, .bar-georgia .x-axis text").on("mouseout", function(){
      render(d3.select(".map path.active").data()[0].properties.OBJECTID, true, false);
    });

    d3.selectAll(".map path#area" + default_area).each(function(d, i) {
        d3.select(this).on("click").apply(this, [d, i]);
    });

    // var tip = d3.tip()
    //   .attr("class", "tip loan-warning")
    //   .offset([-10, 0])
    //   .html(function(d) { return d3.select(this).attr("title"); })
    //
    //
    // d3.select(".output .via-loan .notice").call(tip)
    // .on("mouseover", tip.show)
    // .on("mouseout", tip.hide);


    d3.selectAll(".methodology, .popup .close, .popup .bg").on("click", function() {
      var popup = d3.select(".popup");
      popup.classed("open", !popup.classed("open"));
    });
    d3.select("body").on("keydown", function() {
      if(d3.event.keyCode === 27) {
        d3.select(".popup").classed("open", false);
        //d3.selectAll(".dropdown.open").classed("open", false);
      }
    });
    d3.select(".poster .stop").on("click", function() {
      var t = d3.select(this.parentNode);
      t.classed("paused", !t.classed("paused"));
    });

    I18n.remap();

    var m2Slider = document.getElementById("m2_slider");
    noUiSlider.create(m2Slider, {
      start: [ 45 ],
      connect: "lower",
      // animate: true,
      step: 5,
      range: {
        "min": [ 10 ],
        "max": [ 200 ]
      },
      pips: {
        mode: "count",
        values: 2,
        density: 100
      }
    });
    var m2SliderValue = document.getElementById("m2_slider_value");
    m2Slider.noUiSlider.on("update", function( values, handle ) {
      var tmp = Math.round(values[handle]);
      user.m2 = tmp;
      m2SliderValue.innerHTML = tmp + I18n.t("m2"); filter(); });

    var savingsSlider = document.getElementById("savings_slider");
    noUiSlider.create(savingsSlider, {
      start: [ 250 ],
      connect: "lower",
      // animate: true,
      step: 10,
      range: {
        "min": [ 10 ],
        "max": [ 10000 ]
      },
      pips: {
        mode: "count",
        values: 2,
        density: 100
      }
    });
    var savingsSliderValue = document.getElementById("savings_slider_value");
    savingsSlider.noUiSlider.on("update", function( values, handle ) {
      var tmp = Math.round(values[handle]);
      user.savings = tmp;
      savingsSliderValue.innerHTML = tmp + "&#8382;"; filter(); });




    loader_stop();
  },
  init_maps = function() {
    map_w = w < 760 ? w - 40 : 760;
      var scaler = w < 760 ? 4000 : 5200;
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
      .attr("class", "tip")
      .offset([-10, 0])
      .html(function(d) {
        return "<span>" + I18n.t("legend-" + d) + "</span>";
      });
      geo_map.call(tip);

      function build_maps(error, geo_areas, tbilisi_areas) {
        if (error) { throw error; }

        geo_proj = d3.geo.mercator()
            .scale(scaler)
            .translate([map_w / 2 + 40, map_h / 2])
            .center([43.52606083142459, 42.18408590602157]);

        var path = d3.geo.path()
            .projection(geo_proj);


            geo_map.append("g")
            .attr("class", "areas")
            .selectAll("path")
              .data(topojson.feature(geo_areas, geo_areas.objects.regions).features)
              .enter().append("path")
              .attr("id", function(d) { return "area" + d.properties.OBJECTID; })
                .attr("class", function(d) {
                  return (disabled_area.indexOf(d.properties.OBJECTID) >= 0 ? "area disabled" : "area"); })
                .attr("d", path);

        var areas_box = geo_map.select(".areas").node().getBBox();
        geo_map.select(".areas")
          .append("text")
          .attr("class", "georgia-caption")
          .text(I18n.t("georgia"))
          .attr("y", areas_box.height + areas_box.y + 20);

          geo_map.select(".georgia-caption").node().getBBox();
          d3.select(".georgia-caption")
            .attr("x", areas_box.width / 2);

        geo_map.append("g")
         .attr("class", "legend")
         .selectAll("rect")
          .data(d3.range(1, color_step + 1, 1))
          .enter().append("rect")
          .attr({"width": "15", "height": "15"})
          .attr("x", function(d, i){ return i * 20 + 30; })
          .attr("y", map_h - 20 )
          .style("fill", function(d){ return colors(d); })
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide);

        geo_map.select(".areas").append("path")
          .datum(topojson.feature(geo_areas, geo_areas.objects.cities))
          .attr("d", path)
          .attr("class", "place");

          // tbilisi map *********************************************************
        var projection = d3.geo.mercator()
            .scale(23500)
            .translate([map_tbi_w / 2, (map_tbi_h - 40) / 2])
            .center([44.81, 41.73]);
          path = d3.geo.path()
            .projection(projection);

        tbi_map.append("g")
        .attr("class", "areas")
        .selectAll("path")
          .data(topojson.feature(tbilisi_areas, tbilisi_areas.objects.tbilisi_area).features)
          .enter().append("path")
          .attr("id", function(d) { return "area" + d.properties.OBJECTID; })
            .attr("class", "area")
            .attr("d", path);

        areas_box = tbi_map.select(".areas").node().getBBox();
        tbi_map.select(".areas")
          .append("text")
          .attr("class", "tbilisi-caption")
          .text(I18n.t("georgia_capital"))
          .attr("y", areas_box.height + areas_box.y + 35);

        areas_box = tbi_map.select(".tbilisi-caption").node().getBBox();
        d3.select(".tbilisi-caption")
          .attr("x", areas_box.width / 2 + 20 );


        // bind *********************************************************
        d3.select(self.frameElement).style("height", map_h + "px");

        bind();
      }
      queue()
        .defer(d3.json, "assets/data/georgia.json")
        .defer(d3.json, "assets/data/tbilisi.json")
        .await(build_maps);
  },
  bar_chart_init = function() {


    var maxPoint = 0;

    entries.forEach(function(d) {
      var tmp = areas[d],
          hl = how_long(tmp[0]);
      tmp.push(hl[0].d);
      tmp.push(hl[1].d);
      if (maxPoint < tmp[1]) {
        maxPoint = tmp[1];
      }
      if (maxPoint < tmp[2]) {
        maxPoint = tmp[2];
      }
    });
    var y = d3.scale.linear().domain([0, maxPoint]).range([bar.h - bar.x_h, bar.caption_h + 40]);

    var entry_w = (bar.canvas.w - bar.gap) / entries.length - bar.node.horizontal_padding;

    var barGeorgia = d3.select(".bar-georgia")
                .append("svg")
                .attr("width", bar.w)
                .attr("height", bar.h);

    // contains x and y axes
    var axle = barGeorgia.append("g").attr("class", "axle");

    var xAxis = d3.svg.axis()
        .scale(d3.scale.identity().domain([0, bar.canvas.fw]))
        .ticks(0)
        .outerTickSize(0)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(d3.scale.identity().domain([0, bar.canvas.fh]))
        .ticks(0)
        .outerTickSize(0)
        .orient("left");

      axle.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (bar.canvas.fh + 1) + ")")
        .call(xAxis);
      axle.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    //
    // var svg = d3.select("body").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //





    // caption block
    // var captions = barGeorgia.append("g")
    //    .attr("class", "captions");
    // var caption = captions
    //     .append("text")
    //     .style("visibility", "hidden")
    //     .attr("class", "caption")
    //     .text(I18n.t("georgia"));
    // var caption_box = caption.node().getBBox();
    // var cap_h = caption_box.height;
    // caption.attr({"x": 5, "y": cap_h }).style("visibility", "visible");


    // caption = captions
    //     .append("text")
    //     .style("visibility", "hidden")
    //     .attr("class", "caption")
    //     .text(I18n.t("georgia_capital"));
    // caption_box = caption.node().getBBox();
    // caption.attr({"x": bar.w - (entry_w * 6 + bar.node.padding * 6), "y": cap_h }).style("visibility", "visible");

      // bars block


    var bars = barGeorgia.append("g")
      .attr("class", "bars")
      .selectAll(".bar")
      .data(entries)
      .enter().append("g")
      .attr("class", "bar")
      .attr("id", function(d){ return "bar" + d; });

    bars.append("rect")
        .attr("class", function(d) { return areas[d][1] > 15 ? "beyond l" : "l"; })
        .attr("width", entry_w)
        .attr("height", function(d) {
          return (bar.h - bar.x_h) - (areas[d][2] !== 0 ? y(areas[d][2] - areas[d][1]) : 0);
        })
        .attr("x", function(d, i) {return i * (entry_w + bar.node.horizontal_padding) + bar.gap * (d > 100 ? 1 : 0); })
        .attr("y", function(d) { return y(areas[d][2]); });

    bars.append("rect")
        .attr("class", "s")
        .style("fill", function(d) { return color_by_year(areas[d][1]); })
        .attr("width", entry_w)
        .attr("height", function(d) {
          return (bar.h - bar.x_h) - y(areas[d][1]);
        })
        .attr("x", function(d, i) { return i * (entry_w + bar.node.padding) + bar.gap * (d > 100 ? 1 : 0); })
        .attr("y", function(d) { return y(areas[d][1]); });


        // x-axis block
      // var xAxisG =  barGeorgia.append("g").attr("class", "x-axis");
      // xAxisG.append("line").attr({x1:0, y1: (bar.h - bar.x_h + 5), x2:100, y2:(bar.h - bar.x_h + 5)});
      //
      // var legend = xAxisG.selectAll("text")
      //   .data(entries)
      //   .enter().append("text")
      //   .attr("id", function(d) { return "x-axis" + d; })
      //   .text(function(d){ return I18n.t("areas-" + d); });
      //
      // legend.each(function (d, i) {
      //   var t = d3.select(this);
      //   var bbox = t.node().getBBox();
      //   t.attr("x", i * (entry_w + bar.node.padding) - (bbox.width / 2 - entry_w / 2) + bar.gap * (d > 100 ? 1 : 0) )
      //     .attr("y", (bar.h - bar.x_h) + 12 + bbox.width / 2);
      //   bbox = t.node().getBBox();
      //   t.attr("transform", "rotate(-90, " + (bbox.x + bbox.width / 2) + ", " + (bbox.y + bbox.height / 2) + ")");
      //
      // });

      // legend block

      // var tip = d3.tip()
      //   .attr("class", "tip")
      //   .offset([-10, 0])
      //   .html(function(d) {
      //     return "<span>" + I18n.t("legend-" + d) + "</span>";
      //   });
      // barGeorgia.call(tip);
      //
      // barGeorgia.append("g")
      //  .attr("class", "legend")
      //  .selectAll("rect")
      //   .data(d3.range(1, color_step + 1, 1))
      //   .enter().append("rect")
      //   .attr("x", function(d, i){ return i * 18; })
      //   .style("fill", function(d){ return colors(d); });
      //
      // barGeorgia.select(".legend").append("rect")
      //   .data("l")
      //   .attr("fill", "#56bfbf")
      //   .attr("x", function() { return color_step * 18 + 20; });
      //
      // barGeorgia.select(".legend").append("rect")
      //   .data("b")
      //   .attr("fill", "#314451")
      //   .attr("x", function() { return (color_step + 1) * 18 + 20; });
      //
      // barGeorgia.selectAll(".legend rect")
      //   .attr({"width": "13", "height": "13"})
      //   .attr("y", bar.h - 16)
      //   .on("mouseover", tip.show)
      //   .on("mouseout", tip.hide);
  },
  currency_init = function() {

    var now = new Date(Date.now());
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    d.setDate(d.getDate() - 1);

    // d3.jsonp("http://lari.jumpstart.ge/en/api/v1/nbg_rates?currency=USD&start_date=" + d.getTime() + "&end_date=" + now.getTime() + "&callback=d3.jsonp.test", function(d) {
    //
    //   if(typeof d !== "undefined" && d.hasOwnProperty("valid") && d.valid == true) {
    //     var len = d.result[0].rates.length;
    //     currency = d.result[0].rates[len-1][1]
    //   }
    //   move here below code
    // });

    for(var i = 0; i < entries.length; ++i) {
      var tmp = areas[entries[i]];
      tmp[0] = Math.round(tmp[0] * currency);
    }

    bar_chart_init();
    init_maps();

  },
  init = function() {
      loaderStartTime = (new Date()).getTime();
      resize();
      I18n.init(function(){ currency_init(); });
  };

  init();
  return obj;

})();
