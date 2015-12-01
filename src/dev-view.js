import env from 'env';

var chart1 = {
  _id: '_1',
  title: 'Hummeln fliegen besser als gedacht',
  tool: 'chart',
  toolVersion: env.TOOL_VERSION,
  sources: [],
  data: {
    x: {
      label: '',
      data: [
        '01.2000',
        '02.2000',
        '03.2000',
        '04.2000',
        '05.2000',
        '06.2000',
        '07.2000',
        '08.2000',
        '09.2000',
        '10.2000',
        '11.2000',
        '12.2000'
      ]
    },
    y: {
      label: 'Flugpunkte',
      data: [
        {
          label: 'Hummeln',
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
          label: 'Fliegen',
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
  notes: "Dieses Diagramm zeigt die Anzahl der Haustiere pro Fahrrard im Kanton Zürich über die letzten zehn Jahre. Quellen: Amt für Pilzprüfung; Haustieramt; Deine Mutter – Beteiligte: Peter Lustig; Luise Honig; Franz Brand",
  chartConfig: {

  },
  chartType: 'Line'
}

var chart2 = {
  id: '_2',
  title: 'Ein Kampf zwischen Ahnen',
  tool: 'chart',
  toolVersion: env.TOOL_VERSION,
  sources: [],
  data: {
    x: {
      label: '',
      data: [
          'Apex',
          'Bheta',
          'Budh',
          'Meto',
          'Notu',
          'Ming',
          'Dris'
      ]
    },
    y: {
      label: 'gemessen in Spacepunkten',
      data: [
        {
          label: 'Stärke',
          data: [
            10.3,
            106.0,
            105.4,
            101.8,
            95.9,
            94.1,
            102.0
          ]
        },
        {
          label: 'Intelligenz',
          data: [
            49.843099,
            49.931931,
            61.478163,
            58.981617,
            61.223861,
            65.601574,
            67.89832
          ]
        },
        {
          label: 'Love',
          data: [
            56, 
            21, 
            41, 
            22, 
            15, 
            12, 
            34
          ]
        },
        {
          label: 'Wahrheit',
          data: [
            30, 
            20, 
            40, 
            50, 
            60, 
            71, 
            10
          ]
        },
        {
          label: 'Führerschein',
          data: [
            51, 
            31, 
            22, 
            71, 
            41, 
            34, 
            15
          ]
        }
      ]
    }
  },
  notes: "Dieses Diagramm zeigt die Anzahl der Haustiere pro Fahrrard im Kanton Zürich über die letzten zehn Jahre. Quellen: Amt für Pilzprüfung; Haustieramt; Deine Mutter – Beteiligte: Peter Lustig; Luise Honig; Franz Brand",
  chartConfig: {

  },
  chartType: 'Bar'
}

import 'styles.css!';
import 'dev-styles.css!';
import {display as displayChart} from 'index';

displayChart(chart1, document.getElementById('chart1'));
displayChart(chart2, document.getElementById('chart2'));
