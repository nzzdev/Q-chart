import Papa from 'papaparse'
import array2d from 'array2d'
import {valueConverter} from 'aurelia-framework'

@valueConverter('chartDataConverter')
export class ChartDataValueConverter {

  toView(data) {
    if (!data) return data;
    var dataForView = data;
    if (typeof dataForView === 'object') {
      let dataForPapa = {
        fields: [dataForView.x.label].concat(dataForView.series.map(serie => serie.label)),
        data: array2d.transpose([dataForView.x.data].concat(dataForView.series.map(serie => serie.data)))
      };
      dataForView = Papa.unparse(dataForPapa, {
        quotes: false,
        delimiter: "\t",
        newline: "\n"
      });
    }
    return dataForView;
  }

  fromView(data) {
    if (!data) return data;
    let parsedData = Papa.parse(data)["data"];
    let transposedData = array2d.transpose(parsedData);
    let x = transposedData.shift();
    let series = transposedData;
    let dataForChart = {
      x: {
        label: x.shift(),
        data: x
      },
      series: series.map(serie => {
        return {
          label: serie.shift(),
          data: serie
        }
      })
    }
    return dataForChart;
  }

}
