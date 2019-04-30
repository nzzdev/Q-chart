const fs = require("fs");
const fetch = require("node-fetch");
async function loadFonts(fonts) {
  console.log("loading fonts", fonts);
  if (!Array.isArray(fonts)) {
    return;
  }
  for (let font of fonts) {
    console.log("loading font", font.name, font.url);
    const response = await fetch(font.url);
    if (!response.ok) {
      console.error(`failed to fetch font from ${font.url}`);
      process.exit(1);
    }
    const fontFileBuffer = await response.buffer();
    fs.writeFileSync(
      `${__dirname}/resources/fonts/${font.filename}`,
      fontFileBuffer
    );
  }
}

function testCanvasFontMeasure() {
  // try to load canvas and log errors if it doesn't work
  // this code is from vega
  let canvas;
  ["canvas", "canvas-prebuilt"].some(function(libName) {
    try {
      console.log(`trying to load ${libName}`);
      canvas = require(libName);
    } catch (error) {
      console.log(error);
    }
  });
  if (typeof canvas !== "function") {
    console.log("failed to load canvas");
  } else {
    console.log(
      "canvas loaded",
      canvas.name,
      "canvas version:",
      canvas.version,
      "cairo version:",
      canvas.cairoVersion
    );
  }
  try {
    const testCanvas = new canvas(1, 1);
    const context = testCanvas.getContext("2d");
    context.font = "100 11px nzz-sans-serif";
    console.log(
      "text width measure test: ",
      context.measureText("hello world").width
    );
  } catch (e) {
    console.log("failed to measure text width", e);
  }
}

const Hapi = require("@hapi/hapi");

const server = Hapi.server({
  port: process.env.PORT || 3000,
  routes: {
    cors: true
  }
});

const routes = require("./routes/routes.js");

async function init() {
  if (process.env.FONTS) {
    await loadFonts(JSON.parse(process.env.FONTS));
  }

  // fiddle with canvas font: https://medium.com/@adamhooper/fonts-in-node-canvas-bbf0b6b0cabf
  process.env.FONTCONFIG_PATH = `${__dirname}/resources/fonts`;
  process.env.PANGOCAIRO_BACKEND = "fontconfig";

  testCanvasFontMeasure();

  await server.register(require("inert"));

  server.route(routes);

  await server.start();
  console.log("server running ", server.info.uri);
}

init();

async function gracefullyStop() {
  console.log("stopping hapi server");
  try {
    await server.stop({ timeout: 10000 });
    console.log("hapi server stopped");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  process.exit(0);
}

// listen on SIGINT and SIGTERM signal and gracefully stop the server
process.on("SIGINT", gracefullyStop);
process.on("SIGTERM", gracefullyStop);
