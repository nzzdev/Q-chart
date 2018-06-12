const Lab = require("lab");
const Code = require("code");
const Hapi = require("hapi");
const Boom = require("boom");
const lab = (exports.lab = Lab.script());
const expect = Code.expect;
const before = lab.before;
const after = lab.after;
const it = lab.it;

process.env.NOTIFICATION_CONFIG = `{"hideAxisLabel":{"priority":{"type":"medium","value":30}},"shouldBeBarChart":{"limit":2,"priority":{"type":"medium","value":40}},"shouldBeBars":{"limit":8,"priority":{"type":"medium","value":50}},"shouldBeLineChart":{"limit":15,"priority":{"type":"medium","value":60}}}`;
const package = require("../package.json");
const routes = require("../routes/routes.js");

let server;

before(async () => {
  try {
    server = Hapi.server({
      port: process.env.PORT || 3000,
      routes: {
        cors: true
      }
    });
    server.route(routes);
  } catch (err) {
    expect(err).to.not.exist();
  }
});

after(async () => {
  await server.stop({ timeout: 2000 });
  server = null;
});

lab.experiment("basics", () => {
  it("starts the server", () => {
    expect(server.info.created).to.be.a.number();
  });

  it("is healthy", async () => {
    const response = await server.inject("/health");
    expect(response.payload).to.equal("ok");
  });
});
