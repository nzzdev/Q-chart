const fetch = require("node-fetch");
const pack = require("./package.json");
const sophieModulesPerTarget = {
  nzz_ch: {
    color: {
      name: "sophie-color",
      version: "1"
    },
    vizColor: {
      name: "sophie-viz-color",
      version: "1"
    }
  }
};

const fontFamilyPerTarget = {
  nzz_ch: "nzz-sans-serif"
};

const loadedSophieModules = {};
async function loadSophieModules(target) {
  if (loadedSophieModules[target]) {
    return loadedSophieModules[target];
  }
  const sophieModules = sophieModulesPerTarget[target];
  if (!sophieModules) {
    return null;
  }

  const moduleString = Object.keys(sophieModules)
    .map(moduleKey => {
      return `${sophieModules[moduleKey].name}@${
        sophieModules[moduleKey].version
      }`;
    })
    .join(",");

  const sophieUrl = `https://service.sophie.nzz.ch/bundle/${moduleString}.vars.json`;

  const sophieResponse = await fetch(sophieUrl, {
    headers: {
      "user-agent": `${pack.name}@${pack.version}`
    }
  });

  if (sophieResponse.status !== 200) {
    return null;
  }

  loadedSophieModules[target] = await sophieResponse.json();
  return loadedSophieModules[target];
}

async function getColorSchemes(target) {
  const sophieVars = await loadSophieModules(target);
  const sophieColorVars = sophieVars[sophieModulesPerTarget[target].color.name];
  const sophieVizColorVars =
    sophieVars[sophieModulesPerTarget[target].vizColor.name];

  const colorSchemes = {
    grays: [
      sophieColorVars.general["s-color-gray-1"],
      sophieColorVars.general["s-color-gray-2"],
      sophieColorVars.general["s-color-gray-3"],
      sophieColorVars.general["s-color-gray-4"],
      sophieColorVars.general["s-color-gray-5"],
      sophieColorVars.general["s-color-gray-6"],
      sophieColorVars.general["s-color-gray-7"],
      sophieColorVars.general["s-color-gray-8"],
      sophieColorVars.general["s-color-gray-9"]
    ],
    categorical_normal: [
      sophieVizColorVars.general["s-viz-color-one-5"],
      sophieVizColorVars.general["s-viz-color-two-5"],
      sophieVizColorVars.general["s-viz-color-three-5"],
      sophieVizColorVars.general["s-viz-color-four-5"],
      sophieVizColorVars.general["s-viz-color-five-5"],
      sophieVizColorVars.general["s-viz-color-six-5"],
      sophieVizColorVars.general["s-viz-color-seven-5"],
      sophieVizColorVars.general["s-viz-color-eight-5"],
      sophieVizColorVars.general["s-viz-color-nine-5"],
      sophieVizColorVars.general["s-viz-color-ten-5"],
      sophieVizColorVars.general["s-viz-color-eleven-5"],
      sophieVizColorVars.general["s-viz-color-twelve-5"]
    ],
    categorical_light: [
      sophieVizColorVars.general["s-viz-color-one-1"],
      sophieVizColorVars.general["s-viz-color-two-1"],
      sophieVizColorVars.general["s-viz-color-three-1"],
      sophieVizColorVars.general["s-viz-color-four-1"],
      sophieVizColorVars.general["s-viz-color-five-1"],
      sophieVizColorVars.general["s-viz-color-six-1"],
      sophieVizColorVars.general["s-viz-color-seven-1"],
      sophieVizColorVars.general["s-viz-color-eight-1"],
      sophieVizColorVars.general["s-viz-color-nine-1"],
      sophieVizColorVars.general["s-viz-color-ten-1"],
      sophieVizColorVars.general["s-viz-color-eleven-1"],
      sophieVizColorVars.general["s-viz-color-twelve-1"]
    ],
    diverging_one: [
      sophieVizColorVars["diverging-one-3"]["s-viz-color-diverging-one-3-1"],
      sophieColorVars.general["s-color-gray-5"],
      sophieVizColorVars["diverging-one-3"]["s-viz-color-diverging-one-3-3"]
    ],
    diverging_two: [
      sophieVizColorVars["diverging-two-3"]["s-viz-color-diverging-two-3-1"],
      sophieColorVars.general["s-color-gray-5"],
      sophieVizColorVars["diverging-two-3"]["s-viz-color-diverging-two-3-3"]
    ],
    diverging_three: [
      sophieVizColorVars["diverging-three-3"][
        "s-viz-color-diverging-three-3-1"
      ],
      sophieColorVars.general["s-color-gray-5"],
      sophieVizColorVars["diverging-three-3"]["s-viz-color-diverging-three-3-3"]
    ]
  };
  return colorSchemes;
}

async function getAxisConfig(target) {
  const sophieVars = await loadSophieModules(target);
  const sophieColorVars = sophieVars[sophieModulesPerTarget[target].color.name];

  return {
    gridColor: sophieColorVars.general["s-color-gray-3"],
    domainColor: sophieColorVars.general["s-color-gray-3"],
    tickColor: sophieColorVars.general["s-color-gray-3"],
    labelFont: fontFamilyPerTarget[target],
    labelColor: sophieColorVars.general["s-color-gray-7"],
    labelColorDark: sophieColorVars.general["s-color-gray-9"],
    labelFontSize: 11,
    labelFontWeight: 100,
    ticks: true,
    tickExtra: false,
    tickSize: 4,
    tickWidth: 1,
    titleFont: fontFamilyPerTarget[target],
    titleFontSize: 11,
    titleColor: sophieColorVars.general["s-color-gray-9"],
    titleFontWeight: 100
  };
}

async function getTextConfig(target) {
  const sophieVars = await loadSophieModules(target);
  const sophieColorVars = sophieVars[sophieModulesPerTarget[target].color.name];

  return {
    fontSize: 11,
    fontWeight: 100,
    fill: sophieColorVars.general["s-color-gray-9"],
    font: fontFamilyPerTarget[target]
  };
}

async function getConfig() {
  const nzz_ch_colorSchemes = await getColorSchemes("nzz_ch");
  const nzz_ch_axisConfig = await getAxisConfig("nzz_ch");
  const nzz_ch_textConfig = await getTextConfig("nzz_ch");

  return {
    nzz_ch: {
      additionalRenderingInfo: {
        stylesheets: [
          {
            url:
              "https://sophieservicestage-2cac.kxcdn.com/bundle/sophie-q@1,sophie-font@1,sophie-color@1,sophie-viz-color@1,sophie-legend%23master.css"
          }
        ]
      },
      context: {
        stylesheets: [
          {
            url: "https://context-service.st.nzz.ch/stylesheet/all/nzz.ch.css"
          }
        ],
        background: {
          color: "#fff"
        }
      },
      toolRuntimeConfig: {
        axis: nzz_ch_axisConfig,
        text: nzz_ch_textConfig,
        colorSchemes: nzz_ch_colorSchemes
      }
    }
  };
}

module.exports = getConfig;
