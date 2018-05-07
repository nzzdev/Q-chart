process.env.FEAT_VEGA_RENDERER = true;
process.env.FONT = [
  {
    name: "nzz-sans-serif",
    filename: "nzz-sans-serif.otf",
    url:
      "https://assets.static-nzz.ch/nzz-niobe/assets/fonts/GT-America-Standard-Regular.otf"
  },
  {
    name: "Roboto",
    filename: "roboto.ttf",
    url:
      "https://github.com/google/fonts/blob/master/apache/roboto/Roboto-Regular.ttf?raw=true"
  }
];

require("./index.js");
