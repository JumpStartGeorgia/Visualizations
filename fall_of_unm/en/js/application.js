$(function ()
{



  function change (direction)
  {
    var activei = steps.filter('.active').removeClass('active').index();
    var nexti = direction == 'left' ? (activei == 0 ? steps.length - 1 : activei - 1) : (activei == steps.length - 1 ? 0 : activei + 1);
    steps.eq(nexti).addClass('active');
  }

  var delay = 3500;

  function automatic ()
  {
    timer = setTimeout(automatic, delay);
    change('right');
  }

  var steps = $('#object .step');

  var timer = setTimeout(automatic, delay);


  $('#buttons .btn.left, #buttons .btn.right').click(function ()
  {
    clearTimeout(timer);
    change($(this).hasClass('left') ? 'left' : 'right');
    $(this).siblings('.pause').removeClass('visible').siblings('.play').addClass('visible');
  })
  .siblings('.play').click(function ()
  {
    automatic();
    $(this).removeClass('visible').siblings('.pause').addClass('visible');
  })
  .siblings('.pause').click(function ()
  {
    clearTimeout(timer);
    $(this).removeClass('visible').siblings('.play').addClass('visible');
  });











});
