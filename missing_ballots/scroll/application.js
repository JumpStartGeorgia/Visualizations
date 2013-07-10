$(function ()
{

  var controller = $.superscrollorama({
    triggerAtCenter: false,
    playoutAnimations: true
  });




  controller.addTween(30, TweenMax.from($('section:eq(1) h1'), .5, {css: {rotation: -180}}));
  controller.addTween(0, TweenMax.to($('section:eq(2)'), .5, {css: {'padding-left': '+=500'}}), 500);
  controller.addTween($('section:eq(2)'), TweenMax.from($('section:eq(6)'), .5, {css: {opacity: 0}}), 1000);
  controller.addTween($('section:eq(4)'), TweenMax.from( $('section:eq(7)'), .5, {css: {'padding-top': 1000}, ease:Quad.easeInOut}));
  controller.addTween($('section:eq(7)'), TweenMax.from( $('section:eq(8) h1'), .5, {css: {'font-size': 100}}));




});
