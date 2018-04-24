const highlightTicksWithVisibleValues = require("../commonPostprocessings.js")
  .highlightTicksWithVisibleValues;

const addPrognosisPattern = require("../commonPostprocessings.js")
  .addPrognosisPattern;

module.exports = [highlightTicksWithVisibleValues, addPrognosisPattern];
