var mw = (function () {

   var obj = { };
   var blinkDuration = 900;
   var animDuration = 900;
   var blinkEase = "linear";

   var w = u.width();
   var h = u.height();
   var color_by_year = 'null1';
   var colors = null;
   var color_step = 9;
   var color_range = ['#f9c235', '#ff6043'];
   var loaderStartTime = 0;
   var loaderAtLeast = 0; // milliseconds 3000
   var user = {
     m2: 45,
     income: 1000,
     savings: 25
   };
   var _data = {
     m2: [20, 35, 45, 55, 65, 100],
     income: [250, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000],
     saving: [5, 10, 15, 20, 25, 30, 40, 50],
     cities:  {

       '_65': [956, 1042], // tbilisi 65 tbilisi
       '_23': [1074,	1171], // Adjara 23 batumi
       '_9':  [591, 644], // Samegrelo-Zemo Svaneti 9 zugdidi
       '_69': [493, 537], // Mtskheta-Mtianeti 69 mtskheta
       '_75': [471, 513], // Shida Kartli 75 gori
       '_29': [456,	497], // Imereti 29 kutaisi
       '_55': [456, 497], // Samtskhe-Javakheti 55 akhaltsikhe
       '_52': [450,	491], // Kvemo Kartli 52 rustavi
       '_31': [399,	435], // Kakheti 31 telavi
       '_35': [213,	232], // Guria 35 ozurgeti
       '_14': [142, 155] // Racha-Lechkhumi and Kvemo Svaneti 14 ambrolauri
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
      prepare();
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
   var prepare = function() {
     d3.selectAll('.filters select.filter').on('change',function(d){ get_filters(); });
      georgia_map_draw();
      I18n.remap();

      // redraw();

      loader_stop();
  };
  var get_filters = function() {
    user.m2 = d3.select('.filters .filter.m2').property('value');
    user.income = d3.select('.filters .filter.income').property('value');
    user.savings = d3.select('.filters .filter.savings').property('value');
    console.log('user ------------------------- ', user);
  };
  var loader_stop = function()
  {
    if(loaderStartTime - (new Date()).getTime() > loaderAtLeast)
    {
      show();
    }
    else
    {
      setTimeout(function(){ show(); }, loaderAtLeast);
    }
  };
  var show = function()
  {
    d3.select('.wrapper').style({"visibility":"visible", "opacity": 0});
    d3.select('.loader').style("display","none");
    d3.select('.wrapper').transition().duration(1000).style('opacity',1).each("end", function(){
      // trigger_drag(1,3000);
    });
  };
  var resize = function() {
    w = u.width();
    h = u.height();
    redraw();
  };
  var redraw = function()
  {

  };


/*------------------------------------------ Georgia Map ------------------------------------------*/
  var georgia_map_draw = function() {
    var map_w = 690,
        map_h = 400,
        disabled_region = [1, 15],
        default_region = 65,
        svg = d3.select(".map .georgia")
                    .append("svg")
                    .attr("width", map_w)
                    .attr("height", map_h);

    colors = d3.scale.linear()
      .domain([1, color_step])
      .range(color_range);
    color_by_year = function(year) {
      var tmp = 1;

      if(year < 1) {
        tmp = 1;
      }
      else if(year >= 1 && year <= 2) {
        tmp = 2;
      }
      else if(year > 2 && year <= 4) {
        tmp = 3;
      }
      else if(year > 4 && year <= 6) {
        tmp = 4;
      }
      else if(year > 6 && year <= 8) {
        tmp = 5;
      }
      else if(year > 8 && year <= 10) {
        tmp = 6;
      }
      else if(year > 10 && year <= 13) {
        tmp = 7;
      }
      else if(year > 13 && year <= 15) {
        tmp = 8;
      }
      else if(year > 15) {
        tmp = 9;
      }
      return colors(tmp);
    };


    d3.json("assets/data/georgia.json", function(error, shapes) {
      if (error) throw error;

      var projection = d3.geo.mercator()
          .scale(5000)
          .translate([map_w/2,map_h/2])
          .center([43.52606083142459,42.18408590602157]);

      var path = d3.geo.path()
          .projection(projection);


      svg.append("g")
          .attr("class", "regions")
          .selectAll("path")
            .data(topojson.feature(shapes, shapes.objects.regions_so_latlong).features)
            .enter().append("path")
            .attr("id", function(d) { return 'region' + d.properties.OBJECTID; })// return quantize(rateById.get(d.id)); })
              .attr("class", function(d) {
                return (disabled_region.indexOf(d.properties.OBJECTID) >= 0 ?  '' : 'region') })// return quantize(rateById.get(d.id)); })
              .attr("d", path);

              // <g class="legend" transform="translate(-36,-44)">
              //   <rect width="18" height="18" style="fill: rgb(57, 59, 121); stroke: rgb(57, 59, 121);"></rect>
              //   <text x="22" y="14">Abulia</text>
              // </g>


      svg.append("g")
         .attr("class", "legend")
          .selectAll("rect")
            .data(d3.range(1,color_step+1,1))
            .enter().append("rect")
            .attr({'width':'10', 'height':'10'})
            .attr("x", function(d, i){ return i * 14 + 30;})
            .attr("y", map_h - 20 )
            .attr('data-tip', 'blah blah')
            .style('fill', function(d){ return colors(d); });
            // .attr("id", function(d) { return 'region' + d.properties.OBJECTID; })// return quantize(rateById.get(d.id)); })
            //   .attr("class", function(d) {
            //     return (disabled_region.indexOf(d.properties.OBJECTID) >= 0 ?  '' : 'region') })// return quantize(rateById.get(d.id)); })
            //   .attr("d", path);
//       svg.append("path")
// .datum(topojson.feature(shapes, shapes.objects.cities))
// .attr("d", path)
// .attr("class", "place");
//
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

      // binding map
      d3.selectAll('.map .georgia .region').on('click', function(d){
        d3.selectAll('.map .georgia .region.active').classed('active',false);
        var t = d3.select(this).classed('active', true);
        sort_regions(t.data()[0].properties);
      });

      d3.selectAll('.map .georgia .region').on('mouseover', function(d) { sort_regions(d.properties); });
      d3.selectAll('.map .georgia .region').on('mouseout', function() {
        sort_regions(d3.select('.map .georgia path.active').data()[0].properties);
      });

      d3.selectAll(".map .georgia path#region" + default_region).each(function(d, i) {
          d3.select(this).on("click").apply(this, [d, i]);
      });
      
      tooltip();
    });
    function output(current)
    {
      var city_id = current.OBJECTID;

      var d = _data.cities['_' + city_id];
      var month_amount = d[0];
      var month_amount_with_loan = d[1];

      var out = d3.select('.output');
      var years = Math.round(((user.m2 * month_amount)/( user.income*user.savings/100))/12);
      var saving_per_month = user.income*user.savings/100;

      out.select('.city').text(I18n.t('data-I18n-cities-_'+ city_id));

      out.select('.via-saving .amount').text(user.m2 * month_amount);
      out.select('.via-saving .years').text(years);
      out.select('.via-loan .amount').text(user.m2 * month_amount_with_loan);
      out.select('.via-loan .years').text(Math.round(((user.m2 * month_amount_with_loan)/( saving_per_month))/12));

      d3.selectAll('.map .georgia .region').each(function(d){
        var tmp_id = d.properties.OBJECTID;
        var col = color_by_year(Math.round(((user.m2 * _data.cities['_' + tmp_id][0])/(saving_per_month))/12));
        d3.select(this).style('fill', col);
      });
    }
    function sort_regions(current) {
      var top_id = current.OBJECTID;
      var active_id = d3.select('.map .georgia path.active').data()[0].properties.OBJECTID;
      svg.selectAll(".map .georgia .region").sort(function (a, b) {
        if (a.properties.OBJECTID == top_id) return 1;
        else if (a.properties.OBJECTID == active_id) return 2;
        else return -1;
      });
      output(current);
    }
  };
  var tooltip = function() {
    var moveEvent = "mouseover";
     var outEvent = "mouseout";
     console.log('tooltip');
      d3.selectAll('[data-tip]').on(moveEvent, function(d){
        console.log('tooltip hover');
        console.log('hey', d3.select(this).attr('data-tip'));
        //console.log('a',d);
    //      var t = d3.select(this);
    //      var tip_id = t.attr('data-tip');
    //      var par = d3.select('[data-tip-id='+tip_id+']');
    //      var tip = d3.select('#tip');
    //      var klass="";
    //      if(d.hasOwnProperty('class'))
    //      {
    //        klass = " " + d.class;
    //      }
    //      var html =  '<div>' +
    //                     '<div class="country'+klass+'">' + I18n.t('charts-bar_chart-' + d.k) + '</div>' +
    //                     '<div class="region">' + I18n.t('charts-bar_chart-' + d.region) + '</div>' +
    //                     '<div class="rate"><div class="label">' + I18n.t('charts-bar_chart-rate') + "&nbsp;</div>" + d.rate + '</div>' +
    //                     '<div class="gender-gap"><div class="label">' + I18n.t('charts-bar_chart-gender_gap') + "&nbsp;</div>" + d.population_p.toLocaleString() + '%</div>' +
    //                     '<div class="missing'+klass+'">' + I18n.t('charts-bar_chart-missing_woman') + '</div>' +
    //                     '<div class="gap'+klass+'">' + d.population_t.toLocaleString() + '</div>' +
    //                     '<div class="period">(' + d.period + ')</div>' +
    //                  '</div>';
    //      var content = tip.select('.data').html(html);
    //      var tiph = tip[0][0].clientHeight;
    //      var tipw = tip[0][0].clientWidth;
    //       var top = 0;
    //       if(d3.event.pageY - tiph < window.scrollY) // under
    //       {
    //         top =  d3.event.pageY + 20;
    //         tip.select('.pointer-top').style('display','block');
    //         tip.select('.pointer-bottom').style('display','none');
    //       }
    //       else // above
    //       {
    //          top =  d3.event.pageY - tiph - 5;
    //         tip.select('.pointer-top').style('display','none');
    //         tip.select('.pointer-bottom').style('display','block');
    //       }
    //      tip.style({top: top + "px", left: d3.event.pageX -tipw/2 + "px"}).transition().duration(100).style('opacity',1);
    //      d3.event.preventDefault();
    //   });
    //  indexes.selectAll('[data-tip]').on(outEvent, function(){
    //    d3.select('#tip').style({'opacity':0, 'left': '-999999px' });
    //    d3.event.preventDefault();
     });
  }
  function randomEven(min,max) { return 2*(rand(min,max)%(Math.floor(max/2)) + 1); }
  function rand(min,max) { return Math.floor(Math.random()*(max-min+1)+min); }
  function scrollTopTween(scrollTop) {
    return function() {
    var i = d3.interpolateNumber(this.scrollTop, scrollTop);
    return function(t) { this.scrollTop = i(t); };
     };
  }
  init();
  return obj;

})();
