const clone = require("clone");
const dateSeries = require("../dateSeries.js");
const d3config = require("../../config/d3.js");
const d3timeFormat = require("d3-time-format");
const vega = require("vega");
const optionsHelpers = require("../options.js");

function getLegendModel(item, toolRuntimeConfig) {
  // if we do not have a type or we have a vegaSpec that defacto overwrites the chartType, we do not show a legend
  if (!item.options.chartType || item.vegaSpec) {
    return null;
  }
  const legendModel = {};

  let legendType = "default";
  if (item.options.chartType.toLowerCase() === "line") {
    legendType = "line";
  }

  legendModel.legendItems = [];

  // only add the series if we have more than one
  if (item.data[0].slice(1).length > 1) {
    const dataSeries = item.data[0].slice(1).map((label, index) => {
      let color = vega.scheme("categorical_computed_series_highlight")[index];

      // in case we have row color overwrites (only possible if we have not more than 2 data series)
      // we show the legend with gray colors (as the dataseries colors do not match the overwritten colors)
      if (
        item.options.colorOverwritesRows &&
        item.options.colorOverwritesRows.length > 0 &&
        item.data[0].slice(1).length <= 2
      ) {
        if (
          optionsHelpers.hasSeriesHighlight(item) &&
          !item.options.highlightDataSeries.includes(index)
        ) {
          color = toolRuntimeConfig.colorSchemes.grays[4];
        } else {
          color = toolRuntimeConfig.colorSchemes.grays[8];
        }
      }

      return {
        label: label,
        color: color,
        iconType: legendType
      };
    });
    legendModel.legendItems = legendModel.legendItems.concat(dataSeries);
  }

  // prognosis
  legendModel.hasPrognosis =
    item.options.dateSeriesOptions &&
    Number.isInteger(item.options.dateSeriesOptions.prognosisStart);
  if (legendModel.hasPrognosis) {
    const { prognosisStart, interval } = item.options.dateSeriesOptions;

    const dateFormat = dateSeries.getDateFormatForValue(
      clone(item.data).slice(1)[prognosisStart][0]
    );
    const dataWithDateParsed = dateSeries.getDataWithDateParsed(item.data);
    const prognosisStartDate = dataWithDateParsed.slice(1)[prognosisStart][0];

    d3timeFormat.timeFormatDefaultLocale(d3config.timeFormatLocale);
    const formatDate = d3timeFormat.timeFormat(
      dateSeries.dateFormats[dateFormat].d3format
    );

    let legendLabel = "Prognose ";
    if (prognosisStart !== dataWithDateParsed.slice(1).length - 1) {
      // if the prognosis is not the last label
      legendLabel += "(ab ";
    } else {
      legendLabel += "(";
    }
    legendLabel += `${formatDate(prognosisStartDate)})`;

    legendModel.legendItems.push({
      isPrognosis: true,
      label: legendLabel,
      color: "currentColor",
      iconType: legendType
    });
  }
  return legendModel;
}

module.exports = {
  getLegendModel: getLegendModel
};
