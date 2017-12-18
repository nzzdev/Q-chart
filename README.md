# NZZ Storytelling Q Chart

This is Q Chart. It is currently a mixture of the "old" (based on chartist) and the "new" Q Chart Tool based on vega.

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
- `FEAT_VEGA_RENDERER` set this to true to actually use the new renderer if possible.

## toolRuntimeConfig
There is various runtime configuration that can be passed to the rendering-info endpoints. pass a JSON object in the payload:
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
    "tickOffset": 0,
    "tickRound": true,
    "tickSize": 4,
    "tickWidth": 1,
    "titleFont": "nzz-sans-serif",
    "titleFontSize": 11,
    "titleColor": "#05032d",
    "titleFontWeight": 100
  }
}
```
