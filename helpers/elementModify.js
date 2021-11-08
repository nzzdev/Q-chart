function modifyColorStoke(
  axisElements,
  zeroTickIndex,
  elemClass,
  svgElem,
  color
) {
  const axisElement = axisElements.querySelector(elemClass);

  if (!axisElement) {
    return;
  }

  const element = axisElement.querySelectorAll(svgElem);
  element.item(zeroTickIndex).setAttribute("stroke", color);
}

module.exports = {
  modifyColorStoke: modifyColorStoke,
};
