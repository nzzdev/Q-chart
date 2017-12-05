const clone = require('clone');
const objectPath = require('object-path');

module.exports = function getMappings(config = {}) {
  return [
    {
      path: 'data',
      mapToSpec: function(itemData, spec) {
        spec.data = {
          name: "table",
          values: itemData
            .slice(1)                     // take the header row out of the array
            .map((row, rowIndex) => {
              const x = row.shift();      // take the x axis value out of the row
              return row
                .map((val, index) => {    // generate one array entry for every data category on the same x value
                  return {
                    xValue: x,
                    xIndex: rowIndex,
                    yValue: val,
                    cValue: index
                  }
                })
            })
            .reduce(( acc, cur ) => {     // flatten the array
              return acc.concat(cur);
            }, [])
        };
      }
    },
    {
      path: 'data',
      mapToSpec: function(item, spec) {
        if (config.dateFormat) {
          objectPath.set(spec,'scales.0.type', 'time');
          objectPath.set(spec,'scales.0.nice', config.dateFormat.precision);
        }
      }
    },
    {
      path: 'dateSeriesOptions.interval',
      mapToSpec: function(interval, spec) {
        // only use this option if we have a valid dateFormat
        if (config.dateFormat) {
          if (interval === 'quarter') {
            interval = 'month';
          }
          objectPath.set(spec,'scales.0.nice', interval);
        }
      }
    },
    {
      path: 'options.lineChartOptions.minValue',
      mapToSpec: function(minValue, spec) {
        objectPath.set(spec, 'scales.1.domainMin', minValue);
      }
    },
    {
      path: 'options.lineChartOptions.maxValue',
      mapToSpec: function(maxValue, spec) {
        objectPath.set(spec, 'scales.1.domainMax', maxValue);
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
