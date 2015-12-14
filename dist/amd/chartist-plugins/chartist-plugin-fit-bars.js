define(['exports', 'chartist'], function (exports, _chartist) {
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports.ctExtendFitBarsToData = ctExtendFitBarsToData;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _Chartist = _interopRequireDefault(_chartist);

	function ctExtendFitBarsToData() {

		return function ctExtendFitBarsToData(chart) {

			if (chart instanceof _Chartist['default'].Bar) {
				chart.on('draw', function (data) {
					if (data.type === 'bar') {
						if (chart.options.barWidth) {
							data.element.attr({ style: 'stroke-width:' + chart.options.barWidth + 'px' });
						}
					}
				});
			}
		};
	}

	;
});