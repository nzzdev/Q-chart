import {modifyConfigDateXLarge} from './seriesTypes/dateXLarge';
import {dateHandlers} from './seriesTypes/dateHandlers';

export var seriesTypes = {
  'date': {
    'x': {
      'Line': {
        modifyConfig: dateHandlers.basedOnPrecisionAndAvailableSpace
      },
      'Bar': {
        modifyConfig: dateHandlers.basedOnPrecision
      },
      'StackedBar': {
        modifyConfig: dateHandlers.basedOnPrecision
      }
    }
  }
}
