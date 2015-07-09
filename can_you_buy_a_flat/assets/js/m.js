/*global document, window, d3, topojson, u, I18n, queue, noUiSlider, self, setTimeout*/
/*eslint camelcase: 0*/
(function () {
  "use strict";
  var obj = { },
  inited = false,
  w = u.width(),
  h = u.height(),
  bar = {
    svg:null,
    svg_g:null,
    w:  w < 1100 ? w - 40 : 340,
    h: 340,
    gap: 50, // space betweet georgia and tbilisi bar chart
    x_h: 140,
    y_w: 40,
    caption_h: 30,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      w:0,
      h:0
    },
    canvas: {
      w: 0,
      fw: 0, // full width
      h: 0,
      fh:0, // full height with margins
      margin: [10, 10, 10, 10],
      x: 0,
      y: 0,
      x1:0,
      y1:0
    },
    node: {
      padding: [0, 2, 0, 0],
      horizontal_padding: 0,
      vertical_padding: 0
    },
    legend_h: 20,
    calc: function() {
      var t = this;
      // t.w = w < 340 ? w - 40 - 20 : 340;
      t.canvas.w = t.w - (t.y_w + t.canvas.margin[3] + t.canvas.margin[1]);
      t.canvas.h = t.h - (t.canvas.margin[0] + t.canvas.margin[2] + t.x_h + t.caption_h + t.legend_h);
      t.canvas.fw = t.w - (t.y_w );
      t.canvas.fh = t.h - (t.x_h + t.caption_h + t.legend_h);
      t.canvas.x = t.y_w + t.canvas.margin[3];
      t.canvas.y = t.canvas.margin[0];
      t.canvas.x1 = t.canvas.x + t.canvas.w;
      t.canvas.y1 = t.canvas.y + t.canvas.h;
      t.node.horizontal_padding = t.node.padding[1] + t.node.padding[3];
      t.node.vertical_padding = t.node.padding[0] + t.node.padding[2];
      t.margin.w = t.margin.left + t.margin.right;
      t.margin.h = t.margin.top + t.margin.bottom;

    }
  },
  map = {
    geo: {
      svg: null,
      proj: null,
      w: 0,
      h: 310,
      center: [42.35, 42.35],
      center_small: [43.5, 42.35],
      scaler:  d3.scale.linear().domain([760, 1100]).range([4500, 6600]),
      scaler_h: d3.scale.linear().domain([760, 1100]).range([320, 480])

    },
    tbi: {
      svg: null,
      proj: null,
      w: 0,
      h: 0,
      center: [44.81, 41.73],
      scaler:  d3.scale.linear().domain([760, 1100]).range([23500, 33000]),
      scaler_w: d3.scale.linear().domain([760, 1100]).range([190, 280]),
      scaler_h: d3.scale.linear().domain([760, 1100]).range([170, 220])
    }
  },
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
   "23": [958.18, 0, 0],    // Adjara 23 batumi
   "65": [928.8, 0, 0],     // tbilisi 65 tbilisi
   "69": [668.93, 0, 0],    // Mtskheta-Mtianeti 69 mtskheta
   "9": [587.19, 0, 0],     // Samegrelo-Zemo Svaneti 9 zugdidi
   "55": [566.63, 0, 0],    // Samtskhe-Javakheti 55 akhaltsikhe
   "29": [465.01, 0, 0],    // Imereti 29 kutaisi
   "75": [450.67, 0, 0],    // Shida Kartli 75 gori
   "52": [427.17, 0, 0],    // Kvemo Kartli 52 rustavi
   "14": [250, 0, 0],       // Racha-Lechkhumi and Kvemo Svaneti 14 ambrolauri
   "31": [244.69, 0, 0],    // Kakheti 31 telavi
   "35": [199, 0, 0],       // Guria 35 ozurgeti
   "1": [0, 0, 0],          // სოხუმი
   "15": [0, 0, 0],         // ცხინვალი
   "206": [1136.41, 0, 0],  // ძველი თბილისი
   "203": [970.71, 0, 0],   // ვაკე-საბურთალო
   "204": [833.68, 0, 0],   // დიდუბე-ჩუღურეთი
   "205": [751.16, 0, 0],   // დიდგორი
   "201": [715.58, 0, 0],   // ისანი-სამგორი
   "202": [637.69, 0, 0]    // გლდანი-ნაძალადევი
  },
  geoAreas = [23, 65, 69, 9, 55, 29, 75, 52, 14, 31, 35], // sorted desc
  tbiAreas = [206, 203, 204, 205, 201, 202], // sorted desc
  entries = tbiAreas.concat(geoAreas),
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
    w = u.width();
    h = u.height();

    map.geo.w = w < 1100 ? w - 40 : 760;

    map.geo.h = map.geo.scaler_h(map.geo.w);

    map.tbi.w = map.geo.w < 768 ? 280 : map.tbi.scaler_w(map.geo.w);
    map.tbi.h = map.geo.w < 768 ? 220 : map.tbi.scaler_h(map.geo.w);;

    bar.w = w < 1100 ? w - 40 : 340;
    var padding = d3.scale.linear().domain([340, 1100]).range([2, 20]);
    bar.node.padding = [0, padding(bar.w), 0, 0];
    bar.calc();

    if(inited) {
      draw_bar();
      draw_map();
    }

    },
  render = function(current_id, sort, hover) {

    // make active and hover states for map and for bar chart
    var maps = d3.select(".map");
    var barGeorgia_legend = d3.select(".bar-georgia .x-axis .labels");

    maps.selectAll(".area.hover").classed("hover", false);
    bar.svg.selectAll(".bar.hover").classed("hover", false);
    barGeorgia_legend.selectAll("text.hover").classed("hover", false);
    if(!hover) {
     maps.selectAll(".area.active").classed("active", false);
     maps.select("#area" + current_id).classed("active", true);
     bar.svg.selectAll(".bar.active").classed("active", false);
     bar.svg.select("#bar" + current_id).classed("active", true);
     barGeorgia_legend.selectAll("text.active").classed("active", false);
     barGeorgia_legend.select("#label" + current_id).classed("active", true);

    }
    else {
     maps.select("#area" + current_id).classed("hover", true);
     bar.svg.select("#bar" + current_id).classed("hover", true);
     barGeorgia_legend.select("#label" + current_id).classed("hover", true);
    }

    if(sort)
    {
     var active_id = d3.select(".map path.active").data()[0].properties.OBJECTID;
     var tmp = map.geo.svg;
     if(+current_id > 100)
     {
       tmp = map.tbi.svg;
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
    var saving = out.select(".via-saving");
    saving.select(".amount").text(u.zero(u.reformat(amount1, 0))).classed("symbol", hl[0].d !== 0);
    saving.select(".years").text(u.zero(hl[0].t[0])).style("color", current_color);
    saving.select(".months").text(u.zero(hl[0].t[1])).style("color", current_color);
    if(!hover) {
      d3.select(".addthis_sharing_toolbox.my").attr("data-url", I18n.t("share_url") + "m=" + hl[0].m + "sqm=" + user.m2 + "area=" + current_id);
    }
    var loan = out.select(".via-loan");
    var amount2 = hl[1].m * user.savings;
    loan.select(".amount-box .amount").text(u.zero(u.reformat(amount2, 0))).classed("symbol", hl[1].d !== 0);
    loan.select(".diff-box .amount").text(u.zero(u.reformat(amount2 - amount1, 0))).classed("symbol", hl[1].d !== 0);
    loan.select(".years").text(u.zero(hl[1].t[0]));
    loan.select(".months").text(u.zero(hl[1].t[1]));
    loan.classed("hide1 hide2 hide3", false);
    saving.classed("hide3", false);
    var state = 0;
    var state_class = "";
    if(disabled_area.indexOf(current_id) !== -1) {
        state = 3;
        state_class = "hide3";
        saving.classed("hide3", true);
    }
    else if(hl[1].m === 0) {
      state = 2;
      state_class = "hide2";
    }
    else if(hl[1].m > 180) {
      state = 1;
      state_class = "hide1";
    }
    saving.selectAll(".first").each(function(){
        var t = d3.select(this);
        t.html(state !== 3 ? t.attr("data-state-0") : ("<br />" + t.attr("data-state-3")));
    });

    loan.selectAll("[data-state-" + state + "]").each(function(){
        var t = d3.select(this);
        t.html(t.attr("data-state-" + state));
    });
    loan.classed(state_class, true);
    loan.select(".bank").classed("bank0 bank1 bank2 bank3", false).classed("bank" + state, true);

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
      inited = true;
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
  areas_year_calc = function() {
    var max = 0;
    entries.forEach(function(d){
      var tmp = areas[d],
          hl = how_long(tmp[0]);
      tmp[1] = hl[0].d;
      tmp[2] = hl[1].d;
      if (max < tmp[1]) {
        max = tmp[1];
      }
      if (max < tmp[2]) {
        max = tmp[2];
      }
    });
    return Math.ceil(max) + 3;
  },
  draw_map = function() {

    // drawing georgia map
    map.geo.svg
      .attr("width", map.geo.w)
      .attr("height", map.geo.h);

    map.geo.proj = d3.geo.mercator()
        .scale(map.geo.scaler(map.geo.w))
        .translate([map.geo.w / 2, (map.geo.h-20) / 2])
        .center(map.geo.w < 768 ? map.geo.center_small : map.geo.center);

    var path = d3.geo.path()
        .projection(map.geo.proj);

    map.geo.svg.selectAll('.area').attr('d', path);
    map.geo.svg.select('.place').attr('d', path);

    var cap = map.geo.svg.select(".georgia-caption");
    var cap_box = cap.node().getBBox();
    cap
      .attr("x", (map.geo.w - cap_box.width) / 2)
      .attr("y", map.geo.h - 5);

    // drawing tbilisi map
    map.tbi.svg
      .attr("width", map.tbi.w)
      .attr("height", map.tbi.h);

    map.tbi.proj = d3.geo.mercator()
        .scale(map.geo.w < 768 ? 33000 : map.tbi.scaler(map.geo.w))
        .translate([map.tbi.w / 2, (map.tbi.h) / 2])
        .center(map.tbi.center);

    var path = d3.geo.path()
        .projection(map.tbi.proj);

    map.tbi.svg.selectAll('.area').attr('d', path);

    var cap = map.tbi.svg.select(".tbilisi-caption");
    var cap_box = cap.node().getBBox();
    cap
      .attr("x", (map.tbi.w - cap_box.width) / 2)
      .attr("y", map.tbi.h - 5);

  },
  draw_bar = function() {
    bar.svg.attr("width", bar.w)
      .attr("height", bar.h);
    var maxPoint = areas_year_calc();
    var y = d3.scale.linear().domain([0, maxPoint]).range([bar.canvas.h, 0]);
    var entry_w = (bar.canvas.w - bar.gap) / entries.length - bar.node.horizontal_padding;
    var label1 = bar.svg.select('.y-axis .label1').text(maxPoint);
    label1.each(function (d, i) {
      var t = d3.select(this),
          bbox = t.node().getBBox();
      t.attr("x", bar.y_w - bbox.width - 10);
    });

    var axle = bar.svg.select(".axle");

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
    axle.select(".x-axis")
      .attr("transform", "translate(" + bar.y_w + "," + (bar.canvas.fh) + ")")
      .call(xAxis);
      axle.select(".y-axis")
      .attr("transform", "translate(" + bar.y_w + ", 0)")
      .call(yAxis);

      var xLabels = axle
        .select('.x-axis .labels')
          .attr("transform", "translate(" + bar.canvas.margin[3] + "," + 10 + ")").selectAll('text');

      xLabels.each(function (d, i) {
        var t = d3.select(this),
            bbox = t.node().getBBox();

        t.attr("x", i * (entry_w + bar.node.horizontal_padding) - (bbox.width / 2 - entry_w / 2) + bar.gap * (d < 100 ? 1 : 0) )
          .attr("y", bbox.width / 2);
        bbox = t.node().getBBox();
         t.attr("transform", "rotate(-90, " + (bbox.x + bbox.width / 2) + ", " + (bbox.y + bbox.height / 2) + ")");
      });

      // bars block

    var bars = bar.svg.select(".bars")
      .attr("transform", "translate(" + bar.canvas.x + "," + bar.canvas.y + ")");
      //.selectAll(".bar");


    bars.selectAll('.bars .bar rect.l').each(function(dd,i){
      d3.select(this)
      .attr("class", function(d) { return areas[d][2] == 0 ? "reachless l" : (areas[d][2] > 15 ? "beyond l" : "l"); })
      .attr("width", entry_w)
      .attr("height", function(d) {
        return bar.canvas.h - (areas[d][2] !== 0 ? y(areas[d][2] - areas[d][1]) : y(maxPoint - areas[d][1]));
      })
      .attr("x", function(d) { return i * (entry_w + bar.node.horizontal_padding) + bar.gap * (d < 100 ? 1 : 0); })
      .attr("y", function(d) { return (areas[d][2] !== 0 ? y(areas[d][2]) : 0); });
    });
    bars.selectAll('.bars .bar rect.s').each(function(dd,i){
      d3.select(this)
        .attr("class", "s")
        .style("fill", function(d) { return color_by_year(areas[d][1]); })
        .attr("width", entry_w)
        .attr("height", function(d) {
          return bar.canvas.h - y(areas[d][1]);
        })
        .attr("x", function(d) { return i * (entry_w + bar.node.horizontal_padding) + bar.gap * (d < 100 ? 1 : 0); })
        .attr("y", function(d) { return  y(areas[d][1]); });
      });


       var caption = bar.svg.select('.captions .caption.geo');

      var caption_box = caption.node().getBBox();
      var cap_h = caption_box.height;

      caption.attr({"x": bar.canvas.x1 - ((entry_w + bar.node.horizontal_padding) * geoAreas.length)+(((entry_w + bar.node.horizontal_padding) *       geoAreas.length)-caption_box.width)/2, y: (bar.caption_h - caption_box.height)/2  });

      caption = bar.svg.select('.captions .tbi');
      caption_box = caption.node().getBBox();
      caption.attr({"x": bar.canvas.x + (((entry_w + bar.node.horizontal_padding) * tbiAreas.length)-caption_box.width)/2, y: (bar.caption_h - caption_box.height)/2 });


      // legend block


      bar.svg.select(".legend")
       .attr("class", "legend")
       .attr("transform", "translate(" + (bar.w - ((color_step + 3) * 18 + 20)) + ", 0)");

  },
  filter = function() {
    render(d3.select(".map .georgia path.active").data()[0].properties.OBJECTID, false, false);
    draw_bar();
  },
  bind = function() {
    d3.select(window).on("resize", resize);

    d3.selectAll(".map .area:not(.disabled)").on("click", function(){
      render(d3.select(this).data()[0].properties.OBJECTID, true, false);
    });


    d3.selectAll(".bar-georgia .bar, .bar-georgia .x-axis .labels text").on("click", function(d){
      render(d, true, false);
    });

    d3.selectAll(".map .area").on("mouseover", function(d) {
      render(d.properties.OBJECTID, true, true);
    });

    d3.selectAll(".bar-georgia .bar, .bar-georgia .x-axis .labels text").on("mouseover", function(d){
      render(d, true, true);
    });

    d3.selectAll(".map .area").on("mouseout", function() {
      render(d3.select(".map path.active").data()[0].properties.OBJECTID, true, false);
    });

    d3.selectAll(".bar-georgia .bar, .bar-georgia .x-axis .labels text").on("mouseout", function(){
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
      var popup = d3.select(".popup"),
          content = popup.select(".window .content"),
          open = popup.classed("open");

      content.style({ "width": (w > 670 ? 670 : w-20) + "px",
                      "height": (h > 760 ? 760-200 : h-200-20) + "px" });
      d3.select('body').classed('noscroll', !open);
      popup.classed("open", !open);
    });
    d3.select("body").on("keydown", function() {
      if(d3.event.keyCode === 27) {
        d3.select(".popup").classed("open", false);
        //d3.selectAll(".dropdown.open").classed("open", false);
      }
    });
    d3.select(".poster .switch").on("click", function() {
      var t = d3.select(this),
        p = d3.select(this.parentNode);
      t.classed("play", !t.classed("play"));
      p.classed("paused", !p.classed("paused"));

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
        density: 100,
        format: {
          to: function ( value ) {
    		      return u.reformat(value,0);
	        },
  	      from: function ( value ) {
  		      return value.replace(',', '');
    	    }
        }
      }
    });
    var savingsSliderValue = document.getElementById("savings_slider_value");
    savingsSlider.noUiSlider.on("update", function( values, handle ) {
      var tmp = Math.round(values[handle]);
      user.savings = tmp;
      savingsSliderValue.innerHTML = u.reformat(tmp, 0) + "&#8382;"; filter(); });


    loader_stop();
  },
  init_map = function() {

      map.geo.svg = d3.select(".map .georgia")
                  .append("svg")
                  .attr("width", map.geo.w)
                  .attr("height", map.geo.h);

      map.tbi.svg = d3.select(".map .tbilisi")
                  .append("svg")
                  .attr("width", map.tbi.w)
                  .attr("height", map.tbi.h);

      function build_maps(error, geo_areas, tbilisi_areas) {
        if (error) { throw error; }

        map.geo.proj = d3.geo.mercator()
            .scale(map.geo.scaler(map.geo.w))
            .translate([map.geo.w / 2, (map.geo.h-20) / 2])
            .center(map.geo.center);

        var path = d3.geo.path()
            .projection(map.geo.proj);

        map.geo.svg
        .attr("class", "areas")
        .selectAll("path")
          .data(topojson.feature(geo_areas, geo_areas.objects.regions).features)
          .enter().append("path")
          .attr("id", function(d) { return "area" + d.properties.OBJECTID; })
            .attr("class", function(d) {
              return (disabled_area.indexOf(d.properties.OBJECTID) >= 0 ? "area disabled" : "area"); })
            .attr("d", path);

        var cap = map.geo.svg
          .append("text")
          .attr("class", "georgia-caption")
          .text(I18n.t("georgia")),
        cap_box = cap.node().getBBox();
        cap
          .attr("x", (map.geo.w + cap_box.width) / 2)
          .attr("y", map.geo.h - 5);


        map.geo.svg.append("path")
          .datum(topojson.feature(geo_areas, geo_areas.objects.cities))
          .attr("d", path)
          .attr("class", "place");

        // tbilisi map *********************************************************

        map.tbi.proj = d3.geo.mercator()
          .scale(map.tbi.scaler(map.geo.w))
          .translate([map.tbi.w / 2, (map.tbi.h) / 2])
          .center(map.tbi.center);
        path = d3.geo.path()
          .projection(map.tbi.proj);

        map.tbi.svg
        .attr("class", "areas")
        .selectAll("path")
          .data(topojson.feature(tbilisi_areas, tbilisi_areas.objects.tbilisi_area).features)
          .enter().append("path")
          .attr("id", function(d) { return "area" + d.properties.OBJECTID; })
            .attr("class", "area")
            .attr("d", path);



        var cap = map.tbi.svg
          .append("text")
          .attr("class", "tbilisi-caption")
          .text(I18n.t("georgia_capital"))
        cap_box = cap.node().getBBox();
        cap
          .attr("x", (map.tbi.w - cap_box.width) / 2)
          .attr("y", map.tbi.h - 5);

        // bind *********************************************************
        d3.select(self.frameElement).style("height", map.geo.h + "px");

        bind();
      }
      queue()
        .defer(d3.json, "../assets/data/georgia.json")
        .defer(d3.json, "../assets/data/tbilisi.json")
        .await(build_maps);
  },
  init_bar = function() {
    var maxPoint = areas_year_calc();;

    var y = d3.scale.linear().domain([0, maxPoint]).range([bar.canvas.h, 0]); //bar.caption_h + 40
    var entry_w = (bar.canvas.w - bar.gap) / entries.length - bar.node.horizontal_padding;
    bar.svg = d3.select(".bar-georgia")
                .append("svg")
                .attr("width", bar.w)
                .attr("height", bar.h);
                bar.svg_g = bar.svg.append("g");

    // contains x and y axes
    var axle = bar.svg_g.append("g").attr("class", "axle");

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
      .attr("class", "x-axis")
      .attr("transform", "translate(" + bar.y_w + "," + (bar.canvas.fh) + ")")
      .call(xAxis);
    axle.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + bar.y_w + ", 0)")
      .call(yAxis);




      // bars block

    var bars = bar.svg_g.append("g")
      .attr("class", "bars")
      .attr("transform", "translate(" + bar.canvas.x + "," + bar.canvas.y + ")")
      .selectAll(".bar")
      .data(entries)
      .enter().append("g")
      .attr("class", "bar")
      .attr("id", function(d){ return "bar" + d; });

    bars.append("rect")
        .attr("class", function(d) { return areas[d][2] == 0 ? "reachless l" : (areas[d][2] > 15 ? "beyond l" : "l"); })
        .attr("width", entry_w)
        .attr("height", function(d) {
          return bar.canvas.h - (areas[d][2] !== 0 ? y(areas[d][2] - areas[d][1]) : y(maxPoint - areas[d][1]));
        })
        .attr("x", function(d, i) { return i * (entry_w + bar.node.horizontal_padding) + bar.gap * (d < 100 ? 1 : 0); })
        .attr("y", function(d) { return (areas[d][2] !== 0 ? y(areas[d][2]) : 0); });

    bars.append("rect")
        .attr("class", "s")
        .style("fill", function(d) { return color_by_year(areas[d][1]); })
        .attr("width", entry_w)
        .attr("height", function(d) {
          return bar.canvas.h - y(areas[d][1]);
        })
        .attr("x", function(d, i) { return i * (entry_w + bar.node.horizontal_padding) + bar.gap * (d < 100 ? 1 : 0); })
        .attr("y", function(d) { return  y(areas[d][1]); });


        // x-axis labels block

      var xLabels = axle
        .select('.x-axis')
          .append('g')
          .attr("class", "labels")
          .attr("transform", "translate(" + bar.canvas.margin[3] + "," + 10 + ")")
            .selectAll("text")
            .data(entries)
            .enter()
            .append("text")
            // .attr("class", "label")
            .attr("id", function(d) { return "label" + d; })
            .text(function(d){ return I18n.t("areas-" + d); });

      xLabels.each(function (d, i) {
        var t = d3.select(this),
            bbox = t.node().getBBox();

        t.attr("x", i * (entry_w + bar.node.horizontal_padding) - (bbox.width / 2 - entry_w / 2) + bar.gap * (d < 100 ? 1 : 0) )
          .attr("y", bbox.width / 2);
        bbox = t.node().getBBox();
         t.attr("transform", "rotate(-90, " + (bbox.x + bbox.width / 2) + ", " + (bbox.y + bbox.height / 2) + ")");
      });

      // y-axis labels block
      var yLabels = axle
        .select('.y-axis')
          .append('g')
          .attr("class", "labels")
          .attr("transform", "translate(" + -1*bar.y_w + ", 0)")
            .selectAll("text")
            .data([0, maxPoint])
            .enter()
            .append("text")
            .attr('class', function(d,i) { return "label" + i; })
            .text(function(d){ return d; });
      var len = yLabels[0].length;

      yLabels.each(function (d, i) {
        var t = d3.select(this),
            bbox = t.node().getBBox();

        t.attr("x", bar.y_w - bbox.width - 10)//i * (entry_w + bar.node.horizontal_padding) - (bbox.width / 2 - entry_w / 2) + bar.gap * (d > 100 ? 1 : 0) )
          .attr("y", bar.canvas.fh - ((bar.canvas.fh / (len - 1)) * i) + (i==0 ? 0 : 1)*bbox.height);
      });




      //  caption block
      var captions = bar.svg_g.append("g")
         .attr("class", "captions")
         .attr("transform", "translate(0," + (bar.canvas.fh + bar.x_h ) + ")");
      var caption = captions
          .append("text")
          .style("visibility", "hidden")
          .attr("class", "caption geo")
          .text(I18n.t("georgia"));

      var caption_box = caption.node().getBBox();
      var cap_h = caption_box.height;
      //console.log(bar.canvas.x1 );
      caption.attr({"x": bar.canvas.x1 - ((entry_w + bar.node.horizontal_padding) * geoAreas.length)+(((entry_w + bar.node.horizontal_padding) * geoAreas.length)-caption_box.width)/2, y: (bar.caption_h - caption_box.height)/2  }).style("visibility", "visible");


      caption = captions
          .append("text")
          .style("visibility", "hidden")
          .attr("class", "caption tbi")
          .text(I18n.t("georgia_capital"));
      caption_box = caption.node().getBBox();
      caption.attr({"x": bar.canvas.x + (((entry_w + bar.node.horizontal_padding) * tbiAreas.length)-caption_box.width)/2, y: (bar.caption_h - caption_box.height)/2  }).style("visibility", "visible");



      // legend block

      var tip = d3.tip()
        .attr("class", "tip")
        .offset([-10, 0])
        .html(function(d) {
          return "<span>" + I18n.t("legend-" + d) + "</span>";
        });
      bar.svg_g.call(tip);

      bar.svg_g.append("g")
       .attr("class", "legend")
       .attr("transform", "translate(" + (bar.w - ((color_step + 3) * 18 + 20)) + ", 0)")
       .selectAll("rect")
        .data(d3.range(1, color_step + 1, 1))
        .enter().append("rect")
        .attr("x", function(d, i){ return i * 18; })
        .style("fill", function(d){ return colors(d); });



      bar.svg_g.select(".legend").append("rect")
        .data("l")
        .attr("fill", "#56bfbf")
        .attr("x", function() { return (color_step) * 18 + 20; });

      bar.svg_g.select(".legend").append("rect")
        .data("b")
        .attr("fill", "#314451")
        .attr("x", function() { return (color_step + 1) * 18 + 20; });

        bar.svg_g.select(".legend").append("rect")
          .data("r")
          .attr("fill", "#e6e7e8")
          .attr("x", function() { return (color_step + 2) * 18 + 20; });

      bar.svg_g.selectAll(".legend rect")
        .attr({"width": "13", "height": "13"})
        .attr("y", bar.h - 16)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

  },
  init_currency = function() {

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

    init_bar();
    init_map();

  },
  init = function() {
      loaderStartTime = (new Date()).getTime();
      if(bowser.chrome) {
        document.body.className = "render";
      }
      resize();
      I18n.init(function(){ init_currency(); });
  };

  init();
  return obj;

})();
