function Timer (callback, delay)
{
  var timerId, start, remaining = delay;

  this.pause = function ()
  {
    window.clearTimeout(timerId);
    remaining -= new Date() - start;
  };

  this.resume = function ()
  {
    start = new Date();
    timerId = window.setTimeout(callback, remaining);
  };

  this.restart = function (new_delay)
  {
    this.stop();
    remaining = new_delay || delay;
    this.resume();
  };

  this.stop = function ()
  {
    window.clearTimeout(timerId);
  };

  this.resume();
}
