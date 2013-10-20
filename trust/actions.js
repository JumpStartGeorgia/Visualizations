

$(window).load(function() {
/*
["images/categories/rel.png", "images/categories/army.png", "images/categories/police.png", "images/categories/ex_gov.png", "images/categories/ed.png", "images/categories/parl.png", "images/categories/eu.png", "images/categories/un.png", "images/categories/health.png", "images/categories/banks.png", "images/categories/omb.png", "images/categories/local_gov.png", "images/categories/pres.png", "images/categories/ngo.png", "images/categories/media.png", "images/categories/courts.png", "images/categories/pol_parties.png"]
*/
  create_main_chart();

  function redraw_map(link_ref){
    chart_type = $(link_ref).data('type');
    $('#main_chart').highcharts().destroy();
    create_main_chart();
    $('#chart_nav li').removeClass('active');        
    $('#chart_nav li#' + chart_type).addClass('active');        
    $('#chart_nav li img').each(function(){
      $(this).attr('src', $(this).attr('src').replace('_active', ''))
    });
    $('#chart_nav li.active img').attr('src', 'images/' + chart_type + '_active.png');
  }

  $('#chart_nav a').click(function(){
    redraw_map(this)
    return false;
  });

  $('#main_chart').mouseout(function(){
    $('#tooltip').hide();
  });



  function update_translations (init)
  {
    var to = (locale == 'en') ? 'ka' : 'en';
    $('.locale a').text(to.toUpperCase());
    window.setTimeout(function (){ $('.locale a').attr('href', '#' + to); }, 50);

    $('#header h1 span').html(translations[locale].title);
    document.title = translations[locale].title;

    $('#explanation1').html(translations[locale].side_text['1']);
    $('#explanation2').html(translations[locale].side_text['2']);

    $('#trust a span').html(translations[locale].groups.trust);
    $('#distrust a span').html(translations[locale].groups.distrust);
    $('#partial a span').html(translations[locale].groups.partial);
    $('#not_know a span').html(translations[locale].groups.not_know);

    redraw_map($('#chart_nav li.active a'));  

    $('#box1 img').attr('alt',translations[locale].box['1']);
    $('#box1 img').attr('src', 'images/box/' + locale + '/1.png');
    $('#box2 img').attr('alt',translations[locale].box['2']);
    $('#box2 img').attr('src', 'images/box/' + locale + '/2.png');
    $('#box3 img').attr('alt',translations[locale].box['3']);
    $('#box3 img').attr('src', 'images/box/' + locale + '/3.png');
    $('#box4 img').attr('alt',translations[locale].box['4']);
    $('#box4 img').attr('src', 'images/box/' + locale + '/4.png');

    $('#og_title').attr('content', translations[locale].title);
    $('#og_site_name').attr('content', translations[locale].title);
    $('#og_description').attr('content', translations[locale].side_text['1'] + ' ' + translations[locale].side_text['2']);
    $('#og_image').attr('content', 'http://visuals.jumpstart.ge/trust/images/trust_fb_' + locale + '.png');

    $('.locale a').attr('title', translations[locale].lang_switcher);

    $('html').attr('lang', locale);

    $('.js_link').attr('href', 'http://jumpstart.ge/' + locale);

    $('#source span').html(translations[locale].source.title);
    $('#source a').html(translations[locale].source.link_text);
    $('#source a').attr('href', translations[locale].source.link);
  }

  $('.locale a').click(function ()
  {
    window.locale = $(this).text().toLowerCase();
    update_translations(false);
  });

  if (window.location.hash)
  {
    if (window.location.hash.substr(1) == 'ka' || window.location.hash.substr(1) == 'en')
    {
      window.locale = window.location.hash.substr(1);
      update_translations(true);
    }
  }
});

  function set_chart_width(){
    if ($(window).width() >= 1170){
      $('#chart_container').css('width', $(window).width()-$('#explanation').width()-$('#chart_nav').width()-70);
    } else {
      $('#chart_container').css('width', $(window).width()-$('#chart_nav').width()-70);
    }
  }

  function set_img_box_width(){
    var img_width = 361;
    if ($(window).width() >= 1560){
      $('#bottom_container > div').css('width', img_width);
    } else if ($(window).width() >= 1430){
      $('#bottom_container > div').css('width', img_width * 0.9);
    } else if ($(window).width() >= 1300){
      $('#bottom_container > div').css('width', img_width * 0.85);
    } else if ($(window).width() >= 1230){
      $('#bottom_container > div').css('width', img_width * 0.8);
    } else if ($(window).width() >= 1120){
      $('#bottom_container > div').css('width', img_width * 0.7);
    } else if ($(window).width() >= 980){
      $('#bottom_container > div').css('width', img_width * 0.6);
    } else {
      $('#bottom_container > div').css('width', img_width * 0.5);
    }
  }

  $(window).bind('resize', set_chart_width);
  $(window).bind('load resize', set_img_box_width);

