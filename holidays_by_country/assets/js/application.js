var data = null;
var ds = null;
var chart_meta = null;
var chart_data = null;
var max_days = 50;  
var lang = d3.select('html').attr("lang");
if(!(lang == "ka" || lang == "en"))
{ 
  lang = "en";
  d3.select('html').attr("lang",lang);
}
var margin = {top: 60, right: 20, bottom: 60, left: 150},   
   width = 1060 - margin.left - margin.right,
   height = 960 - margin.top - margin.bottom;

var x = d3.scale.linear().rangeRound([0, width]);
var y = d3.scale.ordinal().rangeRoundBands([height, 0],0);

// national, annual min, annual max 
var color = d3.scale.ordinal().range(["#52bf6e","#52aa69","#f27f49","#f2c73d"]).domain([0,1,2,3]);  

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) { return d.comment });

var svg = d3.select("content").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g").attr('class','chart')
    .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");


d3.json("../assets/data.json", function(error, d) { 
  ds = d;
  var filter = d3.select('.filter select').on('change',function(d){ sort(+this.options[this.selectedIndex].value); });
  data = d.data;
  data.forEach(function(d) {  
    if(max_days < d.total) max_days = d.total;
  });  
  init();
});


function init()
{     

  x.domain([0, max_days]);
  y.domain(data.map(function(d) { return d.country[lang]; }));

  chart_data = svg.append("g").attr("class","data");
  chart_meta = svg.append("g").attr("class","meta");

  chart_meta.append("g")         
    .attr("class", "x grid")
    .attr("transform", "translate(0," + height + ")")
    .call(axis_x()
        .tickSize(-height, 0, 0)
        .tickFormat("")
    );
   
  chart_meta.append("g").attr("class", "y grid").attr("transform", "translate(0,"+y.rangeBand()/2+")").call(axis_y().tickSize(-width, 0, 0).tickFormat(""));

  init_legend();
  sort();
}
function sort(sort_item)
{
  // country = 0(default), total = 1, national = 2, annual min = 3, annual max = 4
  if(sort_item == 2) refresh_items(false); 
  else refresh_items(true);

  switch(sort_item) 
  {
    case 1:
      data.sort(function(a, b) { return a.total - b.total; });
    break;
    case 2:
      data.sort(function(a, b) { return a.national - b.national; });        
    break;
    case 3:
      data.sort(function(a, b) { return a.annual_min - b.annual_min; });
    break;
    case 4:
      data.sort(function(a, b) { return a.annual_max - b.annual_max; });

    break;
    default:
      data.sort(function(a, b) { return b.country[lang].localeCompare(a.country[lang]); });
     break;
  }
  redraw();
}
function redraw()
{    
  svg.selectAll(".g.item").remove();
  chart_meta.select(".x.axis").remove();
  chart_meta.select(".y.axis").remove();

  y.domain(data.map(function(d) { return d.country[lang]; }));

  chart_meta.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(axis_x());

  chart_meta.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,-30)")
        .call(axis_x());


  chart_meta.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-10,0)")
      .call(axis_y())
    .append("text")        
      .attr("y", -11)
      .attr("x", -25) 
      .text(ds.page[lang].days)
      .attr('text-anchor','middle');

  var state = chart_data.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "g item")
      .attr("transform", function(d) { return "translate(0," + y(d.country[lang]) + ")"; });

   state.selectAll("rect")
      .data(function(d) { return d.items; })
    .enter().append("rect")
      .attr("height", y.rangeBand())
      .attr("x", function(d) { return x(d.y0);})
      .attr("width", function(d) { return x(d.y1) - x(d.y0); })
      .style("fill", function(d,i) { return color(i); })
      .on('mouseover', function(d,i){ if (i!=3){ return tip.show(d);} })
      .on('mouseout', function(d,i){ if (i!=3){ return tip.hide(d);} })
        //function(d){ if (d.comment !== undefined && d.comment[lang] !== undefined && d.comment[lang] !== null && d.comment[lang] !== "") return tip.hide(d); });

  svg.call(tip);
}
function axis_x() { return d3.svg.axis().scale(x).orient("bottom").ticks(56).tickFormat(d3.format("d")); }
function axis_y() { return d3.svg.axis().scale(y).orient("left"); }
function init_legend()
{
  var l = ds.legend[lang].map(function(d){ return d.name;});
  var legend1 = chart_meta.selectAll(".legend1")
    .data(l).enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(" + (width - (3-i)*160) + "," + (height+10) + ")"; });

  var legend2 = chart_meta.selectAll(".legend2")
    .data(l).enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(" + (width - (3-i)*160) + "," + (-70) + ")"; });

  legend1.append("rect").attr("y", 18).attr("width", 18).attr("height", 18).style("fill", color);
  legend1.append("text").attr("y",26).attr("x",25).attr("dy", ".35em").text(function(d) { return d; });
  legend2.append("rect").attr("y", 18).attr("width", 18).attr("height", 18).style("fill", color);
  legend2.append("text").attr("y",26).attr("x",25).attr("dy", ".35em").text(function(d) { return d; });
}
function refresh_items(not_national)
{
  if(not_national === undefined) not_national = true;

  var coul = ds.tip[lang].country;
  var catl = ds.tip[lang].category;
  var totl = ds.tip[lang].total;
  var coml = ds.tip[lang].comment;

  data.forEach(function(d) {   

    var com1 = coul + " " + d.country[lang] + "<br><br>" + catl + " ";
    var com2 = "<br><br>" + totl + " " + d.total + "<br><br>" + (exist(d.comments[lang]) ? coml + " " + d.comments[lang] : "");
    var y0 = 0;           
    d.items = [];   
    var diff = d.annual_max-d.annual_min;
    var diff_to_min = diff == 0 ? d.annual_min : diff;
    if(not_national)
    {
      var cm1 = com1 + "<b style=\"color:#ffd83f;\">&1</b>/&2/&3".replace('&1',d.annual_min).replace('&2',diff_to_min).replace('&3',d.national) + com2;
      var cm2 = com1 + "&1/<b style=\"color:#ffd83f;\">&2</b>/&3".replace('&1',d.annual_min).replace('&2',diff_to_min).replace('&3',d.national) + com2;
      var cm3 = com1 + "&1/&2/<b style=\"color:#ffd83f;\">&3</b>".replace('&1',d.annual_min).replace('&2',diff_to_min).replace('&3',d.national) + com2;
      d.items.push({y0: y0, y1: y0 += d.annual_min, comment: cm1});
      d.items.push({y0: y0, y1: y0 += diff, comment: cm2 });    
      d.items.push({y0: y0, y1: y0 += d.national , comment: cm3 });  
      d.items.push({y0: d.items[2].y1, y1: d.items[2].y1 + (max_days - d.total)}); 
    }
    else
    {
      var cm1 = com1 + "<b style=\"color:#ffd83f;\">&1</b>/&2/&3".replace('&3',d.national).replace('&1',d.annual_min).replace('&2',diff_to_min) + com2;
      var cm2 = com1 + "&1/<b style=\"color:#ffd83f;\">&2</b>/&3".replace('&3',d.national).replace('&1',d.annual_min).replace('&2',diff_to_min) + com2;
      var cm3 = com1 + "&1/&2/<b style=\"color:#ffd83f;\">&3</b>".replace('&3',d.national).replace('&1',d.annual_min).replace('&2',diff_to_min) + com2;
      d.items.push({y0: y0, y1: y0 += d.national , comment: cm1});  
      d.items.push({y0: y0, y1: y0 += d.annual_min , comment: cm2});
      d.items.push({y0: y0, y1: y0 += diff, comment: cm3});    
      d.items.push({y0: d.items[2].y1, y1: d.items[2].y1 + (max_days - d.total)}); 
    }
  });
  color = d3.scale.ordinal().range(not_national ? ["#52bf6e","#52aa69","#f27f49","#f2c73d"] : ["#f27f49","#52bf6e","#52aa69","#f2c73d"]);      
 
}
function exist(v)
{
  return typeof v !== 'undefined' && v !== null && v !== '';
}