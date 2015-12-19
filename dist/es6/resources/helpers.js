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
