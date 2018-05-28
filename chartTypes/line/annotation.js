const clone = require("clone");
const d3config = require("../../config/d3.js");

const symbolTemplate = {
  type: "symbol",
  from: {
    data: undefined
  },
  encode: {
    update: {
      x: {
        scale: "xScale",
        field: "xValue"
      },
      y: {
        scale: "yScale",
        field: "yValue"
      },
      fill: {
        scale: "colorScale",
        field: "cValue"
      },
      size: {
        value: 35
      }
    }
  }
};

const labelTemplate = {
  type: "text",
  from: {
    data: undefined
  },
  encode: {
    update: {
      text: {
        signal: `format(datum.yValue, "${d3config.formatLocale.decimal}")`
        // field: "yValue"
      },
      fontWeight: {
        value: "100"
      },
      x: {
        scale: "xScale",
        field: "xValue"
      },
      y: {
        scale: "yScale",
        field: "yValue"
      },
      dx: {
        value: 0
      },
      dy: {
        value: undefined
      },
      fill: {
        scale: "colorScale",
        field: "cValue"
      },
      align: {
        value: undefined
      },
      baseline: {
        value: undefined
      }
    }
  }
};

module.exports = {
  getSymbol(dataName) {
    const symbol = clone(symbolTemplate);
    symbol.from.data = dataName;
    return symbol;
  },
  getLabel(dataName, align, verticalAlign = "top") {
    const label = clone(labelTemplate);
    label.name = `annotation-label ${dataName}`;
    label.from.data = dataName;

    label.encode.update.align.value = align;

    if (verticalAlign === "top") {
      label.encode.update.dy.value = -10;
      label.encode.update.baseline.value = "bottom";
    }
    if (verticalAlign === "bottom") {
      label.encode.update.dy.value = 10;
      label.encode.update.baseline.value = "top";
    }

    return label;
  }
};
