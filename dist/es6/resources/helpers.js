var c = document.createElement("canvas");
var ctx = c.getContext("2d");

export function getTextWidth(label, fontstyle) {
  let length;
  if (ctx) {
    ctx.font = fontstyle;
    length = ctx.measureText(label).width + 4; // this 4 is to have some margin around the label
  } else {
    length = label.length * 9;
  }
  return length;
}

export function getFlatDatapoints(data) {
  if (!data.series.length || data.series[0].length === 0) {
    return 0;
  }
  let flatDatapoints = data.series
    .reduce((a, b) => a.concat(b))
    .filter(cell => !isNaN(parseFloat(cell)))
    .slice(0) // copy to not mess with original data by sorting
    .sort((a, b) => parseFloat(a) - parseFloat(b));

  return flatDatapoints;
}
