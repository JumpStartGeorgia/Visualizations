$(function ()
{

  var controller = $.superscrollorama({
    triggerAtCenter: false,
    playoutAnimations: true
  });


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



  $('#ballots .all').css({right: $(window).width() - $('#ballots .all').offset().left - $('#ballots .all').width()});
  controller.pin($('#ballots .all'), 9999, {
    pushFollowers: false,
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

  $('#ballots .all li').click(function ()
  {
    $('html, body').animate({scrollTop: $('#ballots .list li').eq($(this).index()).offset().top - $(this).closest('.all').height()});
  });
  


  $(window).load(function ()
  {
    //setTimeout(function (){ $(window).scroll(); }, 10);
  });



});
