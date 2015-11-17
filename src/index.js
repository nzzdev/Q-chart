import env from './env'

import {useView, inject} from 'aurelia-framework'
import {ObserverLocator} from 'aurelia-binding'

import Chartist from 'chartist'

import computedToInline from 'computed-style-to-inline-style'
import Papa from 'papaparse'

import './styles.css!'

import {display as displayChart} from './display';

@useView('./index.html')
@inject(ObserverLocator, 'ItemConf')
export class ToolboxChart {

  chartData = {
    x: {
      label: 'date',
      data: [
        '2000-01-01', 
        '2000-02-01', 
        '2000-03-01', 
        '2000-04-01', 
        '2000-05-01', 
        '2000-06-01', 
        '2000-07-01', 
        '2000-08-01', 
        '2000-09-01', 
        '2000-10-01', 
        '2000-11-01', 
        '2000-12-01'
      ]
    },
    series: [
      {
        label: 'Juice',
        data: [
          106.3,
          106.0,
          105.4,
          101.8,
          95.9,
          94.1,
          102.0,
          98.5,
          105.1,
          99.0,
          97.7,
          88.2 
        ]
      },
      {
        label: 'Travel',
        data: [
          49.843099,
          49.931931,
          61.478163,
          58.981617,
          61.223861,
          65.601574,
          67.89832,
          67.028338,
          56.441629,
          58.83421,
          56.283261,
          55.38028
        ]
      }
    ]
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
    this.env = env;

    this.observerLocator = observerLocator;
    this.itemConf = itemConf;

    this.itemConf.conf.tool = 'chart';
    this.itemConf.conf.tool_version = this.env.TOOL_VERSION;

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
    this.chart = displayChart(this.getDataForStorage(), this.chartElement);
    
    // this.chart.on('created', (chartInfo) => {
    //   // computedToInline(this.chartElement.querySelector('svg'), true);
    //   this.downloadHref = 'data:image/svg+xml;base64,' + this.utf8_to_b64(this.chartElement.innerHTML);
    // });
  }

  

  utf8_to_b64(str) {
      return window.btoa(unescape(encodeURIComponent(str)));
  }

  b64_to_utf8(str) {
      return decodeURIComponent(escape(window.atob(str)));
  }

  save() {
    this.itemConf.conf = this.getDataForStorage();
    this.itemConf.save().then((args) => {
      console.log('saved', args);
    })
  }

  getDataForStorage() {
    let conf = Object.assign(this.itemConf.conf, {chartConfig: this.chartConfig}, {data: this.chartData}, {chartType: this.chartType});
    conf.title = 'MyFirstChart';
    return conf;
  }
}
