$(function ()
{




  var left_coordinates = [20, 170, 220, 350, 410, 500];
  $('ul#joining_right li').each(function (i)
  {
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    var attrs = {
      x1: 0,
      y1: left_coordinates[i],
      x2: $('svg#joining_lines').width(),
      y2: +$(this).position().top,// + $(this).height() / 2,
      style: 'stroke: rgb(255, 0, 0); stroke-width: 2;',
      'data-jmpress': 'fade'
    };
    for (var name in attrs)
    {
      line.setAttribute(name, attrs[name]);
    }
    $('svg#joining_lines').append(line);
  });

  $('#sstep')
    .on('enterStep', function(event) {
        console.log('enter');
    })
    .on('leaveStep', function(event) {
        console.log('leave');
    });


  $('#wrapper').jmpress();

});
