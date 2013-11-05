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

  var steps = $('#object .step');

  var timer = setTimeout(automatic, 5000);;


  $('#buttons .btn.left, #buttons .btn.right').click(function ()
  {
    clearTimeout(timer);
    change($(this).hasClass('left') ? 'left' : 'right');
    $(this).siblings('.pause').hide().siblings('.play').css('display', 'inline-block');
  })
  .siblings('.play').click(function ()
  {
    automatic();
    $(this).hide().siblings('.pause').css('display', 'inline-block');
  })
  .siblings('.pause').click(function ()
  {
    clearTimeout(timer);
    $(this).hide().siblings('.play').css('display', 'inline-block');
  });











});
