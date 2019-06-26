const Lab = require("@hapi/lab");
const Code = require("@hapi/code");
const Hapi = require("@hapi/hapi");
const lab = (exports.lab = Lab.script());
const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const expect = Code.expect;
const before = lab.before;
const after = lab.after;
const it = lab.it;

const routes = require("../routes/routes.js");

const toolRuntimeConfig = require("./config/toolRuntimeConfig.json");

toolRuntimeConfig.size = {
  width: [
    {
      value: 500,
      comparison: "="
    }
  ]
};

let server;

before(async context => {
  try {
    server = Hapi.server({
      port: process.env.PORT || 3000,
      routes: {
        cors: true
      }
    });
    await server.register(require("@hapi/inert"));
    server.route(routes);
  } catch (err) {
    expect(err).to.not.exist();
  }
});

after(async () => {
  await server.stop({ timeout: 2000 });
  server = null;
});

lab.experiment(
  "all charts from file render without error",
  { timeout: 0 },
  async () => {
    const items = require("./charts.json");

    for (let item of items) {
      it(`doesnt fail in rendering chart "${item.title}" with id ${
        item._id
      } `, async () => {
        const request = {
          method: "POST",
          url: "/rendering-info/web",
          payload: {
            item: item,
            toolRuntimeConfig: toolRuntimeConfig
          }
        };
        const response = await server.inject(request);
        const markup = response.result.markup;
        const dom = new JSDOM(markup);
        const svgElement = dom.window.document.querySelector(
          ".q-chart-svg-container svg"
        );
        expect(svgElement.innerHTML.length).to.be.greaterThan(200);
      });
    }
  }
);
