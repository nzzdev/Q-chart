'use strict';

(function (window, document, Chartist) {
    'use strict';

    var protrude = 8;

    var gridOffsetVert;
    var gridOffsetHorz;

    var defaultOptions = {};

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctProtrudeGrid = function (options) {

        options = Chartist.extend({}, defaultOptions, options);

        return function ctProtrudeGrid(chart) {
            if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

                console.log(chart);

                chart.on('draw', function (data) {

                    if (data.type === 'grid') {
                        console.log(data);

                        var lineDirection = data.axis.units.dir;

                        if (lineDirection == 'vertical') {
                            console.log("--vert--");
                            data.axis.gridOffset = data.axis.chartRect.x1 - protrude;
                        } else if (lineDirection == 'horizontal') {
                                console.log("--horz--");
                                data.axis.gridOffset = data.axis.chartRect.y2 - protrude;
                            }
                    }
                });
            };
        };
    };
})(window, document, Chartist);