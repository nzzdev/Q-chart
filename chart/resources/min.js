// from https://github.com/d3/d3-array/blob/master/src/min.js
export default function(array, f) {
  var i = -1,
      n = array.length,
      a,
      b;

  if (arguments.length === 1) {
    while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
    while (++i < n) if ((b = array[i]) != null && a > b) a = b;
  }

  else {
    while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
    while (++i < n) if ((b = f(array[i], i, array)) != null && a > b) a = b;
  }

  return a;
};