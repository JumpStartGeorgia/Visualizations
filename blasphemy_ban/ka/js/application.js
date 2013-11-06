$(function ()
{


  var scrollbutton = $('#scroll_up'),
  $window = $(window),
  button_appeared = false,
  footer = $('body > footer'),
  appear_after = 250;

  $window.scroll(function ()
  {
    var y = $window.scrollTop();
    if (!button_appeared && y > appear_after)
    {
      button_appeared = true;
      scrollbutton.fadeIn(150);
    }
    else if (button_appeared && y <= appear_after)
    {
      button_appeared = false;
      scrollbutton.fadeOut(150);
    }
  });

  scrollbutton.click(function ()
  {
    $('html, body').animate({scrollTop: 0}, Math.sqrt($window.scrollTop()) * 6);
  });




});
