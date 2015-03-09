var mw = (function () {

   var obj = { };
   var blinkDuration = 900;
   var animDuration = 900;
   var blinkEase = "linear";
   var gridMargin = 10;
   var gridItemMarginH = 5;
   var gridItemMarginV = 3;
   var w = u.width();
   var h = u.height();
   var hw = 52;
   var hh = 113;
   var hp = hh/hw;
   var grid = null;
   var content = null;
   var perRowCount = 39;
   var manCount = 100;
   var womanCount = 95;
   var humansCount = manCount + womanCount;
   var womanHighlited = 7;
   var dragpointWidth = 37;
   var dragpointHalfWidth = dragpointWidth/2;
   var marksWidth = 0;
   var dots = null; 
   var loaderStartTime = 0; 
   var loaderAtLeast = 0; // milliseconds 3000
   var bar_chart = 
   {
      data: [
        {k:"china",v:118, rate: 117.8, region: "esa", period:"2011", population_p: 14.2, population_t: 23687000, population:1357 },
        {k:"azerbaijan",v:117,class:"highlight", rate: 116.5, region: "sc", period:"2011", population_p: 7.8, population_t: 104000, population:10},        
        {k:"armenia",v:115,class:"highlight", rate: 114.5, region: "sc", period:"2011", population_p: 7.4, population_t: 31000, population:3},
        {k:"georgia",v:114,class:"highlight", rate: 113.6, region: "sc", period:"2009-2011", population_p: 3.8, population_t: 19000, population:4.5},
        {k:"albania",v:112, rate: 111.7, region: "se", period:"2008-2010", population_p: 3.1, population_t: 15000, population:2.8},
        {k:"vietnam",v:111, rate: 111.2, region: "esa", period:"2010", population_p: 1.7, population_t: 245000, population:9},
        {k:"india",v:111, rate: 110.5, region: "sa", period:"2008-2010", population_p: 5.6, population_t: 13197000, population:1252},
        {k:"pakistan",v:110, rate: 109.9, region: "sa", period:"2007", population_p: 0.7, population_t: 281000, population:182},
        {k:"montenegro",v:110, rate: 109.8, region: "se", period:"2009-2011", population_p: 2.7, population_t: 2000, population:0.6},
        {k:"singapore",v:108, rate: 107.5, region: "esa", period:"2009", population_p: 1.9, population_t: 11000, population:5.4},
        {k:"south_korea",v:107, rate: 106.7, region: "esa", period:"2010", population_p: 4.8, population_t: 260000, population:50}
      ],


      s: null, // selector
      base: 105,
      base_max: 118,
      height_multiplier: 2
   };        
   var init = function()
   {
      loaderStartTime = (new Date()).getTime();
      blink();
      d3.select(window).on('resize', resize);  
      I18n.init(function(){ init_continue(); });      
   };
   var init_continue = function()
   {
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
   var prepare = function()
   {    
      content = d3.select('.content');
      grid = content.select('.grid .people');

      var womenToSelect = {};
      var womenToSelectCount = 0;
      var tmp = 0;
      while(womenToSelectCount < womanHighlited)
      {
         tmp = rand(1,womanCount);
         if(!womenToSelect.hasOwnProperty(tmp))
         {
            womenToSelect[tmp] = true;
            ++womenToSelectCount;
         }
      }
      var tmpManCount = manCount;
      var tmpWomanCount = womanCount;
      var womanCounter = 0;

   
      grid.selectAll('div').data(d3.range(1,humansCount+1,1))
        .enter().append("div")
        .attr("class", function(d)
         { 
            // tmp if true then man else woman
            if(rand(0,1) == 1)
            {
               if(tmpManCount!=0) { tmp = true; }
               else if(tmpWomanCount !=0) { tmp = false; }
            }
            else
            { 
               if(tmpWomanCount != 0) { tmp = false; }
               else if(tmpManCount!=0) { tmp = true; }
            }
            if(tmp)
            { 
               --tmpManCount 
            } 
            else 
            { 
               --tmpWomanCount; 
               ++womanCounter;
            }
            return "human" + (tmp ? " man" : " woman")+ (!tmp ? (womenToSelect.hasOwnProperty(womanCounter) ? " muted" : "") : ""); 
         });  
      // binding events 

      var drag = d3.behavior.drag()       
        .on("drag", ondrag)
        .on("dragend", ondragend);
      d3.select('.dragpoint').call(drag);

      d3.selectAll('.marks .mark .label, .marks .mark .dot').on('click',function(){
        var tmp = +d3.select(this).attr('data-id');
        trigger_drag(tmp);
      });
      d3.selectAll('.question .button').on('click',function(){
          d3.select("body").transition().duration(2000)
          .tween("scrollDown", scrollTopTween(d3.select('.charts')[0][0].offsetTop));         
      });
      d3.selectAll('.question2 .button').on('click',function(){
          d3.select("body").transition().duration(2000)
          .tween("scrollTop", scrollTopTween(0)).each("end", function(){
            trigger_drag(2,3000);
          });     
      });
      var enterEvent = "mouseenter";
      var leaveEvent = "mouseleave";

      if(document.hasOwnProperty('ontouchstart')){
        enterEvent = "touchstart";
        leaveEvent = "touchend";
      }
     d3.selectAll('.explanation .cell').on(enterEvent, function(){
          var t = d3.select(this);
          t.select('.image .img').transition().duration(500).style("opacity",0).each("end", function(){
            t.select('.image .text').style('z-index','5');
          });
        d3.event.preventDefault();
      });

      d3.selectAll('.explanation .cell').on(leaveEvent, function(){
        var t = d3.select(this);
        t.select('.image .text').style('z-index','3');
        t.select('.image .img').transition().duration(400).style("opacity",1);
        d3.event.preventDefault();
      });
      
      bar_chart_draw();
      line_chart_draw();  

      I18n.remap();

      marksWidth = d3.select('.timeline .marks')[0][0].clientWidth;
      dots = [0,marksWidth/2,marksWidth];

      redraw();

      loader_stop();
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
    d3.select('.wrapper').style({"visibility":"visible", "position":"absolute", "opacity": 0});  
    d3.select('.loader').style("display","none");
    d3.select('.wrapper').transition().duration(1000).style('opacity',1).each("end", function(){
      trigger_drag(1,3000);
    });
  };
  var resize = function() {
    w = u.width();
    h = u.height(); 
    redraw();            
  };
  var redraw = function()
  {
    var t = bar_chart;
    t.height_multiplier = u.width() < 1440 ? 1 : 2;
    gridItemMarginH = u.width() < 1440 ? 0 : 5;
    d3.selectAll('.quantum-box .space').style('height',function(d){ return (t.height_multiplier*(t.base_max - d.v)) + 'px'; });
    d3.selectAll('.quantum-box .rest').style('height',function(d){ return (t.height_multiplier*(d.v - t.base)) + 'px'; });

    var timelineProps = window.getComputedStyle(document.getElementsByClassName('timeline')[0]);
    var questionProps = window.getComputedStyle(document.getElementsByClassName('question')[0]);
    var bottomElementsHeight = u.px(timelineProps.marginTop,timelineProps.marginBottom,timelineProps.height,questionProps.height);
    d3.select('.bar-chart .base-mark').style('top', d3.select('.bar-chart .indexes .index:first-of-type .base')[0][0].offsetTop-4 + "px");

    content.select('.page1').style("height", h+ "px");
    var tmpHeight = h - (2*gridMargin+40) - bottomElementsHeight;
    var tmpW = Math.floor((w-2*gridMargin-2*perRowCount*gridItemMarginH)/perRowCount);
    var tmpH = Math.floor((tmpHeight-2*5*gridItemMarginV)/5);
    var hWidth, hHeight, hh1, hw1, hh2,hw2;
    hWidth = hHeight = hh1 = hw1 = hh2 = hw2 = 0;
    if(tmpW < hw)
    {
      hw1 = tmpW;
      hh1 = Math.ceil(hp * hw1);
    }
    if(tmpH < hh)
    {
      hh2 = tmpH;
      hw2 = Math.ceil(hw/hh*hh2);
    }
    hWidth = hw1;
    hHeight = hh1;
    if(hh1 > hh2 && hh2 != 0)
    {
      hWidth = hw2;
      hHeight = hh2;
    }
    grid.selectAll('div').style({"width": hWidth + 'px', "height": hHeight + 'px', "margin": ('6px '+ gridItemMarginH+'px')});  
    content.select('.grid').style('height', tmpHeight + "px");
  };
  var ondrag = function()
  {
    var x = d3.event.x;
    if(x >= 0 && x <= marksWidth);
    else if(x < 0) x = 0;
    else x = marksWidth; 

    if(x >= 0 && x <= dots[1])
    {
      d3.selectAll('.grid .people .muted').classed('woman-d',false).classed('woman',true);
      d3.selectAll('.grid .people .muted').style("opacity", 1-(100*x/dots[1])*0.9/100 + 0.1 );
    }
    else
    {
      d3.selectAll('.grid .people .muted').classed('woman-d',true).classed('woman',false);
    }
    //console.log(d3.select(this),x-dragpointHalfWidth,x,dragpointHalfWidth);
    d3.select(this).datum({x:x}).style("left", x-dragpointHalfWidth + "px");
  };
  var ondragend = function()
  {
    var i = 0, x = d3.select(this).data()[0].x;
    if(x <= dots[1]) i = x-dots[0]>dots[1]-x ? 1 : 0;
    else i = x-dots[1]>dots[2]-x ? 2 : 1;
    trigger_drag(i);
  };
  var trigger_drag = function(i,dur)
  {
    dur = dur || animDuration;
    var x = dots[i];
    var opacity = (i == 0 ? 1 : 0.1);
    var all = d3.selectAll('.grid .people .muted');
    if(i == 0) all.classed('woman', true).classed('woman-d', false);
    d3.select('.timeline .marks .dragpoint').datum({x:x}).transition().duration(dur).style("left", x-dragpointHalfWidth + "px");
    all.transition()
      .duration(dur)
      .style("opacity", opacity)
      .each("end", function()
      {
        d3.select(this).classed('woman', opacity == 1).classed('woman-d', opacity != 1);
      });
    content.select('.explanation').transition().duration(dur).style({"opacity": i == 2 ? 1 : 0, "z-index": i == 2 ? 10 : 9});
    content.select('.people').transition().duration(dur).style("opacity", i == 2 ? 0 : 1);          
  };
/*------------------------------------------ Bar Chart ------------------------------------------*/
  var bar_chart_draw = function()
  {
    var t = bar_chart; 
    t.s = d3.select('.bar-chart');
    var indexes = t.s.select('.indexes')
                    .selectAll('div')
                    .data(t.data)
                    .enter()
                    .append('div')
                    .classed('index',true)
                    .attr('data-tip-id',function(d){ return d.k; });                     
   
      indexes.append('div').classed('country', true).each(function(d){
        d3.select(this).attr('data-i18n-charts-bar_chart-' + d.k, "text").attr('data-tip',d.k);
        if(d.hasOwnProperty('class'))
        {
          d3.select(this).classed(d.class,true);
        }
      });
      indexes.append('div').classed('quantum', true).attr('data-tip',function(d){ return d.k; }).text(function(d){ return d.v; });
      var quantum_box = indexes
                          .append('div')
                          .classed('quantum-box', true)
                          .attr('data-tip',function(d){ return d.k; });
      quantum_box.append('div').classed('space',true);
      quantum_box.append('div').classed('rest',true);

      quantum_box.append('div').classed('base',true).each(function(d){
          if(d.hasOwnProperty('class'))
          {
            d3.select(this).classed(d.class,true);
          }
        });
      quantum_box.append('div').classed('bottom',true);

      var country_shape = indexes.append('div').classed('country-shape', true);
      country_shape.append('div').classed('vertical-line',true).attr('data-tip',function(d){ return d.k; });
      var country_shape_box = country_shape.append('div').each(function(d){
        d3.select(this).classed('shape ' + d.k, true).attr('data-tip', d.k);
      });
      country_shape_box.append('img').each(function(d){
        d3.select(this).attr('src', 'assets/images/countries/' + d.k + '.svg');
      });
      country_shape.append('div').classed('dot',true).attr('data-tip',function(d){ return d.k; });

      indexes.append('div').classed('country bottom', true).each(function(d){
        d3.select(this).attr('data-i18n-charts-bar_chart-' + d.k, "text").attr('data-tip',d.k);
        if(d.hasOwnProperty('class'))
        {
          d3.select(this).classed(d.class,true);
        }
      });
      var million = I18n.t('million');
      indexes.append('div').classed('population', true).text(function(d){ return d.population + "\n" + million; });

      var moveEvent = "mousemove";
      var outEvent = "mouseout";
       indexes.selectAll('[data-tip]').on(moveEvent, function(d){  
         //console.log('a',d);
          var t = d3.select(this);       
          var tip_id = t.attr('data-tip');
          var par = d3.select('[data-tip-id='+tip_id+']');
          var tip = d3.select('#tip');
          var klass="";
          if(d.hasOwnProperty('class'))
          {
            klass = " " + d.class;
          }
          var html =  '<div>' +
                         '<div class="country'+klass+'">' + I18n.t('charts-bar_chart-' + d.k) + '</div>' + 
                         '<div class="region">' + I18n.t('charts-bar_chart-' + d.region) + '</div>' + 
                         '<div class="rate"><div class="label">' + I18n.t('charts-bar_chart-rate') + "&nbsp;</div>" + d.rate + '</div>' + 
                         '<div class="gender-gap"><div class="label">' + I18n.t('charts-bar_chart-gender_gap') + "&nbsp;</div>" + d.population_p.toLocaleString() + '%</div>' + 
                         '<div class="missing'+klass+'">' + I18n.t('charts-bar_chart-missing_woman') + '</div>' + 
                         '<div class="gap'+klass+'">' + d.population_t.toLocaleString() + '</div>' + 
                         '<div class="period">(' + d.period + ')</div>' +                         
                      '</div>';
          var content = tip.select('.data').html(html);
          var tiph = tip[0][0].clientHeight;
          var tipw = tip[0][0].clientWidth;
           var top = 0;           
           if(d3.event.pageY - tiph < window.scrollY) // under
           {
             top =  d3.event.pageY + 20;
             tip.select('.pointer-top').style('display','block');
             tip.select('.pointer-bottom').style('display','none');
           }
           else // above
           {
              top =  d3.event.pageY - tiph - 5;
             tip.select('.pointer-top').style('display','none');
             tip.select('.pointer-bottom').style('display','block');
           }
          tip.style({top: top + "px", left: d3.event.pageX -tipw/2 + "px"}).transition().duration(100).style('opacity',1);
          d3.event.preventDefault();
       });
      indexes.selectAll('[data-tip]').on(outEvent, function(){  
        d3.select('#tip').style({'opacity':0, 'left': '-999999px' }); 
        d3.event.preventDefault();         
      });
  };
/*------------------------------------------ Line Chart ------------------------------------------*/  
  var line_chart_draw = function()
  {
    var chart = c3.generate({
        bindto: '#line_chart',
        size: {
          height: 320
        },
        data: {
          x : 'x',
          columns: [
            [ 'x', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013' ],
            [ 'georgia', 112, 111.1, 111.6, 111.5, 111.2, 111.3, 110.8, 110.8, 110.4, 110.1, 109.8 ],
            [ 'armenia', 108.3, 108, 107.7, 107.4, 107.1, 106.9, 106.7, 106.5, 106.2, 106, 105.9 ],
            [ 'eu', 105.4, 105.4, 105.3, 105.3, 105.2, 105.1, 105.1, 105, 105, 105, 104.9, 104.8 ],
            [ 'azerbaijan', 104.1, 103.9, 103.7, 103.4, 103.2, 102.9, 102.7, 104.1, 101.9, 101.7, 101.5, 101.3 ]
          ],
          type: 'spline',
          names: {
            armenia: I18n.t('charts-line_chart-legend-armenia'),
            azerbaijan: I18n.t('charts-line_chart-legend-azerbaijan'),
            georgia: I18n.t('charts-line_chart-legend-georgia'),
            eu: I18n.t('charts-line_chart-legend-eu')
          },
          colors: {
            azerbaijan: '#42a555',
            armenia: '#dd8345',
            georgia: '#f75c5c',
            eu: '#468cc1'        
          }          
        },
        axis: {
          x:
          {
            label: { 
              text: I18n.t('year'),
              position: 'outer-left'
            },
          },
          y: {
            label: {
              text: I18n.t('charts-line_chart-y_label'),
              position: 'outer-top',
            },
            tick: {
              values: [100, 103, 106, 109, 112, 115]
            }
          }
        },
        legend: {
          show: true,
          position: 'right'
        },
        tooltip: {
          show: true,
          format: {
            name: function (name, ratio, id, index) { return I18n.t("charts-bar_chart-" + id); }
          }
        },
        onrendered: function () {
          d3.select('.line-chart .c3-axis-y-label').attr("dy", -45);
          d3.select('.line-chart .c3-axis-x-label').attr({"dy":30,"dx":65});
          d3.selectAll('.line-chart .c3-legend-item').each(function(d,i){
            if(i > 0)
            {
              var t = d3.select(this);             
              t.select('text').attr('y', +t.select('text').attr('y') + i*5);
              t.select('.c3-legend-item-event').attr('y', +t.select('.c3-legend-item-event').attr('y') + i*5);
              t.select('.c3-legend-item-tile').attr('y', +t.select('.c3-legend-item-tile').attr('y') + i*5);
            }
          });
        }
    });
  };
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