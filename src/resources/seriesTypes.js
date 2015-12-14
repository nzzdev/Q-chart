import {dateHandlers} from './seriesTypes/dateHandlers';

export var seriesTypes = {
  'date': {
    'x': {
      'Line': {
        modifyData: dateHandlers.modifyDataBasedOnPrecisionAndAvailableSpace
      },
      'Bar': {
        modifyData: dateHandlers.modifyDataBasedOnPrecision
      },
      'StackedBar': {
        modifyData: dateHandlers.modifyDataBasedOnPrecision
      }
    }
  }
}
