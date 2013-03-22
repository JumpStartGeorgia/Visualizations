$(function ()
{

  var i = 0;
  $('#clock .h div, .content .item.default .inner').each(function ()
  {
    var _this = $(this);
    setTimeout(function ()
    {
      if (_this.hasClass('inner'))
      {
        _this.css({display: 'inline-block', opacity: 0});
        _this.animate({opacity: 1}, 'fast');
      }
      _this.find('img:first').fadeIn('fast'); 
    }, i * 100);
    i ++;
  });

  var t = [];
  for (j = i - 1; j < i + 11; j ++)
  {
    var index = j - 12;
    var reali = (index == 0) ? 11 : (index - 1);
    t.push(setTimeout(function (index)
    {
      clock_h_click_handler($('#clock .h div:eq(' + index + ')').get(0));
    },
    i * 100 + 5000 + index * 5000,
    reali));
  }

  $('#clock .h div').click(function ()
  {
    for (i in t)
    {
      clearTimeout(t[i]);
    }
    clock_h_click_handler(this);
  });

  function clock_h_click_handler (el)
  {
    var i = +$(el).index() + 1;
    $('#clock .arrow')
    .removeClass(function (index, classname)
    {
      return (classname.match (/p[0-9]+/) || []).join(' ');
    })
    .addClass('p' + i)
    .css('transform', 'rotate(' + (+i * 30) + 'deg)')
    .show();

    texts[locale].content[i].positive = texts[locale].content[i].positive || ''; 
    texts[locale].content[i].negative = texts[locale].content[i].negative || ''; 

    $('.content .item')
    .removeClass('active')
    .filter('.i')
    .addClass('active')
    .find('.text .positive')
    .html(texts[locale].content[i].positive.replace(/\n/g, '<br />'))
    .siblings('.negative')
    .html(texts[locale].content[i].negative.replace(/\n/g, '<br />'));

    $('.content .item .img > div').hide().filter('.i' + i).show();

    $(el).addClass('active').siblings().removeClass('active');
  }

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


    var i = +$('#clock .h div.active').index() + 1;
console.log ('var i = ' + i);
    if (i > 0)
    {
console.log ('- updating middle text');
      texts[locale].content[i].positive = texts[locale].content[i].positive || ''; 
      texts[locale].content[i].negative = texts[locale].content[i].negative || ''; 
      $('.content .item.i')
      .find('.text .positive')
      .html(texts[locale].content[i].positive.replace(/\n/g, '<br />'))
      .siblings('.negative')
      .html(texts[locale].content[i].negative.replace(/\n/g, '<br />'));
    }

    $('.content .item.default')
    .removeClass(to)
    .addClass(locale)
    .find('.text:first')
    .html(texts[locale].content['default'].short)
    .siblings('.text')
    .html(texts[locale].content['default'].long);

    $('html').attr('lang', locale);

    $('.header img').attr('src', $('.header img').attr('src').replace('_' + to, '_' + locale));
    document.title = texts[locale].title;

    $('#js_link').attr('href', 'http://jumpstart.ge/' + locale);
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
