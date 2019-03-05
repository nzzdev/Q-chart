# Q-chart

**maintainer**: [benib](https://github.com/benib)

Q chart is a charting tool based on [Vega](https://github.com/vega/vega) for [Q](https://q.tools)

## Table of contents

- [Installation](#installation)
- [Configuration](#configuration)

## Installation

```bash
$ nvm use
$ npm install
$ npm run build
```

## Configuration

### Font(s)

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
    category: {
      default: ['#FF0000','#00FF00','#0000FF'], // any number of colors. used for categorial data
      light: ['#AA0000','#00AA00','#0000AA'], // the same number of colors, used when on category is highlighted (then the others are shown in this color)
    },
    "diverging_one": [ // all color schemes but category get directly registered using `vega.schemeDiscretized(name, values)`
      [
        "gray"
      ],
      [
        "red",
        "green"
      ],
      [
        "red",
        "gray",
        "green"
      ]
    ]
  }
}
```

The `toolRuntimeConfig` is also configured in `cli-config.js` to be used with https://github.com/nzzdev/Q-cli
`

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

## Development

Install the [Q cli](https://github.com/nzzdev/Q-cli) and start the Q dev server:

```
$ Q server -c /path/to/Q-chart/cli-config.js
```

Run the Q tool:

```
$ node index.js
```

[to the top](#table-of-contents)

## Testing

The testing framework used in this repository is [Code](https://github.com/hapijs/code).

Run the tests:

```
$ npm run test
```

### Implementing a new test

When changing or implementing...

- A `route`, it needs to be tested in the `e2e-tests.js` file
- Something on the frontend, it needs to be tested in the `dom-tests.js` file

[to the top](#table-of-contents)

## Tool implentation details

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

## Features

[to the top](#table-of-contents)

## Options

[to the top](#table-of-contents)

## LICENSE

Copyright (c) 2019 Neue Zürcher Zeitung.

This software is licensed under the [MIT](LICENSE) License.
