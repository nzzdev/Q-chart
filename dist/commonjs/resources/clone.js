"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = clone;

function clone(item) {
  if (!item) {
    return item;
  }

  var types = [Number, String, Boolean],
      result;

  types.forEach(function (type) {
    if (item instanceof type) {
      result = type(item);
    }
  });

  if (typeof result == "undefined") {
    if (Object.prototype.toString.call(item) === "[object Array]") {
      result = [];
      item.forEach(function (child, index, array) {
        result[index] = clone(child);
      });
    } else if (typeof item == "object") {
      if (item.nodeType && typeof item.cloneNode == "function") {
        var result = item.cloneNode(true);
      } else if (!item.prototype) {
        if (item instanceof Date) {
          result = new Date(item);
        } else {
          result = {};
          for (var i in item) {
            result[i] = clone(item[i]);
          }
        }
      } else {
        if (false && item.constructor) {
          result = new item.constructor();
        } else {
          result = item;
        }
      }
    } else {
      result = item;
    }
  }

  return result;
}

module.exports = exports["default"];