module.exports = {
  _id: '_1',
  title: 'C1 Hummeln fliegen besser als gedacht 💀👊',
  tool: 'chart',
  sources: [
    {
      "text": "Comparis",
      "href": "https://www.comparis.ch/comparis/press/medienmitteilungen/artikel/2016/immobilien/monatsmiete-vergleich/mietpreise-staedte.aspx",
      "validHref": true
    },
    {
      "text": "Wüest & Partner Immo-Monitoring 2/2016",
      "href": "",
      "validHref": false
    }
  ],
  data: {
    x: {
      label: '',
      data: ['2011-05-01 00:00:00','2011-05-01 10:30:00','2011-05-01 11:00:00','2011-05-01 11:30:00'],
      type: {
        id: 'date',
        config: {
          format: 'YYYY-MM-DD HH:MM:SS'
        },
        options: {
          interval: 'hour'
        }
      }
    },
    y: {
      label: 'Flugpunkte',
      data: [
        {
          label: 'Hummeln',
          data: [531.10,150.00,475.70,421.45]
        },
        {
          label: 'Fliegen',
          data: [12,232.00,23.70,23.45]
        },
        {
          label: 'Füchse',
          data: [123.10,34.00,51.70,515.45]
        }
      ]
    }
  },
  notes: "Dieses Diagramm zeigt die Anzahl der Haustiere pro Fahrrard im Kanton Zürich über die letzten zehn Jahre. Quellen: Amt für Pilzprüfung; Haustieramt; Deine Mutter – Beteiligte: Peter Lustig; Luise Honig; Franz Brand",
  chartConfig: {

  },
  type: 'Line'
}
