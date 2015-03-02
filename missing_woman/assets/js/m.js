var mw = (function () {

  // locally scoped Object
   var obj = { };
   var blinkDuration = 900;
   var blinkEase = "linear";
   var gridMargin = 10;
   var gridItemMargin = 5;
   var w = window.innerWidth;
   var h = window.innerHeight;
   var hw = 52;
   var hh = 113;
   var hp = 52/113;
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
   var bar_chart = 
   {
      data: [
        {k:"china",v:118, rate: 117.8, region: "esa", period:"2011", population_p: 14.2, population_t: "23,687", population:1357380000 },
        {k:"azerbaijan",v:117,class:"highlight", rate: 116.5, region: "sc", period:"2011", population_p: 7.8, population_t: 104, population:10162532},        
        {k:"armenia",v:115,class:"highlight", rate: 114.5, region: "sc", period:"2011", population_p: 7.4, population_t: 31, population:2976566},
        {k:"georgia",v:114,class:"highlight", rate: 113.6, region: "sc", period:"2009-2011", population_p: 3.8, population_t: 19, population:4476900},
        {k:"albania",v:112, rate: 117.7, region: "se", period:"2008-2010", population_p: 3.1, population_t: 15, population:"2,773,620"},
        {k:"vietnam",v:111, rate: 111.2, region: "esa", period:"2010", population_p: 1.7, population_t: 245, population:"89,708,900"},
        {k:"india",v:111, rate: 110.5, region: "sa", period:"2008-2010", population_p: 5.6, population_t: "13,197", population:"1,252,139,596"},
        {k:"pakistan",v:110, rate: 109.9, region: "sa", period:"2007", population_p: 0.7, population_t: 281, population:"182,142,594"},
        {k:"montenegro",v:110, rate: 109.8, region: "se", period:"2009-2011", population_p: 2.7, population_t: 2, population:"621,383"},
        {k:"singapore",v:108, rate: 107.5, region: "esa", period:"2009", population_p: 1.9, population_t: 11, population:"5,399,200"},
        {k:"south_korea",v:107, rate: 106.7, region: "esa", period:"2010", population_p: 4.8, population_t: 260, population:"50,219,669"}
      ],
      s: null, // selector
      base: 105,
      base_max: 118,
      height_multiplier: 2
   };        
    
  // declared with `var`, must be "private"
   var init = function()
   {
      blink();
      d3.select(window).on('resize', resize);
      setTimeout(function()
     {
        prepare();     
      },0);
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
      d3.select('.loader').style("display","none");
      content = d3.select('.content').style("display","inline-block");
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
         })
        .style({"width":(w-(16+2*gridMargin)-2*perRowCount*gridItemMargin)/perRowCount+'px',
               "margin": ('0px '+ gridItemMargin+'px')});  



      // binding events 
      marksWidth = d3.select('.timeline .marks')[0][0].clientWidth;
      dots = [0,marksWidth/2,marksWidth];

      var drag = d3.behavior.drag()       
        .on("drag", ondrag)
        .on("dragend", ondragend);
      d3.select('.dragpoint').call(drag);

      d3.selectAll('.marks .mark .label').on('click',function(){
        var tmp = +d3.select(this).attr('data-id');
        trigger_drag(dots[tmp],tmp);
      });
      d3.selectAll('.question .button').on('click',function(){
          d3.select("body").transition().duration(2000)
          .tween("uniquetweenname", scrollTopTween(d3.select('.charts')[0][0].offsetTop));         
      });
      bar_chart_draw();
      line_chart_draw();

      I18n.init();
  };
  var resize = function() {
    w = window.innerWidth;
    h = window.innerHeight;
    redraw();
  };
  var redraw = function()
  {
    grid.selectAll('div').style("width",(w-(16+2*gridMargin)-2*perRowCount*gridItemMargin)/perRowCount+'px');           
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
    d3.select(this).style("left", x-dragpointHalfWidth + "px").datum({x:x});
  };
  var ondragend = function()
  {
    var d = d3.select(this);
    var i = 0,opacity = 0.1,x = d.data()[0].x;

    if(x <= dots[1])
    {
      var b = x-dots[0]>dots[1]-x;
      x = dots[(b ? 1 : 0)];
      opacity = b ? 0.1 : 1;
      i = b ? 0 : 1;
    }
    else
    {
      x = dots[((x-dots[1]>dots[2]-x) ? 2 : 1)];
      i = b ? 1 : 2;
    }
    d.transition().duration(900).style("left", x-dragpointHalfWidth + "px");    
    d3.selectAll('.grid .people .muted')
      .transition()
      .duration(900)
      .style("opacity", opacity)
      .each("end", function()
      {
        d3.select(this).classed('woman', opacity == 1).classed('woman-d', opacity != 1);
      });
      content.select('.data').transition().duration(900).style("opacity", i == 2 ? 1 : 0);
  };
  var trigger_drag = function(x,i)
  {
    var opacity = (i == 0 ? 1 : 0.1);
    var all = d3.selectAll('.grid .people .muted');
    if(i == 0) all.classed('woman', true).classed('woman-d', false);

    d3.select('.timeline .marks .dragpoint').datum({x:x}).transition().duration(900).style("left", x-dragpointHalfWidth + "px");
    all.transition()
      .duration(900)
      .style("opacity", opacity)
      .each("end", function()
      {
        d3.select(this).classed('woman', opacity == 1).classed('woman-d', opacity != 1);
      });
    content.select('.data').transition().duration(900).style("opacity", i == 2 ? 1 : 0);      
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
      quantum_box
        .append('div')
        .classed('space',true)
        .style('height',function(d){ return (t.height_multiplier*(t.base_max - d.v)) + 'px'; });
      quantum_box
        .append('div')
        .classed('rest',true)        
        .style('height',function(d){ return (t.height_multiplier*(d.v - t.base)) + 'px'; });

      quantum_box.append('div').classed('base',true).each(function(d){
          if(d.hasOwnProperty('class'))
          {
            d3.select(this).classed(d.class,true);
          }
        });
      quantum_box.append('div').classed('bottom',true);

      var country_shape = indexes.append('div').classed('country-shape', true);
      country_shape.append('div').classed('vertical-line',true).attr('data-tip',function(d){ return d.k; });
      country_shape.append('div').each(function(d){
        d3.select(this).classed('shape ' + d.k, true).attr('data-tip',d.k);
      });
      country_shape.append('div').classed('dot',true).attr('data-tip',function(d){ return d.k; });

      indexes.append('div').classed('country bottom', true).each(function(d){
        d3.select(this).attr('data-i18n-charts-bar_chart-' + d.k, "text").attr('data-tip',d.k);
        if(d.hasOwnProperty('class'))
        {
          d3.select(this).classed(d.class,true);
        }
      });

       indexes.selectAll('[data-tip]').on('mousemove', function(d){  
         //console.log('a',d);
          var t = d3.select(this);       
          var tip_id = t.attr('data-tip');
          var par = d3.select('[data-tip-id='+tip_id+']');
          var tip = d3.select('#tip');
          var html =  '<div>' +
                         '<div class="country">' + I18n.t('charts-bar_chart-' + d.k) + '</div>' + 
                         '<div class="region">' + I18n.t('charts-bar_chart-' + d.region) + '</div>' + 
                         '<div class="gap">' + d.population_t + '</div>' + 
                         '<div class="missing">' + I18n.t('charts-bar_chart-missing_woman') + '</div>' + 
                         '<div class="population">' + d.population + '</div>' + 
                         '<div class="population_label">' + I18n.t('charts-bar_chart-population') + '</div>' + 
                         '<div class="rate"><div class="label">' + I18n.t('charts-bar_chart-rate') + "&nbsp;</div>" + d.rate + '</div>' + 
                         '<div class="gender-gap"><div class="label">' + I18n.t('charts-bar_chart-gender_gap') + "&nbsp;</div>" + d.population_p + '</div>' + 
                         '<div class="period"><div class="label">' + I18n.t('year') + ":&nbsp;</div>" + d.period + '</div>' +                         
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
       });
      indexes.selectAll('[data-tip]').on('mouseout', function(){  
        d3.select('#tip').style({'opacity':0, 'left': '-999999px' });          
      });
  };
/*------------------------------------------ Line Chart ------------------------------------------*/  
  var line_chart_draw = function()
  {
    var chart = c3.generate({
        bindto: '#line_chart',
        data: {
          columns: [
            ['azerbaijan', 30, 200, 100, 400, 150, 250],
            ['armenia', 50, 20, 10, 40, 15, 25],
            ['georgia', 70, 10, 10, 40, 200, 25]
          ],
          type: 'spline',
          colors: {
            data1: '#de435f',
            data2: '#de435f',
            data3: '#de435f'
          },
          color: function(color,id){ return '#de435f';}
        },
        grid: {
          x: {
            //lines: [{class: 'solidline'}]
            show: true,
            //class: 'solidline'
          },
          y:
          {
            show: true
          }
        },
        legend: {
          show: true,
          position: 'right'
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