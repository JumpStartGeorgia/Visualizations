$(function ()
{



  function change (direction)
  {
    var activei = steps.filter('.active').removeClass('active').index();
    var nexti = direction == 'left' ? (activei == 0 ? steps.length - 1 : activei - 1) : (activei == steps.length - 1 ? 0 : activei + 1);
    steps.eq(nexti).addClass('active');
  }


  function automatic ()
  {
    timer = setTimeout(automatic, 5000);
    change('right');
  }

  var timer = setTimeout(automatic, 5000);


  var steps = $('#object .step');

  $('#buttons .btn').click(function ()
  {
    clearTimeout(timer);
    change($(this).hasClass('left') ? 'left' : 'right');
  });










});
