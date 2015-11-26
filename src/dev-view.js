import env from 'env';

var chart1 = {
  _id: '_1',
  title: 'My Chart 1',
  tool: 'chart',
  toolVersion: env.TOOL_VERSION,
  sources: [],
  data: {
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
    y: {
      label: 'y label',
      data: [
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
  },
  chartConfig: {

  },
  chartType: 'Bar'
}

var chart2 = {
  id: '_2',
  title: 'My Chart 2',
  tool: 'chart',
  toolVersion: env.TOOL_VERSION,
  sources: [],
  data: {
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
    y: {
      label: 'y axis',
      data: [
        {
          label: 'Juice',
          data: [
            10.3,
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
  },
  chartConfig: {

  },
  chartType: 'Bar'
}

import 'styles.css!';
import 'dev-styles.css!';
import {display as displayChart} from 'index';

displayChart(chart1, document.getElementById('chart1'));
displayChart(chart2, document.getElementById('chart2'));
