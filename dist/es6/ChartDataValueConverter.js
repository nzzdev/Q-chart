import Papa from 'papaparse'
import {valueConverter} from 'aurelia-framework'

@valueConverter('chartDataConverter')
export class ChartDataValueConverter {

  toView(data) {
    var dataForView = data;
    if (typeof dataForView === 'object') {
      let dataForPapa = {
        fields: dataForView.labels,
        data: dataForView.series
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
    let parsedData = Papa.parse(data)["data"];
    let dataForChart = {
      labels: parsedData.shift().slice(0),
      series: parsedData.slice(0)
    }
    return dataForChart;
  }

}
