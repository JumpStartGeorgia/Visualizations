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