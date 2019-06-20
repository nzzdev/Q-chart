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
  }
  result.item = item;
  return result;
};
