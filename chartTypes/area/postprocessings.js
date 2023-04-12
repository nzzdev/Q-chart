const commonPostprocessings = require("../commonPostprocessings.js");

module.exports = [
  commonPostprocessings.setTabularNumsTickLabels,
  commonPostprocessings.addPrognosisPattern,
  commonPostprocessings.hideRepeatingTickLabels,
  commonPostprocessings.hideTicksWithoutLabels,
  commonPostprocessings.highlightZeroGridLineIfPositiveAndNegative,
];
