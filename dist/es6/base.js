import env from './env'

import {useView, inject} from 'aurelia-framework'
import {ObserverLocator} from 'aurelia-binding'

import computedToInline from 'computed-style-to-inline-style'
import Papa from 'papaparse'

import './styles.css!'

import defaultValues from './defaultValues'

import {display as displayChart} from './display'

@useView('./base.html')
@inject(ObserverLocator, 'Item')
export class ToolboxChart {

  chartTypes = ['Line', 'Bar'];
  xLabel;

  actions = [
    { 
      onClick: this.save.bind(this),
      label: 'speichern'
    }
  ]

  constructor(observerLocator, item) {
    this.env = env;

    this.observerLocator = observerLocator;
    this.item = item;
  }

  activate(routeParams) {
    return new Promise((resolve, reject) => {
      if (routeParams && routeParams.id) {
        this.item.load(routeParams.id)
          .then(() => {
            this.addObservers();
            resolve();
          });
      } else {
        // init the item with default values;
        this.item.setConf(defaultValues);
        this.addObservers();
        resolve();
      }
    });
  }

  attached() {
    this.drawChart();
  }

  addObservers() {
    this.observerLocator
        .getObserver(this.item.conf,'chartType')
        .subscribe(this.drawChart.bind(this))

    this.observerLocator
      .getObserver(this.item.conf,'data')
      .subscribe(this.drawChart.bind(this))
  }

  updateData() {
    this.item.conf.data = Object.assign({}, this.item.conf.data);
  }

  drawChart() {
    if (!this.item.conf || !this.item.conf.chartType || !this.chartElement) return;

    try {
      this.chart = displayChart(this.item.conf, this.chartElement);
    } catch (e) {
      console.log('ERROR', e);
    }
    
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
    return this.item.save().then((args) => {
      console.log('saved', args);
    });
  }

}
