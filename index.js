const fs = require('fs');
const fetch = require('node-fetch');
async function loadFonts(fonts) {
  if (!Array.isArray(fonts)) {
    return;
  }
  for (let font of fonts) {
    const response = await fetch(font.url);
    if (!response.ok) {
      console.error(`failed to fetch font from ${font.url}`);
      process.exit(1);
    }
    const fontFileBuffer = await response.buffer();
    fs.writeFileSync(`${__dirname}/resources/fonts/${font.filename}`, fontFileBuffer);
  }
}

const Hapi = require('hapi');

const server = Hapi.server({
  port: process.env.PORT || 3000,
  routes: {
    cors: true
  }
});

const routes = require('./routes/routes.js');

async function init() {
  if (process.env.FONTS) {
    await loadFonts(JSON.parse(process.env.FONTS));
  }

  // fiddle with canvas font: https://medium.com/@adamhooper/fonts-in-node-canvas-bbf0b6b0cabf
  process.env.FONTCONFIG_PATH = `${__dirname}/resources/fonts`;
  process.env.PANGOCAIRO_BACKEND = 'fontconfig';

  server.route(routes);
  
  await server.start();
  console.log('server running ', server.info.uri)
}

init();
