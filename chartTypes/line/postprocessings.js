const commonPostprocessings = require("../commonPostprocessings.js");

module.exports = [
  commonPostprocessings.hideRepeatingTickLabels,
  commonPostprocessings.highlightTicksWithVisibleValues
];
