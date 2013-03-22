var math = Math;
var rad = math.PI / 180;
var globali = 0;
var timer;
var $clock = $('#clock');

function round_digits (n, digits_count)
{
  var t = Math.pow(10, digits_count);
  return Math.round(n * t) / t;
}

function time_click(ths){
  var i = $(ths).index() + 1;
  $(ths).addClass('active').siblings().removeClass('active');
  $('#clock-bg').css('transform', 'rotate(' + i * 30 + 'deg)');

  if (i == 12){
    $('.imgc .img img').attr('src', 'images/i/' + i + '_' + locale + '.png').attr('alt', texts[locale].content[i].image_alt);
  } else {
    $('.imgc .img img').attr('src', 'images/i/' + i + '.png').attr('alt', texts[locale].content[i].image_alt);
  }

  $('#content .subheader').html(texts[locale].content[i].image_alt);

  texts[locale].content[i].positive = texts[locale].content[i].positive || ''; 
  texts[locale].content[i].negative = texts[locale].content[i].negative || ''; 
  $('#content .body')
  .find('.text .positive')
  .html('<ul>' + texts[locale].content[i].positive.replace(/•/g, '</li><li>').replace(/^<\/li>/, '').replace(/\n/g, '<br />') + '</li></ul>')
  .siblings('.negative')
  .html('<ul>' + texts[locale].content[i].negative.replace(/•/g, '<li>').replace(/\n/g, '</li>') + '</li></ul>');

  globali = i++;
//console.log(1, texts[locale].content[i].positive, 2, '<ul>' + texts[locale].content[i].positive.replace(/•/g, '</li><li>').replace(/^<\/li>/, '').replace(/\n/g, '<br />') + '</li></ul>')
}

function create_timer(){
  timer = new Timer(function ()
  {
    time_click($clock.find('.h > div').eq(globali));
    if (globali < 12)
    {
      timer.restart(10000);
    }
  }, 10);
}

$(window).load(function ()
{
  var r = $clock.width () / 2 - 21;

  var cx = $clock.width()  / 2;
  var cy = $clock.height() / 2;

  for (i = 5; i >= -6; i --)
  {
    deg = i * 30;
    var el = $clock.find('.h > div:eq(' + (-i + 5) + ')');

    x = round_digits(r * math.sin(deg * rad) + cx - el.width() / 2, 2);
    y = round_digits(r * math.cos(deg * rad) + cy - el.height() / 2, 2);

    el.css({top: y + 'px', left: x + 'px'}).fadeIn('fast');
  }

  

  $clock.find('.h > div').click(function ()
  {
    globali = $(this).index();
    time_click(this);
    $('.controls .pause').removeClass('pause').addClass('play');
    $('.controls .play').attr('title', texts[locale].play);
    timer.pause();

//    timer.stop();
//   create_timer();
  });


  create_timer();

  $clock.find('.controls .play').live('click', function ()
  {
    $(this).removeClass('play').addClass('pause');
    $('.controls .pause').attr('title', texts[locale].pause);
    if (globali < 12){
      timer.resume();
    } else {
      timer.stop();    
    }
  });

  $clock.find('.controls .pause').live('click', function ()
  {
    $(this).removeClass('pause').addClass('play');
    $('.controls .play').attr('title', texts[locale].play);
    timer.pause();
  });

  $clock.find('.controls .right').live('click', function ()
  {
    if (globali < 12){
      timer.stop();
      create_timer();
    }
  });

  $clock.find('.controls .left').live('click', function ()
  {
    if (globali > 1){
      globali --;
      globali --;
      timer.stop();
      create_timer();
    }
  });

  // catch left and right arrow
  $(window).keydown(function (event)
  {
    switch (event.keyCode)
    {
      case 37: // left
        if (globali > 1){
          globali --;
          globali --;
          timer.stop();
          create_timer();
        }
        break;
      case 39: // right
        if (globali < 12){
          timer.stop();
          create_timer();
        }
        break;
    }
  });

  function update_translations ()
  {
    var to = (locale == 'en') ? 'ka' : 'en';
    $('.locale a').text(to.toUpperCase());
    window.setTimeout(function (){ $('.locale a').attr('href', '#' + to); }, 50);

    $('#clock .h div img').attr('src', function (){ $(this).attr('src', $(this).attr('src').replace('images/h/' + to, 'images/h/' + locale)); });

    var keys = Object.keys(texts[locale].content);
    for (var j=1; j<13; j++ ){
      var num = keys[j-1];
      var text = texts[locale].content[j].image_alt;
      $('#clock .h div img#img_' + num).attr('alt', text);
      $('#clock .h div img#img_' + num).attr('title', text);
    }

    $('#page_title').html(texts[locale].title);
    document.title = texts[locale].title;

    $('#page_title').removeClass(to).addClass(locale);

    $('.locale a').attr('title', texts[locale].lang_switcher);

    $('.controls .right').attr('title', texts[locale].right);
    $('.controls .left').attr('title', texts[locale].left);
    $('.controls .play').attr('title', texts[locale].play);
    $('.controls .pause').attr('title', texts[locale].pause);

    var i = +$('#clock .h div.active').index() + 1;
    if (i > 0)
    {
      $('#content .subheader').html(texts[locale].content[i].image_alt);

      if (i == 12){
        $('.imgc .img img').attr('src', 'images/i/' + i + '_' + locale + '.png').attr('alt', texts[locale].content[i].image_alt);
      }

      texts[locale].content[i].positive = texts[locale].content[i].positive || ''; 
      texts[locale].content[i].negative = texts[locale].content[i].negative || ''; 
      $('#content .body')
      .find('.text .positive')
      .html('<ul>' + texts[locale].content[i].positive.replace(/•/g, '</li><li>').replace(/^<\/li>/, '').replace(/\n/g, '<br />') + '</li></ul>')
      .siblings('.negative')
      .html('<ul>' + texts[locale].content[i].negative.replace(/•/g, '<li>').replace(/\n/g, '</li>') + '</li></ul>');
    }

    $('html').attr('lang', locale);

    $('.js_link').attr('href', 'http://jumpstart.ge/' + locale);
  }

  $('.locale a').click(function ()
  {
    window.locale = $(this).text().toLowerCase();
    update_translations($(this).text());
  });

  if (window.location.hash)
  {
    if (window.location.hash.substr(1) == 'ka' || window.location.hash.substr(1) == 'en')
    {
      window.locale = window.location.hash.substr(1);
      update_translations();
    }
  }

});
