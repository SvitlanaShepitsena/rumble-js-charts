'use strict';

var path = require('path');

module.exports = {
    title: 'Rumble Charts 1.0.11',
    sections: [{
        name: 'Rumble Charts', content: './docs/heading.md'
    }, {
        name: 'Installation', content: './docs/installation.md'
    }, {
        name: 'Introduction', content: './docs/introduction.md', components: './src/Chart.js'
    }, {
        name: 'Series', content: './docs/series.md'
    }, {
        name: 'Graphics', content: './docs/graphics.md', components: function () {
            return [
                './src/Bars.js', './src/Cloud.js', './src/Dots.js', './src/Labels.js',
                './src/Lines.js', './src/Pies.js', './src/RadialLines.js', './src/Ticks.js',
                './src/Title.js'
            ];
        }
    }, {
        name: 'Wrappers', content: './docs/wrappers.md', components: function () {
            return [
                './src/Layer.js', './src/Animate.js', './src/Transform.js', './src/Handlers.js'
            ];
        }
    }, {
        name: 'Helpers', content: './docs/helpers.md', components: function () {
            return [
                './src/DropShadow.js', './src/Gradient.js'
            ];
        }
    }, {
        name: 'Magic & hidden props', content: './docs/hidden-props.md'
    }, {
        name: 'CSS class names', content: './docs/classnames.md'
    }],
    template: './docs/template.html',
    serverPort: 3013,
    updateWebpackConfig: function (webpackConfig, env) {
        var dir = path.join(__dirname, 'src');

        var babel = {
            test: /\.js?$/,
            include: dir,
            loader: 'babel'
        };
        if (env !== 'production') {
            babel.query = {
                presets: ['es2015', 'react-hmre']
            };
        }

        webpackConfig.module.loaders.push(babel);
        return webpackConfig;
    },
    handlers: require('react-docgen').defaultHandlers.concat(function (documentation) {
        if (documentation._props && documentation._props.delete) {
            if (documentation.get('displayName') !== 'Chart') {
                documentation._props.delete('series');
                documentation._props.delete('children');
            }
            documentation._props.delete('seriesIndex');
            documentation._props.delete('minX');
            documentation._props.delete('maxX');
            documentation._props.delete('minY');
            documentation._props.delete('maxY');
            documentation._props.delete('scaleX');
            documentation._props.delete('scaleY');
            documentation._props.delete('layerWidth');
            documentation._props.delete('layerHeight');
        }
    })
};
