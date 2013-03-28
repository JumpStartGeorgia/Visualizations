

$(document).ready(function() {
  function set_chart_width(){
    $('#chart_container').css('width', $(window).width()-$('#explanation').width()-$('#chart_nav').width()-60);
  }

  create_main_chart();

  function redraw_map(link_ref){
    chart_type = $(link_ref).data('type');
    $('#main_chart').highcharts().destroy();
    create_main_chart();
    $('#chart_nav li').removeClass('active');        
    $('#chart_nav li#' + chart_type).addClass('active');        
  }

  $('#chart_nav a').click(function(){
    redraw_map(this)
    return false;
  });

  $(window).bind('resize', set_chart_width);

  function update_translations (init)
  {
    var to = (locale == 'en') ? 'ka' : 'en';
    $('.locale a').text(to.toUpperCase());
    window.setTimeout(function (){ $('.locale a').attr('href', '#' + to); }, 50);

    $('#header h1').html(translations[locale].title);
    document.title = translations[locale].title;

    $('#explanation1').html(translations[locale].side_text['1']);
    $('#explanation2').html(translations[locale].side_text['2']);

    $('#trust a').html(translations[locale].groups.trust);
    $('#distrust a').html(translations[locale].groups.distrust);
    $('#partial a').html(translations[locale].groups.partial);
    $('#not_know a').html(translations[locale].groups.not_know);

    redraw_map($('#chart_nav li.active a'));  

    $('#box1').html(translations[locale].box['1']);
    $('#box2').html(translations[locale].box['2']);
    $('#box3').html(translations[locale].box['3']);
    $('#box4').html(translations[locale].box['4']);

    $('#og_title').attr('content', translations[locale].title);
    $('#og_site_name').attr('content', translations[locale].title);
    $('#og_description').attr('content', translations[locale].side_text['1'] + ' ' + translations[locale].side_text['2']);

    $('.locale a').attr('title', translations[locale].lang_switcher);

    $('html').attr('lang', locale);

    $('.js_link').attr('href', 'http://jumpstart.ge/' + locale);

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
