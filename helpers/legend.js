const clone = require("clone");
const dateSeries = require("./dateSeries.js");
const d3config = require("../config/d3.js");
const d3timeFormat = require("d3-time-format");
const getComputedColorRange = require("./vegaConfig.js").getComputedColorRange;

function getLegendModel(item, toolRuntimeConfig) {
  // if we do not have a type or we have a vegaSpec that defacto overwrites the chartType, we do not show a legend
  if (!item.options.chartType && item.vegaSpec) {
    return null;
  }
  const colorRange = getComputedColorRange(item, toolRuntimeConfig);
  const legendModel = {};

  legendModel.type = item.options.chartType.toLowerCase();

  legendModel.legendItems = [];

  // only add the series if we have more than one
  if (item.data[0].slice(1).length > 1) {
    const dataSeries = item.data[0].slice(1).map((label, index) => {
      return {
        label: label,
        color: colorRange[index]
      };
    });
    legendModel.legendItems = legendModel.legendItems.concat(dataSeries);
  }

  // prognosis
  legendModel.hasPrognosis =
    item.options.dateSeriesOptions &&
    item.options.dateSeriesOptions.prognosisStart &&
    !isNaN(item.options.dateSeriesOptions.prognosisStart);
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
    if (prognosisStart !== dataWithDateParsed.slice(1).length + 1) {
      // if the prognosis is not the last label
      legendLabel += "(ab ";
    } else {
      legendLabel += "(";
    }
    legendLabel += `${formatDate(prognosisStartDate)})`;

    legendModel.legendItems.push({
      isPrognosis: true,
      label: legendLabel
    });
  }
  return legendModel;
}

module.exports = {
  getLegendModel: getLegendModel
};
