
$('#impress').find('.substep').removeClass('substep').end().find('.step.invisible').removeClass('invisible');

$(window).keydown(function (event)
{
  switch (event.keyCode)
  {
    case 37:
    case 38:
      animatescroll('prev');
      return false;
      break;
    case 39:
    case 40:
      animatescroll('next');
      return false;
      break;
  }
});



function animatescroll (direction)
{
  var ys = [];
  $('#impress > .step').each(function ()
  {
    ys.push($(this).offset().top);
  });

  window.scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

  for (var i in ys)
  {
    i = +i;
    if (ys[i] >= window.scrollY)
    {
      var j = (ys[i] == window.scrollY) ? ((direction == 'prev') ? (i - 1) : (i + 1)) : ((direction == 'prev') ? (i - 1) : i);
      $('body, html').stop().animate({scrollTop: ys[j]});
      break;
    }
    else if (i == ys.length - 1)
    {
      if (direction == 'prev')
      {
        $('body, html').stop().animate({scrollTop: ys[i]});
      }
    }
  }
}

