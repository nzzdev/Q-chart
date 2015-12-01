System.register(['chartist'], function (_export) {
    'use strict';

    var Chartist;

    _export('ctGridOnTop', ctGridOnTop);

    function ctGridOnTop() {
        return function ctGridOnTop(chart) {
            if (chart instanceof Chartist.Line || Chartist.Bar) {
                chart.on('created', function () {
                    var layerGrid = chart.svg._node.children[0];
                    var lastChild = chart.svg._node.children[1];
                    console.log(lastChild);

                    lastChild.parentNode.insertBefore(layerGrid, lastChild.nextSibling);
                });
            }
        };
    }

    return {
        setters: [function (_chartist) {
            Chartist = _chartist['default'];
        }],
        execute: function () {
            ;
        }
    };
});