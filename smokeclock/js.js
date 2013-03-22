

var math = Math;
var rad = math.PI / 180;

function round_digits (n, digits_count)
{
  var t = Math.pow(10, digits_count);
  return Math.round(n * t) / t;
}

$(window).load(function ()
{
  var $clock = $('#clock');
  var r = $clock.width () / 2 - 21;

  var cx = $clock.width()  / 2;
  var cy = $clock.height() / 2;

  for (i = 5; i >= -6; i --)
  {
    deg = i * 30;
    var el = $clock.find('.h > div:eq(' + (-i + 5) + ')');

    x = round_digits(r * math.sin(deg * rad) + cx - el.width() / 2, 2);
    y = round_digits(r * math.cos(deg * rad) + cy - el.height() / 2, 2);

    el.css({top: y + 'px', left: x + 'px'});
  }



  $clock.find('.h > div').click(function ()
  {
    var i = $(this).index() + 1;
    $(this).addClass('active').siblings().removeClass('active');
    $('#clock-bg').css('transform', 'rotate(' + i * 30 + 'deg)');

    $('.imgc .img img').attr('src', $('.imgc .img img').attr('src').replace(/[0-9]+\.png/, i + '.png'));

    $('#content .subheader').html(texts[locale].content[i].image_alt);
  });



  var globali = 0;
  var timer = new Timer(function ()
  {
    $clock.find('.h > div').eq(globali).click();
    globali ++;
    if (globali < 12)
    {
      timer.restart(3000);
    }
  }, 10);

  $clock.find('.controls .play').live('click', function ()
  {
    $(this).removeClass('play').addClass('pause');
    timer.resume();
  });

  $clock.find('.controls .pause').live('click', function ()
  {
    $(this).removeClass('pause').addClass('play');
    timer.pause();
  });


});
