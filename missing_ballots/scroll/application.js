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
  controller.pin($('#ballots .all'), 9e5, {
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
  










  var pinh = 3000;
  controller.pin($('#page5'), pinh, {
    anim: (new TimelineMax())
          .append(TweenMax.fromTo($('#stations').parent(), .5, {css: {opacity: 0}}, {css: {opacity: 1}}))
          .append(TweenMax.fromTo($('#stations-connect'), .5, {css:{top: 700}}, {css:{top: 0}}))
          .append(TweenMax.to($('#stations-connect h5'), .5, {css:{top: -500}}))
          .append(TweenMax.fromTo($('#stations-connect .img img:last-of-type, #stations-connect .right'), .5, {css:{top: 700}}, {css:{top: 0}})),
    onPin: function ()
    {
      $('#page5-spacer').hide();
    },
    onUnpin: function ()
    {
      if ($('#page5').offset().top > $(window).scrollTop())
      {
        $('#page5-spacer').show();
      }
    }
  });
  $('#page5').after('<div id="page5-spacer"></div>').next().height(pinh);













  $(window).load(function ()
  {
    //setTimeout(function (){ $(window).scroll(); }, 10);
  });



});
