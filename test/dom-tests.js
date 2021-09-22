const Lab = require("@hapi/lab");
const Code = require("@hapi/code");
const Hapi = require("@hapi/hapi");
const lab = (exports.lab = Lab.script());
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const expect = Code.expect;
const before = lab.before;
const after = lab.after;
const it = lab.it;

process.env.DIVERGING_COLOR_SCHEMES =
  '[\n  {\n    "label": "one",\n    "key": 0,\n    "scheme_name": "diverging_one"\n  },\n  {\n    "label": "two",\n    "key": 1,\n    "scheme_name": "diverging_two"\n  },\n  {\n    "label": "three",\n    "key": 2,\n    "scheme_name": "diverging_three"\n  }\n]';

const routes = require("../routes/routes.js");
const toolRuntimeConfig = require("./config/toolRuntimeConfig.json");

let server;

before(async () => {
  try {
    server = Hapi.server({
      port: process.env.PORT || 3000,
      routes: {
        cors: true,
      },
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

function elementAll(markup, selector) {
  return new Promise((resolve, reject) => {
    const elemArr = [];
    const dom = new JSDOM(markup);

    dom.window.document
      .querySelectorAll(selector)
      .forEach((element) => elemArr.push(element));

    resolve(elemArr);
  });
}

function elementCount(markup, selector) {
  return new Promise((resolve, reject) => {
    const dom = new JSDOM(markup);
    resolve(dom.window.document.querySelectorAll(selector).length);
  });
}

lab.experiment("Q chart dom tests", () => {
  it("should display title", async () => {
    const response = await server.inject({
      url: "/rendering-info/web?_id=someid",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/bar-single.json"),
        toolRuntimeConfig: toolRuntimeConfig,
      },
    });

    return elementCount(response.result.markup, "h3.s-q-item__title").then(
      (value) => {
        expect(value).to.be.equal(1);
      }
    );
  });

  it("should display container", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/bar-single.json"),
        toolRuntimeConfig: toolRuntimeConfig,
      },
    });

    return elementCount(response.result.markup, ".q-chart-svg-container").then(
      (value) => {
        expect(value).to.be.equal(1);
      }
    );
  });

  it("number format of area y legend has correct thousend separator", async () => {
    const response = await server.inject({
      url: "/rendering-info/web-svg?id=test&width=350",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/area-y-legend-thousand-separator"),
        toolRuntimeConfig: toolRuntimeConfig,
      },
    });
    return elementAll(response.result.markup, ".role-axis-label").then((el) => {
      const children = el[1].children;
      const value0 = children[0].textContent;
      const value20000 = children[1].textContent;

      expect(value0).to.not.include(" "); // has not quarter space U+2005
      expect(value20000).to.include(" "); // has quarter space U+2005
    });
  });
});
