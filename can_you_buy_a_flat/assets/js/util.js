/*global document, window, u*/
/*eslint camelcase: 0*/
(function() {
  "use strict";
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === "undefined" || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split("e");
    value = Math[type](+(value[0] + "e" + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split("e");
    return +(value[0] + "e" + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust("round", value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust("floor", value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust("ceil", value, exp);
    };
  }
  if (!Math.round5) {
    Math.round5 = function(value) {
      return (value / 5) * 5;
    };
  }
})();

var u = (function () {
  "use strict";
  var obj = { };
  obj.height = function() { return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; };
  obj.width = function() { return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; };
  obj.px = function() {
    var i = 0;
    var result = 0;
    var a = arguments;
    for(i = 0; i < a.length; ++i)
    {
      result += +a[i].substring(0, a[i].length - 2);
    }
    return result;
  };
  obj.zero = function(v) {
    return v === 0 ? "0" : v;
  };
  obj.reformat = function(n, s) {
    s = typeof s === "number" ? s : 2;
    n = +n;
    var x = n.toFixed(s).split(".");
    var x1 = x[0];

    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + (x.length > 1 ? "." + x[1] : "");//(+n.toFixed(s)).toLocaleString();
  };
  return obj;
})();
