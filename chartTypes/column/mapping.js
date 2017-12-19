const objectPath = require('object-path');
module.exports = function getMapping(config = {}) {
  return [
    {
      path: 'data',
      mapToSpec: function(itemData, spec) {
        spec.data = [
          {
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
          }
        ];
      }
    }
  ];
};
