import {useView, inject} from 'aurelia-framework'
import {ObserverLocator} from 'aurelia-binding'

import Chartist from 'chartist'

import computedToInline from 'computed-style-to-inline-style'
import Papa from 'papaparse'

import './styles.css!'

@useView('./index.html')
@inject(ObserverLocator, 'ItemConf')
export class ToolboxChart {

  chartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    series: [
      [12, 9, 7, 8, 5],
      [2, 1, 3.5, 7, 3],
      [1, 3, 4, 5, 6]
    ],
  }

  chartConfig = {
    fullWidth: true,
    chartPadding: {
      right: 40
    }
  }

  chartType;

  chartTypes = ['Line', 'Bar'];

  constructor(observerLocator, itemConf) {

    this.observerLocator = observerLocator;
    this.itemConf = itemConf;

    this.itemConf.conf.tool = 'chart';
    this.itemConf.conf.tool_version = '0.0.1';

    this.observerLocator
      .getObserver(this,'chartType')
      .subscribe(this.drawChart.bind(this))

    this.observerLocator
      .getObserver(this,'chartData')
      .subscribe(this.drawChart.bind(this))
  }

  attached() {
    this.chartType = 'Line';
  }

  drawChart() {
    if (!Chartist.hasOwnProperty(this.chartType)) throw `chartType (${this.chartType}) not available`;
    this.chart = new Chartist[this.chartType](this.chartElement, this.chartData, this.chartConfig)
    
    // this.chart.on('created', (chartInfo) => {
    //   // computedToInline(this.chartElement.querySelector('svg'), true);
    //   this.downloadHref = 'data:image/svg+xml;base64,' + this.utf8_to_b64(this.chartElement.innerHTML);
    // });
  }

  getChartDataForChartist(data) {
    let parsedData = Papa.parse(data)["data"];
    let dataForChart = {
      labels: parsedData.shift().slice(0),
      series: parsedData.slice(0)
    }
    return dataForChart;
  }

  utf8_to_b64(str) {
      return window.btoa(unescape(encodeURIComponent(str)));
  }

  b64_to_utf8(str) {
      return decodeURIComponent(escape(window.atob(str)));
  }

  save() {
    this.itemConf.conf = Object.assign(this.itemConf.conf, {chartConfig: this.chartConfig}, {data: this.chartData});
    this.itemConf.conf.title = 'MyFirstChart';
    this.itemConf.save().then((args) => {
      console.log('saved', args);
    })
  }
}
