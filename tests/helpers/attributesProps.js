'use strict';

const enzyme = require('enzyme');
const _ = require('lodash');
const Chart = require('../../lib/Chart');
const generateRandomSeries = require('./generateRandomSeries');
const later = require('./later');

module.exports = function (Component, options = {}) {
    options = _.defaults({}, options, {
        renderMethod: 'shallow',
        chartWidth: 100,
        chartHeight: 100,
        props: {
            seriesVisible: ['g', 'series']
        }
    });
    let {seriesObjects3x5} = options;
    const {chartWidth, chartHeight} = options;

    if (!seriesObjects3x5) {
        seriesObjects3x5 = generateRandomSeries(3, 5, {type: 'object'});
    }

    const delayed = function (callback) {
        jest.runAllTimers();
        return later(callback, options.delay);
    };
    const render = _.isFunction(options.renderMethod) ?
        options.renderMethod(enzyme) :
        enzyme[options.renderMethod];

    describe('should support "attributes"-type properties', () => {

        _.forEach(options.props, ([tagName, className], attrProperty) => {

            const selector = _.isUndefined(className) ?
                tagName :
                (tagName + '.chart-' + className);

            describe(attrProperty, () => {

                pit('can be an object', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            className='chart'
                            {...{[attrProperty]: {transform: 'translateX(10px)'}}}
                        />
                    </Chart>);
                    return delayed(() => {
                        let render = wrapper.render();
                        expect(render.find(selector).length).toBeGreaterThan(0);
                        expect(render.find(selector).prop('transform')).toEqual('translateX(10px)');
                    });
                });

                pit('can be a function', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            className='chart'
                            {...{
                                [attrProperty]: ({series}) => ({
                                    transform: 'translateX(1' + series.data[0].y + 'px)'
                                })
                            }}
                        />
                    </Chart>);
                    return delayed(() => {
                        expect(wrapper.render().find(selector).last().prop('transform'))
                            .toEqual('translateX(1' + seriesObjects3x5[2].data[0].y + 'px)');
                    });
                });

                it('should be correctly defined in propTypes', () => {
                    expect(Component.propTypes[attrProperty](
                        {[attrProperty]: {transform: 'translateX(10px)'}}, attrProperty, '', null
                    )).toEqual(null);
                    expect(Component.propTypes[attrProperty](
                        {
                            [attrProperty]: ({series}) => ({
                                transform: 'translateX(1' + series.data[0].y + 'px)'
                            })
                        }, attrProperty, '', null
                    )).toEqual(null);
                });

                it('should not have default value', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                    expect(wrapper.find(Component).prop(attrProperty.toString())).toBeUndefined();
                });

            });
        });

    });

};
