const clone = require('clone');
const objectPath = require('object-path');
const intervals = require('../../helpers/dateSeries.js').intervals;
const dataHelpers = require('../../helpers/data.js');

module.exports = function getMappings(config = {}) {
  return [
    {
      path: 'data',
      mapToSpec: function(itemData, spec, item) {

        // set the x axis title
        objectPath.set(spec, 'axes.0.title', itemData[0][0]);

        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(itemData);

        spec.data = [{
          name: "table",
          values: clone(itemData)
            .slice(1)                     // take the header row out of the array
            .map((row, rowIndex) => {
              const x = row.shift();      // take the x axis value out of the row
              return row
                .map((val, index) => {    // generate one array entry for every data category on the same x value
                  let value = null;
                  if (!Number.isNaN(parseFloat(val))) {
                    value = val / divisor;
                  }
                  return {
                    xValue: x,
                    xIndex: rowIndex,
                    yValue: value,
                    cValue: index
                  }
                })
            })
            .reduce(( acc, cur ) => {     // flatten the array
              return acc.concat(cur);
            }, [])
        }];
      }
    },
    {
      path: 'data', // various settings that are not tied to an option
      mapToSpec: function(itemData, spec) {
        if (config.dateFormat) {
          objectPath.set(spec,'scales.0.type', 'time'); // time scale type: https://vega.github.io/vega/docs/scales/#time
          objectPath.set(spec,'axes.0.labelOverlap', 'parity'); // use parity label overlap strategy if we have a date series
        }
      }
    },
    {
      path: 'options.hideAxisLabel',
      mapToSpec: function(hideAxisLabel, spec, item) {
        if (hideAxisLabel === true) {
          // unset the x axis label
          objectPath.set(spec, 'axes.0.title', undefined);
        }
      }
    },
    {
      path: 'options.lineChartOptions.minValue',
      mapToSpec: function(minValue, spec, item) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(item.data);

        objectPath.set(spec, 'scales.1.nice', false);
        objectPath.set(spec, 'scales.1.domainMin', minValue / divisor);
      }
    },
    {
      path: 'options.lineChartOptions.maxValue',
      mapToSpec: function(maxValue, spec, item) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(item.data);

        objectPath.set(spec, 'scales.1.nice', false);
        objectPath.set(spec, 'scales.1.domainMax', maxValue / divisor);
      }
    },
    {
      path: 'options.dateSeriesOptions.interval',
      mapToSpec: function(interval, spec) {
        // only use this option if we have a valid dateFormat
        if (config.dateFormat) {
          objectPath.set(spec,'axes.0.format', intervals[interval].d3format);
          objectPath.set(spec,'axes.0.tickCount', intervals[interval].vegaInterval);
        }
      }
    },
    {
      path: 'options.dateSeriesOptions.prognosisStart',
      mapToSpec: function(prognosisStart, spec) {
        if (prognosisStart === null) {
          return;
        }
        // add the signal
        objectPath.push(spec, 'signals', {
          name: 'prognosisStart',
          value: prognosisStart
        });

        // split the marks at the prognosisStart index
        const lineMark = clone(spec.marks[0].marks[0]);
        lineMark.encode.enter.defined = {
          "signal": "datum.yValue !== null && datum.xIndex <= prognosisStart"
        };
        const lineMarkPrognosis = clone(spec.marks[0].marks[0]);
        lineMarkPrognosis.encode.enter.defined = {
          "signal": "datum.yValue !== null && datum.xIndex >= prognosisStart"
        };
        lineMarkPrognosis.style = 'prognosisLine';
        spec.marks[0].marks = [lineMark, lineMarkPrognosis];
      }
    }
  ];
};
