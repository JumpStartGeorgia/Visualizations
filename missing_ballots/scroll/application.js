$(function ()
{

  var controller = $.superscrollorama({
    triggerAtCenter: false,
    playoutAnimations: true
  });



  //controller.pin($('#page1 h1'), 500);

  controller.addTween($('#page1 h1').offset().top * .87, TweenMax.to($('#page1 h1'), .1, {css: {position: 'fixed', right: 0, left: 0, top: 0}}));

  controller.addTween($('#page2').offset().top - 60, TweenMax.fromTo($('#page2 .middle'), .3, {css: {opacity: 0}}, {css: {opacity: 1}}).fromTo($('#page2 .top'), .3, {css: {opacity: 0}}, {css: {opacity: 1}}));
//  controller.pin($('#page2'), 500);


  //controller.addTween(30, TweenMax.from($('section:eq(1) h1'), .5, {css: {rotation: -180}}), 100);




});
