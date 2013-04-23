$(function ()
{

  var $clones = $('.clone[data-target]');
  var num = $clones.length - 1;

  $clones.each(function (index)
  {
    var self = $(this);
    var target = $(self.data('target'));

    if (!target.length)
    {
      console.log('incorrect target for', this);
      return !1;
    }

    self.html(target.html());
    //.data(target.data());
    // this is not working probably because impress uses .getAttribute(), not .data()
    // and when you set value with .data(), jquery doesn't give the element an attribute
    // instead, it stores key and value in the cache for later use
    // so, when getting the value with .data(key), you'll get the value
    // but with .getAttribute('data' + key) you won't, cause there's no attribute.

    $.each(target.data(), function (key, value)
    {
      self.attr('data-' + key, value);
    });

    if (self.data('remove-substeps'))
    {
      self.find('.substep').removeClass('substep');
    }

    if (num == index)
    {
      impress().init();
    }
  });



});
