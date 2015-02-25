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
      grid = content.select('.grid');
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
   function randomEven(min,max)
   {
      // rand() % 5 yields 0, 1, 2, 3, or 4.
// adding 1 yields 1, 2, 3, 4, or 5.
// multiplying by 2 yields 2, 4, 6, 8, 10
// int even_random_number() {
//     return 2 * ( rand() % 5 + 1 );
// }
         
       return 2*(rand(min,max)%(Math.floor(max/2)) + 1);
   }
   function rand(min,max)
   {
    return Math.floor(Math.random()*(max-min+1)+min);
   }

  // obj.someMethod = function () {
  //   // take it away Mr. Public Method
  // };
  init();
  return obj;

})();