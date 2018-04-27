const commonPostprocessings = require("../commonPostprocessings.js");

module.exports = [
  commonPostprocessings.addPrognosisPattern,
  commonPostprocessings.hideRepeatingTickLabels
];
