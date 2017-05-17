import {getTextWidth} from '../helpers';

export function isThereEnoughSpace(labelsToDisplay, rect, config, fontstyle) {
  let xAxisWidth = rect.width - ((config.axisX.offset || 30) + 10);

  let totalSpace = labelsToDisplay
    .reduce((sum, label) => {
      return sum + getTextWidth(label, fontstyle);
    },0);

  return totalSpace < xAxisWidth;
}
