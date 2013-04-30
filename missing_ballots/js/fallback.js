
$('#impress').find('.substep').removeClass('substep').end().find('.step.invisible').removeClass('invisible');

//var focusi = -1;
$(window).keydown(function (event)
{
  switch (event.keyCode)
  {
    case 37:
    case 38:
    //focusi --;
      return animatescroll('prev');
      break;
    case 39:
    case 40:
    //focusi ++;
      return animatescroll('next');
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
      if (ys[j] == undefined)
      {
        break;
      }
    //console.log(focusi, ys[focusi]);
      $('body, html').stop().animate({scrollTop: ys[j]});
      return false;
    }
    else if (i == ys.length - 1)
    {
      if (direction == 'prev')
      {
        $('body, html').stop().animate({scrollTop: ys[i]});
        return false;
      }
    }
  }
  return true;
}

