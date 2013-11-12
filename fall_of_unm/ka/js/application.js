
(function ()
{

  var images = $('#object .step img'),
  loaded_count = 0;
  images.each(function (i)
  {
    var img = new Image();
    img.onload = function ()
    {
      loaded_count ++;
      if (loaded_count == images.length)
      {
        callback();
      }
    }
    img.src = $(this).attr('src');
  });


  function callback ()
  {
  /*
    var els = {
      window: $(window),
      footer: $('#wrapper > footer'),
      header: $('#content > header'),
      cont: $('#object-container')
    };
    els.cont.css({
      position: 'absolute',
      top: (els.window.height() - els.footer.outerHeight(true) - els.header.outerHeight(true) - els.cont.outerHeight()) / 2,
      left: (els.window.width() - els.cont.width()) / 2
    });
  */

    $('.loading').removeClass('loading');


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

  }


})(jQuery);





