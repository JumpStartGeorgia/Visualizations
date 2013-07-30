$(function ()
{

  var controller = $.superscrollorama({
    triggerAtCenter: false,
    playoutAnimations: true
  });



  controller.pin($('#page2'), 2500, {
    anim: (new TimelineMax())
          .append(TweenMax.to($('#page2 .bottom'), .5, {css:{top: 0}}))
          .append(TweenMax.to($('#page2 .top'), .5, {css:{opacity: 1}}))
  });

  $('#ballots .all').css({right: $(window).width() - $('#ballots .all').offset().left - $('#ballots .all').width()});
  controller.pin($('#ballots .all'), 9999, {
    pushFollowers: false,
  });

  var i = 9;
  while (i --)
  {
    controller.addTween($('#ballots .list li').eq(i).children('.mark'), TweenMax.to($('#ballots .all li').eq(i), .001, {css: {visibility: 'visible'}}));
  }
  



});
