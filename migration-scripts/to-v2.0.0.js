// contains all scripts which shall be executed to migrate to tool version 2.0.0
// each module has to return a result object holding the modified item and a
// flag property indicating if item was changed or not
module.exports.migrate = function(item) {
  let result = {
    isChanged: false
  };

  // highlightDataSeries is now an array in v2
  if (item.options.highlightDataSeries !== undefined) {
    if (item.options.highlightDataSeries === null) {
      delete item.options.highlightDataSeries;
    } else {
      item.options.highlightDataSeries = [item.options.highlightDataSeries];
    }
    result.isChanged = true;
  }

  // colorOverwrite is renamed to colorOverwritesSeries and colorBright is renamed to colorLight
  if (item.options.colorOverwrite) {
    item.options.colorOverwritesSeries = item.options.colorOverwrite.map(
      colorOverwrite => {
        return {
          color: colorOverwrite.color,
          colorLight: colorOverwrite.colorBright,
          position: colorOverwrite.position
        };
      }
    );
    delete item.options.colorOverwrite;
    result.isChanged = true;
  }

  // remove lineInterpolation step-before
  if (item.options.lineChartOptions) {
    if (item.options.lineChartOptions.lineInterpolation) {
      if (item.options.lineChartOptions.lineInterpolation === "step-before") {
        item.options.lineChartOptions.lineInterpolation = "linear";
        result.isChanged = true;
      }
    }
  }
  result.item = item;
  return result;
};
