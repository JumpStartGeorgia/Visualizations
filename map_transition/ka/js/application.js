$(function ()
{



  var steps = $('#object .step');

  $('#buttons .btn').click(function ()
  {
    var activei = steps.filter('.active').removeClass('active').index();
    var nexti = $(this).hasClass('left') ? (activei == 0 ? steps.length - 1 : activei - 1) : (activei == steps.length - 1 ? 0 : activei + 1);
    steps.eq(nexti).addClass('active');
  });












});
