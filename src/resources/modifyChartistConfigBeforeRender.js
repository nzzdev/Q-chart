export function modifyChartistConfigBeforeRender(config, type, data, size, rect) {

  // config is the chartist config
  // type is the chart type
  // data is the data as passed to chartist
  // size is either small or large
  // rect is the boundingClientRect of the chart container element

  // do any hacks with chartist config here.

  // example
  if (type === 'Bar' && size === 'large') {
    config.seriesBarDistance = 100;
  }
}
