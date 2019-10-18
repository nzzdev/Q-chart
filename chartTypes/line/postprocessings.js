const commonPostprocessings = require("../commonPostprocessings.js");

module.exports = [
  commonPostprocessings.hideRepeatingTickLabels,
  commonPostprocessings.hideTicksWithoutLabels,
  commonPostprocessings.highlightZeroGridLineIfPositiveAndNegative,
  commonPostprocessings.addOutlineToAnnotationLabels
];
