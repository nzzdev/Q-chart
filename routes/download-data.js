const Joi = require("joi");
const slugify = require("slugify");

module.exports = {
  method: "POST",
  path: "/download-data",
  options: {
    cors: true,
    validate: {
      payload: {
        item: Joi.object().required()
      }
    }
  },
  handler: function(request, h) {
    let csv = createCSV(request.payload.item.data);
    const response = h.response(csv);
    response.type("text/csv");
    response.header(
      "Content-Disposition",
      `attachment; filename=chart-${slugify(request.payload.item.title)}.csv`
    );
    return response;
  }
};

function createCSV(json) {
  var data = typeof json != "object" ? JSON.parse(json) : json;
  var csv = "";
  for (var i = 0; i < data.length; i++) {
    var line = "";
    for (var index in data[i]) {
      if (line !== "") {
        line += ",";
      }
      line += data[i][index];
    }
    csv += line + "\r\n";
  }
  return csv;
}
