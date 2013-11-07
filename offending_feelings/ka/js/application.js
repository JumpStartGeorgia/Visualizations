

(function ($)
{

  var images = $('.visual .imgc img');
  images.each(function (i)
  {
    var img = new Image();
    var self = $(this);
    img.onload = function ()
    {
      self.attr('src', this.src).parent().animate({height: this.height}, 1500);
      self.parent().siblings('.loading').hide(function ()
      {
        $(this).remove();
      });
    /*
      if (i == images.length - 1)
      {
        return;
        callback();
      }
    */
    }
    img.src = self.attr('src');
  });


/*
  function callback ()
  {
    $('img.loading').hide();
  }
*/


})(jQuery);



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
