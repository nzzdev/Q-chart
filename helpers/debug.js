const parseISO = require("date-fns/parseISO");

function getSpecTransformForUpstreamCompat(spec) {
  spec = JSON.stringify(spec);
  spec = spec.replace(/categorical_computed_normal/g, "category20");
  spec = spec.replace(/categorical_computed_light/g, "category20");
  spec = spec.replace(/formatDateForInterval/g, "timeFormat");
  spec = spec.replace(/'year'/g, "'%d.%m.%Y'");

  spec = JSON.parse(spec);

  // add date parsing if the first xValue seems to be a date
  const date = parseISO(spec.data[0].values.xValue);
  if (date instanceof Date) {
    spec.data[0].format = {
      parse: {
        xValue: "date"
      }
    };
  }

  return spec;
}

module.exports = {
  getSpecTransformForUpstreamCompat
};
