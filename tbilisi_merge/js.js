$(function()
{





  $('.draggable').draggable({ 
    containment: 'parent',
    axis: 'x',
    create: function (e, ui)
    {
      $(this).parent().siblings('.layer2').children('img').width($(this).parent().siblings('img.layer1').width());
    },
    drag: function (e, ui)
    {
      $(this).parent().siblings('.layer2').width($(this).parent().width() - ui.position.left);
    },
    start: function ()
    {
      $('body').css('cursor', 'col-resize');
    },
    stop: function ()
    {
      $('body').css('cursor', 'auto');
    }
  });



  $('#imgcarousel').removeClass('visible!')
  .carousel({
    interval: false
  })
  .bind('slide', function ()
  {
  });










});
