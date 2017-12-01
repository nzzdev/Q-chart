module.exports = {
  "data[]": {
    key: 'data',
    transform: function(itemData) {
      let specData = [
        {
          name: "table",
          values: itemData
            .slice(1)                     // take the header row out of the array
            .map(row => {
              const x = row.shift();      // take the x axis value out of the row
              return row
                .map((val, index) => {    // generate one array entry for every data category on the same x value
                  return {
                    xValue: x,
                    yValue: val,
                    cValue: index
                  }
                })
            })
            .reduce(( acc, cur ) => {     // flatten the array
              return acc.concat(cur);
            }, [])
        }
      ]
      return specData;
    }
  },
  "options.lineChartOptions.minValue": 'scales[1].domainMin',
  "options.lineChartOptions.maxValue": 'scales[1].domainMax'
};
