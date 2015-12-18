var c = document.createElement("canvas");
var ctx = c.getContext("2d");

export function getLabelWidth(label, getFontstyle) {
  let length;
  if (ctx) {
    ctx.font = getFontstyle;
    length = ctx.measureText(label).width;
  } else {
    length = label.length * 9;
  }
  return length;
}

export function isThereEnoughSpace(labelsToDisplay, rect, config) {
  let xAxisWidth = rect.width - ((config.axisX.offset || 30) + 10);

  let totalSpace = labelsToDisplay
    .reduce((sum, label) => {
      return sum + getLabelWidth(label);
    });

  return totalSpace < xAxisWidth;
}
