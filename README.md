# Q-chart [![Build Status](https://travis-ci.com/nzzdev/Q-chart.svg?branch=dev)](https://travis-ci.com/nzzdev/Q-chart)

**maintainer**: [Franco Gervasi](https://github.com/fgervasi)

Q chart is a charting tool based on [Vega](https://github.com/vega/vega) for [Q](https://q.tools)

## Table of contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Functionality](#functionality)
- [License](#license)

## Installation

```bash
git clone git@github.com:nzzdev/Q-chart.git
cd Q-chart
nvm use
npm install
npm run build
```

## Configuration

Q-chart is configured by two env variables `FONTS` and `DIVERGING_COLOR_SCALES` and through config passed in `toolRuntimeConfig`.

### FONTS

Q-chart renderes the SVG for the chart on the server. For the measurement of the label lengths to be correct you need to have to fonts loaded in node-canvas. Q-chart still uses vega 4 which needs node-canvas 1.6.
The font loading is achieved by some code based on the information in this blogpost: https://medium.com/@adamhooper/fonts-in-node-canvas-bbf0b6b0cabf
For this to work you need to have the `FONTS` env variable defined like this:

```
[
  {
    "name": "Roboto",
    "filename": "roboto.ttf",
    "url": "https://github.com/google/fonts/blob/master/apache/roboto/Roboto-Regular.ttf?raw=true"
  }
]
```

You can define multiple fonts if you need them. the `name` property is the font-family name defined as the label font in the vega config.

### DIVERGING_COLOR_SCHEMES

If you registered any color schemes using toolRuntimeConfig you can configure them in env `DIVERGING_COLOR_SCHEMES` to have them available as selectable options for the custom color scheme option (see below). The `label` is used as the select element option label, the key is stored in the items data and the scheme_name is the reference to the registered scheme name in vega.
Example:

```
[
  {
    "label": "one",
    "key": 0,
    "scheme_name": "diverging_one"
  },
  {
    "label": "two",
    "key": 1,
    "scheme_name": "diverging_two"
  },
  {
    "label": "three",
    "key": 2,
    "scheme_name": "diverging_three"
  }
]
```

### toolRuntimeConfig

Q-chart needs color/font configuration for vega passed in `toolRuntimeConfig` to the `/rendering-info/web` endpoint.
Example:

```
toolRuntimeConfig: {
  axis: {}, // see https://vega.github.io/vega/docs/config/#axes for details
  text: {   // some default text configs
    fontSize: 11,
    fontWeight: 100,
    fill: #FF0000,
    font: 'Roboto'
  },
  colorSchemes: { // to be refactored for Q-chart v2
    categorical_normal: ['#FF0000','#00FF00','#0000FF'], // any number of colors. used for categorial data
    categorical_light: ['#AA0000','#00AA00','#0000AA'], // the same number of colors, used when on category is highlighted (then the others are shown in this color),
    grays: ['#D3D3D3', ....] // a bunch of grays, currently only the 4th and 8th grays are used for the legend in some special cases with colorOverwrites
    },
    "diverging_one": [ // 3 color codes per array, they get registered using vega.scheme()
      "#...",
      "#...",
      "#..."
    ]
  }
}
```

The `toolRuntimeConfig` is also configured in `cli-config.js` to be used with https://github.com/nzzdev/Q-cli
`

## Development

Start the Q dev server

```
npx @nzz/q-cli server -c cli-config.js
```

Run the Q tool:

```
node index.js
```

[to the top](#table-of-contents)

## Testing

The testing framework used in this repository is [Code](https://github.com/hapijs/code).

Run the tests:

```
npm run test
```

### Implementing a new test

When changing or implementing...

- A `route`, it needs to be tested in the `e2e-tests.js` file
- Something on the frontend, it needs to be tested in the `dom-tests.js` file

[to the top](#table-of-contents)

## Deployment

We provide automatically built docker images at https://hub.docker.com/r/nzzonline/q-chart/.
There are three options for deployment:

- use the provided images
- build your own docker images
- deploy the service using another technology

### Use the provided docker images

1. Deploy `nzzonline/q-chart` to a docker environment
2. Set the ENV variables as described in the [configuration section](#configuration)

## Functionality

The tool structure follows the general structure of each Q tool. Further information can be found in [Q server documentation - Developing tools](https://nzzdev.github.io/Q-server/developing-tools.html).

### The flow

1. rendering-info request comes in with toolRuntimeConfig
2. the handler uses nunjucks to render the header/legend/footer markup
3. if there is an exact pixel width given in toolRuntimeConfig, the svg gets build by injecting a request to /web-svg. otherwise a script is returned that measures the width of the container in the browser and then requests the svg from /web-svg
4. in /web-svg we figure out the chart type
5. the final vega spec then gets computed from
   - the chart types `vega-spec.json` file
   - the config passed in toolRuntimeConfig (see below)
   - the mappings defined in `chartTypes/type/mappings.js`
   - the prerender.js in `chartTypes/type/prerender.js`
6. after the svg is rendered by vega any `chartTypes/type/postprocessings.js` are executed to change the svg string

[to the top](#table-of-contents)

### Options

#### Chart type

The following chart types are available:

- Bars
- Stacked Bars
- Line
- Dot Plot
- Arrow (only if exactly two data series)

#### highlightDataSeries

This option is not available for arrow charts.
For any other chart type it changes the color of all but the highlighted data series to the light variant.

#### hideAxisLabel

If checked, the label on the X axis is hidden. This is mostly useful if you have dates on the X-axis.

#### annotations

Only available for linecharts with a single line.

#### barOptions

These are only available if the chartType is `bar` or `stackedBar`

##### isBarChart

If true, the bars are rendered horizontally (not columns).

##### forceBarsOnSmall

If true the bars are rendered horizontally if the width is below 500px.

##### maxValue

If defined this is the max value of the domain used for the axis. This is useful if you want to have multiple columm/bar charts comparable.

[to the top](#table-of-contents)

#### dateSeriesOptions

Only available if a date series is detected in the first column of the data array.

##### interval

One of `["auto", "decade", "year", "quarter", "month", "day", "hour", "minute", "second"]`. This is used for the tick interval and the label format of the dates on the X axis. `auto` will pick the interval based on the detected date format.

##### prognosisStart

This is a `dynamicEnum` resulting in the selected index to be stored with the item. It marks the beginning of the prognosis in a data series.
For linecharts this results in a dashed line after this point. For bar/column charts the bars get striped.

#### lineChartOptions

Only available for Line Charts

##### minValue

The Y-axis minimum value. Be careful to not create misleading charts!

##### maxValue

The Y-axis maximum value.

##### reverseYScale

If checked, the Y scale is reverse. Useful if a decreasing number is a positive thing.

##### lineInterpolation

Only available for users with the `expert-chart` role. One of `["linear", "step-before", "step-after", "monotone"]`.
This is a direct mapping to vegas line mark option `interpolation`. Only the mentioned interpolations are allowed though. See also https://vega.github.io/vega/docs/marks/line/

##### isStockChart

If checked the X axis is not interpreted as a date series anymore. This is usefule if you have stock market data where there is no trading during the night and you only show one or a couple of days/hours. This results in only the first and the last tick on the X axis beging labeled.

#### dotplotOptions

Only available for Dot Plots.

##### connectDots

Results in a line beging drawn between the dots.

##### minValue

The min value for the Y axis

##### maxValue

The max value for the Y axis

#### arrowOptions

Only available for Arrow Charts.

##### minValue

The min value for the Y axis

##### maxValue

The max value for the Y axis

##### colorScheme

Stores the key from one of the color schemes defined in the `DIVERGING_COLOR_SCHEMES` env var. The json-schema gets built dynamically on runtime in `resources/dynamicSchema.js` where the env var is read and the `enum` options for `colorScheme` get set using the configured color schemes.
This is useful to have different diverging color schemes available for different datasets.
The actual colors for these schemes need to get passed in `toolRuntimeConfig.colorSchemes` where there needs to be a color scheme with the name configured as the `scheme_name` in `DIVERGING_COLOR_SCHEMES` given.

#### colorOverwritesSeries

This is only available for chartType `Bar`, `StackedBar`, `Line` and `Dotplot`. It changes the colors at the specified positions in the category color scheme (given in `toolRuntimeConfig.colorSchemes.categorical_normal`/`toolRuntimeConfig.colorSchemes.categorical_light`) to the color given in this option.
The option is an array of objects with `color`, `colorLight` and `position` values. The `color` is used if no highlighting is in place. The `colorLight` is used if any other data series than the one at `position` is highlighted.
This is only available if no `colorOverwritesRows` is given.

#### colorOverwritesRows

This is only available for chartType `Bar`, `StackedBar`, `Line` and `Dotplot`. It changes the colors of the rows at the specified positions to the color given in this option.
The option is an array of objects with `color`, `colorLight` and `position` values. The `color` is used if no highlighting is in place. The `colorLight` is used if any other data series than the one at `position` is highlighted.
This is only available if no `colorOverwritesSeries` is given.

#### largeNumbers

Options for how to handle large numbers, available for all chart types.

##### divideBy

One of `[0, 1, 1e3, 1e6, 1e9]`.

- If `0` (default), the divisor is chosen automatically depending on the maximum value in the data, and (if applicable) `in Tausend`, `in Millionen`, `in Milliarden` is appended to the subtitle.
- If not `0`, values are divided by the provided divisor, and the subtitle is not modified.

## LICENSE

Copyright (c) Neue Zürcher Zeitung.

This software is licensed under the [MIT](LICENSE) License.
