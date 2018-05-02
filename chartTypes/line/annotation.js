const clone = require("clone");

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
        field: "yValue"
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
  getLabel(dataName, align, baseline = "top") {
    const label = clone(labelTemplate);
    label.name = `line-annotation-label ${dataName}`;
    label.from.data = dataName;

    label.encode.update.align.value = align;

    if (baseline === "top") {
      label.encode.update.dy.value = -10;
      label.encode.update.baseline.value = "bottom";
    }
    if (baseline === "bottom") {
      label.encode.update.dy.value = 10;
      label.encode.update.baseline.value = "top";
    }

    return label;
  }
};
