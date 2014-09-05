var data = holidays;
//var ds = null;
var chart_meta = null;
var chart_data = null;
var max_days = 0;  
holidays.forEach(function(d,i){ if(max_days<d.total) max_days=d.total; });

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
var color = d3.scale.ordinal().range(["#5eddcc","#0ab5dd","#3286a0","#ff926f",'#ccdee4']).domain([0,1,2,3,4]);  

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) { return d.comment });

var svg = d3.select("content").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g").attr('class','chart')
    .attr("transform", "translate(" + (margin.left) + "," + 40 + ")");


// d3.json("../assets/data.json", function(error, d) { 
//   ds = d;
//   var filter = d3.select('.filter select').on('change',function(d){ sort(+this.options[this.selectedIndex].value); });
//   data = d.data;
//   data.forEach(function(d) {  
//     if(max_days < d.total) max_days = d.total;
//   });  

// });


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
        .attr("transform", "translate(-12," + height + ")")
        .call(axis_x());

  chart_meta.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(-12,-23)")
        .call(axis_x());


  chart_meta.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-10,0)")
      .call(axis_y());   

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
      .style("fill", function(d,i) { return color(i); });
     // .on('mouseover', function(d,i){ if (i!=3){ return tip.show(d);} })
      //.on('mouseout', function(d,i){ if (i!=3){ return tip.hide(d);} })
        //function(d){ if (d.comment !== undefined && d.comment[lang] !== undefined && d.comment[lang] !== null && d.comment[lang] !== "") return tip.hide(d); });

  svg.call(tip);
}
function axis_x() { return d3.svg.axis().scale(x).orient("bottom").tickValues(d3.range(1,max_days+1,1)).ticks(max_days).tickFormat(d3.format("d")); }
function axis_y() { return d3.svg.axis().scale(y).orient("left"); }
function init_legend()
{
  var l = legends.map(function(d){ return d.name[lang];});
  var legend = chart_meta
  .append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(" + (width+15) + ", 0 )"; });
    
  var text = legend.append('text').attr({x:0,y:18});
    text.append('tspan').text("Paid annual leave")
    text.append('tspan').attr({x:0,dy:18}).text("(in working days) for a worker with");                  
    
  var items = legend
    .selectAll(".item")
    .data(l)
    .enter()
    .append('g')
    .attr("class", "item")
  .attr("transform", function(d, i) { return "translate(" + 0 + "," + (i*25 + 36)  + ")"; });

  items.append("rect").attr({y:16,width:16,height:16,rx:1,ry:1}).style("fill", color);
  items.append("text").attr("y",23).attr("x",25).attr("dy", ".35em").text(function(d) { return d; });

  legend.append('line').attr({ x1:"0", y1:"160", x2:"300", y2:"160",'fill':'none','stroke':'#8F9B9B','stroke-width':1,'stroke-miterlimit':10}).style({ opacity:0.6});

  legend.append("rect").attr({y:170,width:8,height:8,fill:'#3286a0',rx:1,ry:1});
  var text = legend.append('text').attr({x:15,y:190});
  text.append('tspan').text("Only a few Labour Codes differentiate the length of");
  text.append('tspan').attr({x:15,dy:18}).text("annual leave based on the length of employment.");

  legend.append("rect").attr({y:220,width:8,height:8,fill:'#ff926f',rx:1,ry:1});
  legend.append('text').attr({x:15,y:240}).text("Easter Sunday is not included in the Public Holidays.");;
}
function refresh_items(not_national)
{
  if(not_national === undefined) not_national = true;

  var coul = tips.country[lang];
  var catl = tips.category[lang];
  var totl = tips.total[lang];
  var coml = tips.comment[lang];

  data.forEach(function(d) {   

    var com1 = coul + " " + d.country[lang] + "<br><br>" + catl + " ";
    var com2 = "<br><br>" + totl + " " + d.total;
    var y0 = 0;           
    d.items = [];   
    //var diff = d.annual_max-d.annual_min;
    //var diff_to_min = diff == 0 ? d.annual_min : diff;
    var comment = "<div class='tip'><div class='country'>Country</div><hr/><div class</div>";
    if(not_national)
    {
      //var cm1 = com1 + "<b style=\"color:#ffd83f;\">&1</b>/&2/&3".replace('&1',d.annual_min).replace('&2',diff_to_min).replace('&3',d.national) + com2;
      //var cm2 = com1 + "&1/<b style=\"color:#ffd83f;\">&2</b>/&3".replace('&1',d.annual_min).replace('&2',diff_to_min).replace('&3',d.national) + com2;
      //var cm3 = com1 + "&1/&2/<b style=\"color:#ffd83f;\">&3</b>".replace('&1',d.annual_min).replace('&2',diff_to_min).replace('&3',d.national) + com2;
      d.items.push({y0: y0, y1: y0 += d.y1 });
      d.items.push({y0: y0, y1: y0 += d.y5 });    
      d.items.push({y0: y0, y1: y0 += d.y10 });    
      d.items.push({y0: y0, y1: y0 += d.national });  
      d.items.push({y0: d.items[3].y1, y1: max_days }); 
      console.log(d.items);
    }
    // else
    // {
    //   var cm1 = com1 + "<b style=\"color:#ffd83f;\">&1</b>/&2/&3".replace('&3',d.national).replace('&1',d.annual_min).replace('&2',diff_to_min) + com2;
    //   var cm2 = com1 + "&1/<b style=\"color:#ffd83f;\">&2</b>/&3".replace('&3',d.national).replace('&1',d.annual_min).replace('&2',diff_to_min) + com2;
    //   var cm3 = com1 + "&1/&2/<b style=\"color:#ffd83f;\">&3</b>".replace('&3',d.national).replace('&1',d.annual_min).replace('&2',diff_to_min) + com2;
    //   d.items.push({y0: y0, y1: y0 += d.national , comment: cm1});  
    //   d.items.push({y0: y0, y1: y0 += d.annual_min , comment: cm2});
    //   d.items.push({y0: y0, y1: y0 += diff, comment: cm3});    
    //   d.items.push({y0: d.items[2].y1, y1: d.items[2].y1 + (max_days - d.total)}); 
    // }
  });
  color = d3.scale.ordinal().range(not_national ? ['#5eddcc','#0ab5dd','#3286a0','#ff926f','#ccdee4'] : ["#f27f49","#52bf6e","#52aa69","#f2c73d"]);      
 
}
function exist(v)
{
  return typeof v !== 'undefined' && v !== null && v !== '';
}

init();