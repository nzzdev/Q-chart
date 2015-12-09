// plugin to place grid ontop of series
// inspired by this https://github.com/gionkunz/chartist-js/issues/495

import Chartist from 'chartist';

  //  Chartist.plugins = Chartist.plugins || {};

    export function ctGridOnTop() {
        return function ctGridOnTop(chart) {
            if(chart instanceof Chartist.Line || Chartist.Bar) {
                chart.on('created', function() {
                    var layerGrid = chart.svg._node.children[0];
                    var lastChild = chart.svg._node.children[1];
                    lastChild.parentNode.insertBefore(layerGrid, lastChild.nextSibling);
                });
            }
        };
    };
