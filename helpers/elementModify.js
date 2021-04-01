function modifyColorStoke(
  axisElements,
  zeroTickIndex,
  elemClass,
  svgElem,
  replaceColor,
  targetColor
) {
  const axisElement = axisElements
    .querySelector(elemClass);

  if (!axisElement) {
    return;
  }

  const element = axisElement.querySelectorAll(svgElem);
  element
    .item(zeroTickIndex)
    .setAttribute(
      "style",
      element
        .item(zeroTickIndex)
        .getAttribute("style")
        .replace(`stroke: ${replaceColor}`, `stroke: ${targetColor}`)
    );
}

module.exports = {
  modifyColorStoke: modifyColorStoke,
};
