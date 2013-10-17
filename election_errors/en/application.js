  var topRange = 200;  // measure from the top of the viewport to X pixels down
  var edgeMargin = 20;
  var menu_text = [];
  var menu_position = [];
  var menu_section = [];
  var css_class = '';

  // highlight correct menu item based on position
  function highlight_correct_menu_item(){
    var winTop = $(window).scrollTop();
    for(var i=0;i<menu_position.length;i++){
     if ( winTop >= menu_position[i] && (i == menu_position.length-1 || (i < menu_position.length && winTop < menu_position[i+1]))){
      $('#sidebar #menu li')
       .removeClass('active')
       .eq(i).addClass('active');

      $('#slide_menu ul li')
      .removeClass('active')
       .eq(i).addClass('active');

       break;

     }
    }
  }



// adjust location of legend in maps
function adjust_legend_placement(){
  var scrn_width = $(window).width();  

  // adjust country legend
  // - reset to default values first
  $('#page10 #map').css('margin-bottom', '0px');
  $('#page10 #legend ul').css('margin-left', '0');
  $('#page10 #legend').css('top', '150px');
  $('#page10 #legend ul li').css('display', 'block').css('margin-right', '0px');
  $('#page11 #map').css('margin-bottom', '0px');
  $('#page11 #legend').css('top', '150px');
  $('#page11 #legend ul').css('margin-left', '0');
  $('#page11 #legend ul li').css('display', 'block').css('margin-right', '0px');


  if (scrn_width > 1900){
    $('#page10 #legend ul').css('margin-left', '125px');
    $('#page11 #legend ul').css('margin-left', '125px');
  }else if (scrn_width > 1800){
    $('#page10 #legend ul').css('margin-left', '100px');
    $('#page11 #legend ul').css('margin-left', '100px');
  }else if (scrn_width > 1700){
    $('#page10 #legend ul').css('margin-left', '75px');
    $('#page11 #legend ul').css('margin-left', '75px');
  }else if (scrn_width > 1600){
    $('#page10 #legend ul').css('margin-left', '50px');
    $('#page11 #legend ul').css('margin-left', '50px');
  }else if (scrn_width > 1500){
    $('#page10 #legend ul').css('margin-left', '25px');
    $('#page11 #legend ul').css('margin-left', '25px');
  }else if (scrn_width > 1350){
    $('#page10 #legend ul').css('margin-left', '0');
    $('#page11 #legend ul').css('margin-left', '0');
  }else{
    $('#page10 #map').css('margin-bottom', '75px');
    $('#page10 #legend').css('top', '360px');
    $('#page10 #legend ul li').css('display', 'inline-block').css('margin-right', '10px');

    $('#page11 #map').css('margin-bottom', '75px');
    $('#page11 #legend').css('top', '360px');
    $('#page11 #legend ul li').css('display', 'inline-block').css('margin-right', '10px');
  
  }

  // adjust gori legend
  if (scrn_width > 1700){
    $('#page12 #legend ul').css('margin-left', '45px');
  } else if (scrn_width > 1350) {
    $('#page12 #legend ul').css('margin-left', '25px');
  } else if (scrn_width > 1175) {
    $('#page12 #legend ul').css('font-size', '13px').css('margin-left', '15px');
  } else if (scrn_width > 975) {
    $('#page12 #legend ul').css('font-size', '11px').css('margin-left', '5px');
  } else  {
    $('#page12 #legend ul').css('font-size', '9px').css('margin-left', '0');
  }  
}

/////////////////////////////////////////


function compute_scroll_top(parent, child){
  if ($(window).scrollTop() > child){
    return parent;
  } else{
    return child;
  }
}

$(window).load(function ()
{
  adjust_legend_placement();

  var controller = $.superscrollorama({
    triggerAtCenter: false,
    playoutAnimations: true
  });

  // fix placements when window resizes
  window.onresize = function()
  {
//    adjust_legend_placement();
    window.location.reload();
  }


  // if screen size is too small, show message
  if ($(window).width() < 950){
    $.fancybox({
		  fitToView	: true,
		  autoSize	: true,
		  href: '#screen_size'
	  });
	    
//    $('#screen_size').show();
  }



  // popup menu
  $("#popup_menu_button img").click(function () {
    $("#slide_menu").animate({width:'toggle'},340);
  });

  /////////////////////////////////////////////////
  
  

  // if click on question mark, go to that place
  $('#question_marks > div:nth-child(1) > img').click(function ()
  {
    $('html, body').animate({scrollTop: compute_scroll_top($('#page5a').offset().top, $('#page5a #stations').offset().top) });
  });
  $('#question_marks > div:nth-child(2) > img').click(function ()
  {
    $('html, body').animate({scrollTop: compute_scroll_top($('#page6').offset().top, $('#page6 .middle').offset().top) });
  });
  $('#question_marks > div:nth-child(3) > img').click(function ()
  {
    $('html, body').animate({scrollTop: compute_scroll_top($('#page6a').offset().top, $('#page6a .middle').offset().top + 100) });
  });
  $('#question_marks > div:nth-child(4) > img').click(function ()
  {
    $('html, body').animate({scrollTop: compute_scroll_top($('#page7 .top').offset().top, $('#page7 .bottom').offset().top) });
  });
  $('#question_marks > div:nth-child(5) > img').click(function ()
  {
    $('html, body').animate({scrollTop: compute_scroll_top($('#page8').offset().top, $('#page8 .after').offset().top) });
  });


  // if click on fix, go to that place
  $('#line_fix > div:nth-child(1) > img').click(function ()
  {
    $('html, body').animate({scrollTop: compute_scroll_top($('#page15').offset().top, $('#page15 .middle').offset().top) });
  });
  $('#line_fix > div:nth-child(2) > img').click(function ()
  {
    $('html, body').animate({scrollTop: compute_scroll_top($('#page16').offset().top, $('#page16 .middle').offset().top) });
  });
  $('#line_fix > div:nth-child(3) > img').click(function ()
  {
    $('html, body').animate({scrollTop: compute_scroll_top($('#page16a').offset().top, $('#page16a .item2').offset().top) });
  });
  $('#line_fix > div:nth-child(4) > img').click(function ()
  {
    $('html, body').animate({scrollTop: compute_scroll_top($('#page16').offset().top, $('#page16 .middle').offset().top) });
  });
  $('#line_fix > div:nth-child(5) > img').click(function ()
  {
    $('html, body').animate({scrollTop: compute_scroll_top($('#page17').offset().top, $('#page17 .after').offset().top) });
  });




///////////////////////////////////

  controller.addTween(
    $('#page1'),
    (new TimelineMax()).append(TweenMax.fromTo($('#page1 #scroll_down, #explanation'), .5, {css: {opacity: 1}}, {css: {opacity: 0}}))
  );




/////////////////////////////////
  var pinh = 2500;
  controller.pin($('#page2'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.to($('#page2 .bottom'), .5, {css:{top: 0}}))
          .append(TweenMax.to($('#page2 .top'), .5, {css:{opacity: 1}})),
    onPin: function ()
    {
      $('#page2-spacer').hide();
    },
    onUnpin: function ()
    {
      if ($('#page2').offset().top > $(window).scrollTop())
      {
        $('#page2-spacer').show();
      }
    }
  });
  $('#page2').after('<div id="page2-spacer"></div>').next().height(pinh);




/////////////////////////////////
  var pinh = 2500;
  controller.pin($('#page2a'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page2a .top .title'), .5, {css:{top: 800}}, {css:{top: 0}}))
          .append(TweenMax.fromTo($('#page2a .top .eq1'), .5, {css:{top: 800}}, {css:{top: 0}}))
          .append(TweenMax.fromTo($('#page2a .top .or').add($('#page2a .top .eq2')), .5, {css:{top: 800}}, {css:{top: 0}}))
          .append(TweenMax.fromTo($('#page2a .bottom'), .5, {css: {opacity: 0}}, {css: {opacity: 1}})),
    onPin: function ()
    {
      $('#page2a-spacer').hide();
    },
    onUnpin: function ()
    {
      if ($('#page2a').offset().top > $(window).scrollTop())
      {
        $('#page2a-spacer').show();
      }
    }
  });
  $('#page2a').after('<div id="page2a-spacer"></div>').next().height(pinh);


/////////////////////////////////

  $('#ballots .all').css({right: $(window).width() - $('#ballots .all').offset().left - $('#ballots .all').width()});
  controller.pin($('#ballots .all'), 9e5, {
    pushFollowers: false
  });

  var i = $('#ballots .list li').length;
  while (i --)
  {
    controller.addTween(
      $('#ballots .list li').eq(i).children('.mark'),
      (new TimelineMax()).append([
        TweenMax.to($('#ballots .list li').eq(i).children('.mark'), .001, {css: {visibility: 'hidden'}}),
        TweenMax.to($('#ballots .all li').eq(i), .001, {css: {visibility: 'visible'}})
      ])
    );
  }

  // if click on main election icons, go to that section
  $('#ballots .all li').click(function ()
  {
    $('html, body').animate({scrollTop: $('#ballots .list li').eq($(this).index()).offset().top - $(this).closest('.all').height()});
  });
  


/////////////////////////////////




  //controller.pin($('#question_marks').parent(), 9e5);



/*
  var pinh = 3300;
  controller.pin($('#page5'), pinh, {
    anim: (new TimelineMax())
          //.append(TweenMax.fromTo($('#page5'), .5, {}, {css: {transform: 'translate(0px, -' + $('#page5 > header').outerHeight(true) + 'px)'}}))
          //.append(TweenMax.fromTo($('#stations').parent().add('#page5-subtitle'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page5-subtitle'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#stations').parent(), .5, {css: {position: 'relative', top: 900}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#stations-connect'), .5, {css:{top: 700}}, {css:{top: -42}}))
          .append(TweenMax.to($('#stations-connect #line1'), .5, {css:{top: -100, opacity: 0}}))
          .append(TweenMax.fromTo($('#stations-connect .img img:last-of-type, #stations-connect .right'), .5, {css:{top: 700}}, {css:{top: 0}}))
          .append(TweenMax.fromTo($('#page5 footer'), .5, {css: {opacity: 0}}, {css: {opacity: 1}})),
    onPin: function ()
    {
      $('#page5-spacer').hide();
      $('#ballots .all li:first').css({opacity: 1});
    },
    onUnpin: function ()
    {
      if ($('#page5').offset().top > $(window).scrollTop())
      {
        $('#page5-spacer').show();
      }
      $('#ballots .all li:first').css({opacity: .6});
    }
  });
  $('#page5').after('<div id="page5-spacer"></div>').next().height(pinh);

*/

  controller.addTween(
    $('#page5'),
    (new TimelineMax()).append([
      TweenMax.to($('#question_marks').parent(), .001, {css: {position: 'fixed', width: 'auto', left: $('#sidebar').width(), right: 0, zIndex: 9999, top: $('#ballots .all').outerHeight()}}),
      TweenMax.to($('#question_marks_spacer'), .001, {css: {height: $('#question_marks').parent().outerHeight(true)}})
    ])
  );
  
/*
  controller.addTween(
    $('#page5'),
    TweenMax.to($('#ballots .all li:first'), .5, {css: {opacity: 1}})
  );
*/



/////////////////////////////////////////////////////

  var pinh = 3300;
  controller.pin($('#page5a'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page5a .top'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page5a #stations').parent(), .5, {css: {position: 'relative', top: 900}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page5a #stations-connect'), .5, {css:{top: 700}}, {css:{top: 0}}))
          .append(TweenMax.fromTo($('#page5a #stations-connect .img img:last-of-type, #page5a #stations-connect .right'), .5, {css:{top: 700}}, {css:{top: 0}}))
          .append(TweenMax.fromTo($('#page5a .bottom'), .5, {css: {opacity: 0}}, {css: {opacity: 1}})),
    onPin: function ()
    {
      $('#page5a-spacer').hide();
      $('#ballots .all li:first').css({opacity: 1});
    },
    onUnpin: function ()
    {
      if ($('#page5a').offset().top > $(window).scrollTop())
      {
        $('#page5a-spacer').show();
      }
      $('#ballots .all li:first').css({opacity: .6});
    }
  });
  $('#page5a').after('<div id="page5a-spacer"></div>').next().height(pinh);



/////////////////////////////////


  var pinh = 2000;
  controller.pin($('#page6'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page6 header h4').add('#page6 .problem2_img'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page6 .middle .left'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page6 .middle .right'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page6 .bottom'), .5, {css: {opacity: 0}}, {css: {opacity: 1}})),
    onPin: function ()
    {
      $('#page6-spacer').hide();
      $('#ballots .all li:eq(4)').css({opacity: 1});
    },
    onUnpin: function ()
    {
      if ($('#page6').offset().top > $(window).scrollTop())
      {
        $('#page6-spacer').show();
      }
      $('#ballots .all li:eq(4)').css({opacity: .6});
    }
  });
  $('#page6').after('<div id="page6-spacer"></div>').next().height(pinh);





/*
  controller.addTween(
    $('#page6'),
    (new TimelineMax()).append([
      TweenMax.to($('#ballots .all li:first'), .5, {css: {opacity: .6}}),
      TweenMax.to($('#ballots .all li:eq(4)'), .5, {css: {opacity: 1}})
    ])
  );
*/


/////////////////////////////////


  var pinh = 2000;
  controller.pin($('#page6a'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page6a header h4').add('#page6a .problem3_img'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page6a .middle .center'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page6a .middle .left'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page6a .middle .right'), .5, {css: {opacity: 0}}, {css: {opacity: 1}})),
    onPin: function ()
    {
      $('#page6a-spacer').hide();
      $('#ballots .all li:eq(5)').css({opacity: 1});
    },
    onUnpin: function ()
    {
      if ($('#page6a').offset().top > $(window).scrollTop())
      {
        $('#page6a-spacer').show();
      }
      $('#ballots .all li:eq(5)').css({opacity: .6});
    }
  });
  $('#page6a').after('<div id="page6a-spacer"></div>').next().height(pinh);



/////////////////////////////////



  controller.addTween($('#page7'), TweenMax.fromTo($('#page7 > .top'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}), 300);

  controller.pin($('#page7 > .top'), $('#page7').height(), {
    pushFollowers: false,
    offset: -($('#question_marks').parent().height() + $('#ballots .all').height()),
    onPin: function ()
    {
      $('#ballots .all li:eq(6)').css({opacity: 1});
    },
    onUnpin: function ()
    {
      $('#ballots .all li:eq(6)').css({opacity: .6});
    }
  });
  $(window).load(function ()
  {
    controller.updatePin($('#page7 > .top'), $('#page7').height(), {
      pushFollowers: false,
      offset: -($('#question_marks').parent().height() + $('#ballots .all').height())
    });
  });



/*
  $('#page7 > .top').css({zIndex: 9e4, right: 0});
  controller.pin($('#page7 > .top'), 9e5, {
    pushFollowers: false
  });
*/


/*
  controller.addTween(
    $('#page7'),
    (new TimelineMax()).append([
      TweenMax.to($('#ballots .all li:eq(4)'), .5, {css: {opacity: .6}}),
      TweenMax.to($('#ballots .all li:eq(5)'), .5, {css: {opacity: 1}})
    ])
  );
*/

  $('#protocol6-container .bottom').height($('#protocol6-container .bottom').height());






/////////////////////////////////

  var pinh = 1500;
  controller.pin($('#page8'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page8 > .top'), .3, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.to($('#page8 > .top'), .001, {css: {position: 'fixed', width: 'auto', left: $('#sidebar').width(), right: 0, zIndex: 9999, top: $('#ballots .all').outerHeight() + $('#question_marks').parent().height()}}))
          .append(TweenMax.fromTo($('#page8 .after'), .5, {css: {top: 800}}, {css: {top: 0}})),
    onPin: function ()
    {
      $('#page8-spacer').hide();
      $('#ballots .all li:eq(8)').css({opacity: 1});
    },
    onUnpin: function ()
    {
      if ($('#page8').offset().top > $(window).scrollTop())
      {
        $('#page8-spacer').show();
      }
      $('#ballots .all li:eq(8)').css({opacity: .6});
    }
  });
  $('#page8').after('<div id="page8-spacer"></div>').next().height(pinh);



  var pinh = 2500;
  controller.pin($('#page8a'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page8a .spreadsheet'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8a .spreadsheet li:nth-child(1)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8a .spreadsheet li:nth-child(2)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8a .spreadsheet li:nth-child(3)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8a .spreadsheet li:nth-child(4)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8a .spreadsheet li:nth-child(5)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8a .spreadsheet li:nth-child(6)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8a .spreadsheet li:nth-child(7)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8a .spreadsheet-bottom-text'), .5, {css: {top: 800}}, {css: {top: 0}})),
    onPin: function ()
    {
      $('#page8a-spacer').hide();
    },
    onUnpin: function ()
    {
      if ($('#page8a').offset().top > $(window).scrollTop())
      {
        $('#page8a-spacer').show();
      }
    }
  });
  $('#page8a').after('<div id="page8a-spacer"></div>').next().height(pinh);

  
  controller.addTween(
    $('#page8d'),
    (new TimelineMax()).append([
      TweenMax.to($('#page8 > .top'), .001, {css: {zIndex: 'auto', display: 'none'}}),
      TweenMax.to($('#ballots .all li:eq(7)'), .001, {css: {opacity: .6}})
    ])
  );



/////////////////////////////////

/*
  var ph = $('#page10 header');
  ph.wrap('<div style="position: relative; height: ' + ph.outerHeight() + 'px;"></div>').css({position: 'absolute', left: 0});
  controller.addTween(ph, TweenMax.to($('#page10 header'), .01, {css: {position: 'fixed', left: 90, top: 70}}), 0);

  var cs = $('#page10 #country_stats');
  cs.wrap('<div style="position: relative; height: ' + cs.outerHeight() + 'px;"></div>').css({position: 'absolute', right: 0, left: 0, zIndex: 100});
  controller.pin(cs, 2000, {
    pushFollowers: false,
    offset: -110,
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page10 [id*="district_amount"]'), .5, {css: {position: 'relative', top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page10 [id*="district_percent"]'), .5, {css: {opacity: 1}}, {css: {opacity: 1}}))
  });
*/




  var pinh = 2500;
  controller.pin($('#page10'), pinh, {
    anim: (new TimelineMax())
            .append([
              TweenMax.to($('#page10 header'), .01, {css: {position: 'fixed', right: 0, left: 90, top: 70}}),
              TweenMax.to($('#page10 #map_text'), .01, {css: {marginTop: '+=' + $('#page10 header').height()}})
            ])
            .append(TweenMax.to($('#page10 #map_text'), .5, {delay: 1, css: {marginTop: '-=420'}}))
            .append(TweenMax.fromTo($('#page10 [id*="district_amount"]'), .5, {css: {position: 'relative', top: 800}}, {css: {top: 0}}))
            .append(TweenMax.fromTo($('#page10 [id*="district_percent"]'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
            .append(TweenMax.to($('#page10 header'), .01, {css: {position: 'absolute', left: 0}})),
    onPin: function ()
    {
      $('#page10-spacer').hide();
    },
    onUnpin: function ()
    {
      if ($('#page10').offset().top > $(window).scrollTop())
      {
        $('#page10-spacer').show();
      }
    }
  });
  $('#page10').after('<div id="page10-spacer"></div>').next().height(pinh);

/////////////////////////////////


  var pinh = 2500;
  controller.pin($('#page11'), pinh, {
    anim: (new TimelineMax())
            .append([
              TweenMax.to($('#page11 header'), .001, {css: {position: 'fixed', right: 0, left: 90, top: 70}}),
              TweenMax.to($('#page11 #map_text'), .01, {css: {marginTop: '+=' + $('#page11 header').height()}})
            ])
            .append(TweenMax.to($('#page11 #map_text'), .5, {delay: 1, css: {marginTop: '-=429'}}))
            .append(TweenMax.fromTo($('#page11 [id*="district_amount"]'), .5, {css: {position: 'relative', top: 800}}, {css: {top: 0}}))
            .append(TweenMax.fromTo($('#page11 [id*="district_percent"]'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
            .append(TweenMax.to($('#page11 header'), .01, {css: {position: 'absolute', left: 0}})),
    onPin: function ()
    {
      $('#page11-spacer').hide();
    },
    onUnpin: function ()
    {
      if ($('#page11').offset().top > $(window).scrollTop())
      {
        $('#page11-spacer').show();
      }
    }
  });
  $('#page11').after('<div id="page11-spacer"></div>').next().height(pinh);

/////////////////////////////////


  var pinh = 2500;
  controller.pin($('#page12'), pinh, {
    anim: (new TimelineMax())
            .append([
              TweenMax.to($('#page12 header'), .01, {css: {position: 'fixed', right: 0, left: 90, top: 70}}),
              TweenMax.to($('#page12 #intro'), .01, {css: {marginTop: '+=' + $('#page12 header').height()}})
            ])
            .append(TweenMax.to($('#page12 #intro'), .5, {delay: 1, css: {marginTop: '-=' + ($('#page12 #map').offset().top + $('#page12 #map').outerHeight(true) - $('#intro').offset().top + parseInt($('#intro').css('marginTop')) + 30)}}))
            .append(TweenMax.fromTo($('#page12 #polling_station_stats_text'), .5, {css: {position: 'relative', top: 800}}, {css: {top: 0}}))
            .append(TweenMax.fromTo($('#page12 .polling_station_stats'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
            .append(TweenMax.from($('#page12 .polling_station_stats .connector'), .5, {css: {width: 0}}))
            .append(TweenMax.to($('#page12 header'), .01, {css: {position: 'absolute', left: 0}})),
    onPin: function ()
    {
      $('#page12-spacer').hide();
    },
    onUnpin: function ()
    {
      if ($('#page12').offset().top > $(window).scrollTop())
      {
        $('#page12-spacer').show();
      }
    }
  });
  $('#page12').after('<div id="page12-spacer"></div>').next().height(pinh);

/////////////////////////////////


  var pinh = 2500;
  controller.pin($('#page13'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.to($('#page13 #line2'), .5, {css:{top: 0}}))
          .append(TweenMax.to($('#page13 #line3'), .5, {css:{top: 0}})),
    onPin: function ()
    {
      $('#page13-spacer').hide();
    },
    onUnpin: function ()
    {
      if ($('#page13').offset().top > $(window).scrollTop())
      {
        $('#page13-spacer').show();
      }
    }
  });
  $('#page13').after('<div id="page13-spacer"></div>').next().height(pinh);


/////////////////////////////////////



  controller.addTween(
    $('#page14'),
    (new TimelineMax()).append([
      TweenMax.to($('#line_fix').parent(), .001, {css: {position: 'fixed', width: 'auto', left: $('#sidebar').width(), right: 0, zIndex: 9999, top: $('#ballots .all').outerHeight() + $('#question_marks').parent().height()}}),
      TweenMax.to($('#line_fix_spacer'), .001, {css: {height: $('#line_fix').parent().outerHeight(true)}}),
      TweenMax.to($('#question_marks img'), .001, {css: {opacity: .6}})
    ])
  );
  



///////////////////////////////////////



  var pinh = 2500;
  controller.pin($('#page15'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page15 .top'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page15 .middle .left').add($('#page15 .middle .right')), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page15 .center .center-top'), .5, {css: {left: -800, opacity: 0}}, {css: {left: 0, opacity: 1}}))
          .append(TweenMax.fromTo($('#page15 .center .center-bottom'), .5, {css: {right: -800, opacity: 0}}, {css: {right: 0, opacity: 1}})),
    onPin: function ()
    {
      $('#page15-spacer').hide();
      $('#ballots .all li:first').css({opacity: 1});
    },
    onUnpin: function ()
    {
      if ($('#page15').offset().top > $(window).scrollTop())
      {
        $('#page15-spacer').show();
      }
      $('#ballots .all li:first').css({opacity: .6});
    }
  });
  $('#page15').after('<div id="page15-spacer"></div>').next().height(pinh);


/* ORIGINAL VERSION 
  var pinh = 3300;
  var big_circle_radius = $('#page15 .middle #circles .left .circle').css('width').replace('px', '')/2;
  var little_circle_radius = $('#page15 .middle #circles .right .circle').css('width').replace('px', '')/2;
  var box_width = $('#page15 .middle #circles .right').css('width').replace('px', '');
  var move_left = (box_width/2 - big_circle_radius) + (2*little_circle_radius) + (box_width/2 - little_circle_radius);
  controller.pin($('#page15'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page15 .top'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page15 .middle #text'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page15 .middle #circles'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append([
            TweenMax.to($('#page15 .middle #circles .right .circle > div'), .5, {css: {opacity: 0 }}),
            TweenMax.to($('#page15 .middle #circles .right'), .5, {css: {left: -(move_left) }})
          ])
          .append(TweenMax.fromTo($('#page15 .or'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page15 .bottom #text'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page15 .bottom #circles'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append([
            TweenMax.to($('#page15 .bottom #circles .right .circle #text1'), .01, {css: {display: 'none'}}),
            TweenMax.to($('#page15 .bottom #circles .right .circle'), .5, {css: {fontSize: '29px', lineHeight: '38px', padding: "48px 10px", backgroundColor: "#e15e32", width: '208px', height: '208px'}}),
            TweenMax.to($('#page15 .bottom #circles .right'), .5, {css: {paddingTop: 0}})
          ])
          .append(TweenMax.to($('#page15 .bottom #circles .right .circle #text2'), .01, {css: {display: 'inline'}})),
    onPin: function ()
    {
      $('#page15-spacer').hide();
      $('#ballots .all li:first').css({opacity: 1});
    },
    onUnpin: function ()
    {
      if ($('#page15').offset().top > $(window).scrollTop())
      {
        $('#page15-spacer').show();
      }
      $('#ballots .all li:first').css({opacity: .6});
    }
  });
  $('#page15').after('<div id="page15-spacer"></div>').next().height(pinh);

*/

//////////////////////////////////////


  var pinh = 3500;
  controller.pin($('#page16'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page16 header h3').add('#page16 .line_fix24_img'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page16 .middle'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page16 .bottom .left'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page16 .bottom .right'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page16 .bottom2 .left'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page16 .bottom2 .middle'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page16 .bottom2 .right'), .5, {css: {top: 800}}, {css: {top: 0}})),
    onPin: function ()
    {
      $('#page16-spacer').hide();
      $('#ballots .all li:eq(4)').css({opacity: 1});
      $('#ballots .all li:eq(6)').css({opacity: 1});
    },
    onUnpin: function ()
    {
      if ($('#page16').offset().top > $(window).scrollTop())
      {
        $('#page16-spacer').show();
      }
      $('#ballots .all li:eq(4)').css({opacity: .6});
      $('#ballots .all li:eq(6)').css({opacity: .6});
    }
  });
  $('#page16').after('<div id="page16-spacer"></div>').next().height(pinh);


//////////////////////////////////////


  var pinh = 2000;
  controller.pin($('#page16a'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page16a header h3').add('#page16a .line_fix3_img'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page16a .title'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page16a .item1'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page16a .item2'), .5, {css: {top: 800}}, {css: {top: 0}})),
    onPin: function ()
    {
      $('#page16a-spacer').hide();
      $('#ballots .all li:eq(5)').css({opacity: 1});
    },
    onUnpin: function ()
    {
      if ($('#page16a').offset().top > $(window).scrollTop())
      {
        $('#page16a-spacer').show();
      }
      $('#ballots .all li:eq(5)').css({opacity: .6});
    }
  });
  $('#page16a').after('<div id="page16a-spacer"></div>').next().height(pinh);



////////////////////////////////////////


  var pinh = 2000;
  controller.pin($('#page17'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page17  > .top'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page17 .middle #text'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page17 .middle #eq_header'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page17 .middle #eq_circle'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page17 .bottom'), .5, {css: {top: 800}}, {css: {top: 0}})),
    onPin: function ()
    {
      $('#page17-spacer').hide();
      $('#ballots .all li:eq(7)').css({opacity: 1});
    //$('#ballots .all').add($('#line_fix').parent()).add($('#question_marks').parent()).show();
    },
    onUnpin: function ()
    {
      if ($('#page17').offset().top > $(window).scrollTop())
      {
        $('#page17-spacer').show();
      }
      $('#ballots .all li:eq(7)').css({opacity: .6});
    //$('#ballots .all').add($('#line_fix').parent()).add($('#question_marks').parent()).hide();
    }
  });
  $('#page17').after('<div id="page17-spacer"></div>').next().height(pinh);


//////////////////////////////////////

  controller.addTween($('#page18'), TweenMax.fromTo($('#ballots .all'), .1, {css: {top: 0}}, {css: {top: '-=100', display: 'none'}}), 100, -200);
  controller.addTween($('#page18'), TweenMax.to($('#line_fix').parent().add($('#question_marks').parent()), .1, {css: {top: '-=100', display: 'none'}}), 100, -200);

//////////////////////////////////////



  var pinh = 2500;
  controller.pin($('#page18'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.to($('#page18 .caret'), .05, {css:{opacity: 0}}))
          .append(TweenMax.fromTo($('#page18 #line2'), .5, {css:{top: 1000}}, {css:{top: 0}}))
          .append(TweenMax.fromTo($('#page18 #line3'), .5, {css:{top: 1000}}, {css:{top: 0}}))
          .append(TweenMax.fromTo($('#page18 #line4'), .5, {css:{top: 1000}}, {css:{top: 0}}))
          .append(TweenMax.fromTo($('#page18 #by_js'), .5, {css:{opacity: 0}}, {css:{opacity: 1}})),
          //.append(TweenMax.fromTo($('#page18 #sources'), .5, {css:{opacity: 0}}, {css:{opacity: 1}})),
    onPin: function ()
    {
      $('#page18-spacer').hide();
    },
    onUnpin: function ()
    {
      if ($('#page18').offset().top > $(window).scrollTop())
      {
        $('#page18-spacer').show();
      }
    }
  });
  $('#page18').after('<div id="page18-spacer"></div>').next().height(pinh);




////////////////////////////////
  // create the menu

  $('header').each(function(){menu_position.push($(this).offset().top)});
  $('header').each(function(){menu_text.push($(this).text().replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' '))});
  $('header').each(function(){menu_section.push($(this).closest('section').attr('id'))});
  // override the first item position to 0
  menu_position[0] = 0;
  // adjust the menu positions so at least the title is showing
  menu_position[1] += 159;
  menu_position[3] -= 161;
  menu_position[4] += 533;
  menu_position[5] += 373;
  menu_position[6] += 319;
  menu_position[7] += 480;
  menu_position[8] += 50;
  menu_position[12] -= 747;
  menu_position[13] -= 960;
  menu_position[14] -= 480;
  menu_position[15] -= 374;
  menu_position[16] -= 480;
  menu_position[17] -= 750;

  if ($(window).height() < 830)
  {
    var diffs = [-100, -400, -450, -500, -500, -500, -450];
    for (var i = 11; i < 18; i ++)
    {
      menu_position[i] += diffs[i - 11];
    }
  }
  if ($(window).width() < 1351 && $(window).height() >= 830)
  {
    alert(2);
    var diffs = [-200, -250, -240, -240, -240, -240, -240];
    for (var i = 11; i < 18; i ++)
    {
      menu_position[i] += diffs[i - 11];
    }
  }

  for(var i=0;i<menu_text.length;i++){
    css_class = i == 0 ? "class=active" : ""
    $('#sidebar #menu').append('<li original-title="' + menu_text[i] + '" data-position="' + menu_position[i] + '" data-section="' + menu_section[i] + '" ' + css_class + '><div>&nbsp;</div></li>');

    $('#slide_menu ul').append('<li data-position="' + menu_position[i] + '" data-section="' + menu_section[i] + '" ' + css_class + '>' + menu_text[i] + '</li>');
  }

	// tipsy tooltips
  // main menu
	$('#sidebar #menu li').tipsy({
		gravity: 'w',
		opacity: 1.0
	});

  // ballot icons
	$('#ballots .all img').tipsy({
		gravity: 'n',
		opacity: 1.0,
		className: 'tt-ballots'
	});

  // errors
	$('#question_marks img').tipsy({
		gravity: 'n',
		opacity: 1.0,
		className: 'tt-questions'
	});

  // fix
	$('#line_fix img').tipsy({
		gravity: 'n',
		opacity: 1.0,
		className: 'tt-fix'
	});
	
	// social icons
	$('#sidebar #social_links li a').tipsy({
		gravity: 'w',
		opacity: 1.0,
		className: 'tt-menu'
	});
	
	// popup menu
	$('#sidebar #popup_menu_button img').tipsy({
		gravity: 'w',
		opacity: 1.0,
		className: 'tt-menu'
	});

	// logo
	$('#sidebar #logo a').tipsy({
		gravity: 'w',
		opacity: 1.0,
		className: 'tt-menu'
	});


  // menu click
  $('#sidebar #menu li, #slide_menu ul li').click(function(){
    $('html, body').animate({scrollTop: compute_scroll_top($(this).data('position'), $(this).data('position'))});
  });


  // highlight correct menu item based on position
  $(window).scroll(function(){
    highlight_correct_menu_item();
  });

  // highlight the correct menu item when the page loads
  highlight_correct_menu_item();

////////////////////////////////////////






  $('#loading').fadeOut();





});
