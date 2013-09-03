// adjust location of legend in maps
function adjust_legend_placement(){
  var scrn_width = $(window).width();  

  // adjust country legend
  // - reset to default values first
  $('#page10 #map').css('margin-bottom', '0px');
  $('#page10 #legend').css('top', '150px');
  $('#page10 #legend ul li').css('display', 'block').css('margin-right', '0px');
  $('#page11 #map').css('margin-bottom', '0px');
  $('#page11 #legend').css('top', '150px');
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
  var window_scroll_top = $(window).scrollTop();
  if (window_scroll_top > child){
    return parent;
  } else{
    return child;
  }
}

$(function ()
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
    $('html, body').animate({scrollTop: compute_scroll_top($('#page7').offset().top, $('#page7 .bottom').offset().top) });
  });
  $('#question_marks > div:nth-child(4) > img').click(function ()
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
    $('html, body').animate({scrollTop: compute_scroll_top($('#page16').offset().top, $('#page16 .middle').offset().top) });
  });
  $('#line_fix > div:nth-child(4) > img').click(function ()
  {
    $('html, body').animate({scrollTop: compute_scroll_top($('#page17').offset().top, $('#page17 .after').offset().top) });
  });




////////////////////////////////
  // create the menu

  var menu_text = [];
  var menu_position = [];
  var menu_section = [];
  $('header').each(function(){menu_position.push($(this).offset().top)});
  $('header').each(function(){menu_text.push($(this).text().replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' '))});
  $('header').each(function(){menu_section.push($(this).closest('section').attr('id'))});
  
  for(var i=0;i<menu_text.length;i++){
    $('#sidebar #menu').append('<li title="' + menu_text[i] + '" data-position="' + menu_position[i] + '" data-section="' + menu_section[i] + '"><div>&nbsp;</div></li>');
  }

  $('#sidebar #menu li').click(function(){
console.log('menu item click, section = ' + $(this).data('section'));
    $('html, body').animate({scrollTop: compute_scroll_top($('section#' + $(this).data('section')).offset().top, $('section#' + $(this).data('section') + ' header').offset().top) });
  });



///////////////////////////////////

  controller.addTween(
    $('#page1'),
    (new TimelineMax()).append(TweenMax.fromTo($('#page1 #scroll_down'), .5, {css: {opacity: 1}}, {css: {opacity: 0}}))
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



  var pinh = 3300;
  controller.pin($('#page5a'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page5a .top'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page5a #stations').parent(), .5, {css: {position: 'relative', top: 900}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page5a #stations-connect'), .5, {css:{top: 700}}, {css:{top: -42}}))
          .append(TweenMax.to($('#page5a #stations-connect #line1'), .5, {css:{top: -100, opacity: 0}/*, delay: 1*/}))
          .append(TweenMax.fromTo($('#page5a #stations-connect .img img:last-of-type, #stations-connect .right'), .5, {css:{top: 700}}, {css:{top: 0}}))
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



  controller.addTween($('#page7'), TweenMax.fromTo($('#page7 > .top'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}), 300);

  controller.pin($('#page7 > .top'), $('#page7').height(), {
    pushFollowers: false,
    offset: -($('#question_marks').parent().height() + $('#ballots .all').height()),
    onPin: function ()
    {
      $('#ballots .all li:eq(5)').css({opacity: 1});
      $('#ballots .all li:eq(7)').css({opacity: .6});
    },
    onUnpin: function ()
    {
      $('#ballots .all li:eq(5)').css({opacity: .6});
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

  var pinh = 2500;
  controller.pin($('#page8'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page8 > .top'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.to($('#page8 > .top'), .001, {css: {position: 'fixed', width: 'auto', left: $('#sidebar').width(), right: 0, zIndex: 9999, top: $('#ballots .all').outerHeight() + $('#question_marks').parent().height()}}))
          .append(TweenMax.fromTo($('#page8 .after'), .5, {css: {top: 800}}, {css: {top: 0}})),
    onPin: function ()
    {
      $('#page8-spacer').hide();
      $('#ballots .all li:eq(7)').css({opacity: 1});
    },
    onUnpin: function ()
    {
      if ($('#page8').offset().top > $(window).scrollTop())
      {
        $('#page8-spacer').show();
      }
    }
  });
  $('#page8').after('<div id="page8-spacer"></div>').next().height(50);




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
          .append(TweenMax.fromTo($('#page8a .spreadsheet li:nth-child(7)'), .5, {css: {top: 800}}, {css: {top: 0}})),
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
  $('#page8a').after('<div id="page8a-spacer"></div>').next().height(50);




  var pinh = 2500;
  controller.pin($('#page8b'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page8b .spreadsheet'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8b .spreadsheet li:nth-child(1)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8b .spreadsheet li:nth-child(2)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8b .spreadsheet li:nth-child(3)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8b .spreadsheet li:nth-child(4)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8b .spreadsheet li:nth-child(5)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8b .spreadsheet li:nth-child(6)'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page8b .spreadsheet li:nth-child(7)'), .5, {css: {top: 800}}, {css: {top: 0}})),
    onPin: function ()
    {
      $('#page8b-spacer').hide();
    },
    onUnpin: function ()
    {
      if ($('#page8b').offset().top > $(window).scrollTop())
      {
        $('#page8b-spacer').show();
      }
    }
  });
  $('#page8b').after('<div id="page8b-spacer"></div>').next().height(50);



  
  controller.addTween(
    $('#page8d'),
    (new TimelineMax()).append([
      TweenMax.to($('#page8 > .top'), .001, {css: {zIndex: 'auto', display: 'none'}}),
      TweenMax.to($('#ballots .all li:eq(7)'), .001, {css: {opacity: .6}})
    ])
  );
  
  

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
            TweenMax.to($('#page15 .bottom #circles .right .circle'), .5, {css: {fontSize: '36px', lineHeight: '38px', padding: "48px 10px", backgroundColor: "#e15e32", width: '208px', height: '208px'}}),
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



//////////////////////////////////////


  var pinh = 2000;
  controller.pin($('#page16'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#page16 header h3').add('#page16 .line_fix23_img'), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#page16 .middle'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page16 .bottom .left'), .5, {css: {top: 800}}, {css: {top: 0}}))
          .append(TweenMax.fromTo($('#page16 .bottom .right'), .5, {css: {top: 800}}, {css: {top: 0}})),
    onPin: function ()
    {
      $('#page16-spacer').hide();
      $('#ballots .all li:eq(4)').css({opacity: 1});
      $('#ballots .all li:eq(5)').css({opacity: 1});
    },
    onUnpin: function ()
    {
      if ($('#page16').offset().top > $(window).scrollTop())
      {
        $('#page16-spacer').show();
      }
      $('#ballots .all li:eq(4)').css({opacity: .6});
      $('#ballots .all li:eq(5)').css({opacity: .6});
    }
  });
  $('#page16').after('<div id="page16-spacer"></div>').next().height(pinh);



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
    },
    onUnpin: function ()
    {
      if ($('#page17').offset().top > $(window).scrollTop())
      {
        $('#page17-spacer').show();
      }
      $('#ballots .all li:eq(7)').css({opacity: .6});
    }
  });
  $('#page17').after('<div id="page17-spacer"></div>').next().height(pinh);



//////////////////////////////////////



  var pinh = 2500;
  controller.pin($('#page18'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.to($('#ballots .all'), .001, {css: {display: 'none', top: -100}}))
          .append(TweenMax.to($('#question_marks').parent(), .001, {css: {display: 'none', top: -100}}))
          .append(TweenMax.to($('#line_fix').parent(), .001, {css: {display: 'none', top: -100}}))
          .append(TweenMax.to($('#page18 .caret'), .001, {css:{opacity: 0}}))
          .append(TweenMax.fromTo($('#page18 #line2'), .5, {css:{top: 1000}}, {css:{top: 0}}))
          .append(TweenMax.fromTo($('#page18 #line3'), .5, {css:{top: 1000}}, {css:{top: 0}}))
          .append(TweenMax.fromTo($('#page18 #line4'), .5, {css:{top: 1000}}, {css:{top: 0}}))
          .append(TweenMax.fromTo($('#page18 #sources'), .5, {css:{opacity: 0}}, {css:{opacity: 1}})),
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





////////////////////////////////////////


  $(window).load(function ()
  {
    //setTimeout(function (){ $(window).scroll(); }, 10);
  });



});
