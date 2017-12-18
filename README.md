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
  toolRuntimeConfig: {
    axis: {
      labelFont: 'nzz-sans-serif',
      labelFontSize: 11,
      labelColor: '#CCCCCC',
      titleFont: '',
      titleFontSize: 12,
      titleColor: '#CCCCCC',
      titleFontWeight: 400
    }
  }
}
```
