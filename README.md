# NZZ Storytelling Q Chart

**Maintainer**: [benib](https://github.com/benib)

This is Q Chart. It uses vega https://github.com/vega/vega to render SVGs on the server.

## Deployment / Configuration
You can set the following env variables
- `FONTS` set this to a JSON array like this to make the service download the font files on start
```
[
  {
    "name": "nzz-sans-serif",
    "filename": "nzz-sans-serif.otf",
    "url": "https://storytelling.nzz.ch/nzz-fonts/GT-America-Standard-Regular.otf"
  }
]
```

## The flow
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

## toolRuntimeConfig
There is various runtime configuration that can be passed to the rendering-info endpoints. pass a JSON object in the payload. This is also configured in `cli-config.js` to be used with https://github.com/nzzdev/Q-cli
```
{
  "toolRuntimeConfig": {
    "colorSchemes": {
      "category": {
        "default": [
          "#191D63",
          "#D6B222",
          "#656565",
          "#E08B63",
          "#2E6E71",
          "#DD5B6C",
          "#1EAFC7",
          "#9A8700",
          "#1F9877",
          "#A3A189",
          "#B37490",
          "#B23C39"
        ],
        "light": [
          "#DCDDE7",
          "#FDF4D1",
          "#C7C7C7",
          "#F7E2D9",
          "#A3CFD1",
          "#F5CED3",
          "#CBECF2",
          "#E7DA7C",
          "#B5E1D5",
          "#E7E7E0",
          "#F0E3E9",
          "#F5B8B7"
        ]
      }
    }
  },
  "axis": {
    "gridColor": "#e9e9ee",
    "domainColor": "#e9e9ee",
    "tickColor": "#e9e9ee",
    "labelFont": "nzz-sans-serif",
    "labelColor": "#05032d",
    "labelFontSize": 11,
    "labelFontWeight": 100,
    "ticks": true,
    "tickExtra": false,
    "tickSize": 4,
    "tickWidth": 1,
    "titleFont": "nzz-sans-serif",
    "titleFontSize": 11,
    "titleColor": "#05032d",
    "titleFontWeight": 100
  },
  "text": {
    "fill": "#05032d"
    "font": "nzz-sans-serif"
    "fontSize" :11
    "fontWeight" :100
  }
}
```
