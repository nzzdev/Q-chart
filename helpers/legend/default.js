const clone = require("clone");
const dateSeries = require("../dateSeries.js");
const d3config = require("../../config/d3.js");
const d3timeFormat = require("d3-time-format");
const vega = require("vega");
const optionsHelpers = require("../options.js");

async function getLegendModel(item, toolRuntimeConfig, chartType, server) {
  // if we do not have a type we do not show a legend
  if (!chartType) {
    return null;
  }
  const legendModel = {};

  let legendType = "default";
  if (chartType === "line") {
    legendType = "line";
  }

  legendModel.legendItems = [];

  // do not include legend if hideLegend is true and the availabilityCheck for it's option is true
  if (item.options.hideLegend === true) {
    try {
      const availabilityCheckRes = await server.inject({
        url: "/option-availability/hideLegend",
        method: "POST",
        payload: { item: item }
      });
      if (availabilityCheckRes.result.available === true) {
        return null;
      }
    } catch (e) {
      server.log(["error"], e);
      // just log the error and move on with whatever logic there is for the legend...
    }
  }

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
  const chartTypeConfig = require(`../../chartTypes/${chartType}/config.js`);

  legendModel.hasPrognosis =
    item.options.dateSeriesOptions &&
    Number.isInteger(item.options.dateSeriesOptions.prognosisStart) &&
    chartTypeConfig.data.handleDateSeries === true; // not all chart types handle data series, if they don't, no progonsis should be shown in any case

  if (legendModel.hasPrognosis) {
    const { prognosisStart, interval } = item.options.dateSeriesOptions;

    const dateFormat = dateSeries.getDateFormatForValue(
      clone(item.data).slice(1)[prognosisStart][0]
    );
    const dataWithDateParsed = dateSeries.getDataWithDateParsed(item.data);
    const prognosisStartDate = dataWithDateParsed.slice(1)[prognosisStart][0];

    d3timeFormat.timeFormatDefaultLocale(d3config.timeFormatLocale);

    // get the intervalConfig for the detected date series format
    const intervalConfig =
      dateSeries.intervals[dateSeries.dateFormats[dateFormat].interval];

    let formatDate;
    if (intervalConfig.formatFunction instanceof Function) {
      formatDate = intervalConfig.formatFunction;
    } else if (intervalConfig.d3format) {
      formatDate = d3timeFormat.timeFormat(intervalConfig.d3format);
    } else {
      console.error(
        "no formatFunction or d3format defined for the date format of the prognosisStart value"
      );
    }

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
