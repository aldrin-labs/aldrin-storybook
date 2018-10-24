import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { RadialChart, GradientDefs, makeVisFlexible, } from 'react-vis';
import { withTheme } from '@material-ui/core/styles';
import { ChartContainer, ValueContainer, LabelContainer, ChartWrapper, SDiscreteColorLegend, ChartWithLegend, } from './styles';
import defaultGradients from './gradients';
const FlexibleChart = makeVisFlexible(RadialChart);
class DonutChartWitoutTheme extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: [],
            value: null,
        };
        this.componentDidMount = () => {
            this.setState({ data: this.getDataFromImput(this.props.data) });
        };
        this.getDataFromImput = (inputData) => inputData.map((record, index) => ({
            angle: record.realValue,
            label: record.label,
            realValue: record.realValue,
            gradientIndex: index % this.props.gradients.length,
        }));
        this.onValueMouseOver = (value) => {
            const { data, value: stateValue } = this.state;
            if (stateValue && stateValue.label === value.label)
                return;
            const index = data.findIndex((d) => d.label === value.label);
            const newData = data.slice().map((d) => (Object.assign({}, d, { opacity: 0.1 })));
            newData.splice(index, 1, Object.assign({}, data[index], { opacity: 1 }));
            this.setState({ value, data: newData });
        };
        this.onSeriesMouseOut = () => {
            this.setState({ value: null, data: this.getDataFromImput(this.props.data) });
        };
    }
    render() {
        const { value, data } = this.state;
        const { radius, thickness, labelPlaceholder, gradients, colorLegend, theme, isSizeFlexible, hightCoefficient, widthCoefficient, thicknessCoefficient, } = this.props;
        var FlexibleRadius = isSizeFlexible
            ? Math.min(window.innerWidth / hightCoefficient, window.innerHeight / widthCoefficient)
            : radius;
        var innerRadius = thickness
            ? FlexibleRadius - thickness
            : FlexibleRadius - FlexibleRadius / thicknessCoefficient;
        return (React.createElement(ChartWithLegend, null,
            colorLegend && (React.createElement(SDiscreteColorLegend, { width: 250, items: data.map((d) => d.label), colors: data.map((d, index) => gradients[index % gradients.length][0]), textColor: theme.typography.body1.color })),
            React.createElement(ChartContainer, null,
                React.createElement(LabelContainer, null,
                    React.createElement(Typography, { variant: "h4" }, value ? value.label : labelPlaceholder || '')),
                React.createElement(ChartWrapper, null,
                    React.createElement(FlexibleChart, { data: data, radius: FlexibleRadius, innerRadius: innerRadius, animation: true, colorType: 'literal', getColor: (d) => `url(#${d.gradientIndex})`, onValueMouseOver: (v) => this.onValueMouseOver(v), onSeriesMouseOut: () => this.onSeriesMouseOut(), style: {
                            strokeWidth: 0,
                        } },
                        React.createElement(ValueContainer, { opacity: value != undefined },
                            React.createElement(Typography, { variant: "h3" }, value ? `${value.realValue}%` : '\u2063')),
                        React.createElement(GradientDefs, null, gradients.map((pair, index) => (React.createElement("linearGradient", { id: index.toString(), x1: "0", x2: "0", y1: "0", y2: "1" },
                            React.createElement("stop", { offset: "0%", stopColor: pair[0], opacity: 0.6 }),
                            React.createElement("stop", { offset: "100%", stopColor: pair[1], opacity: 0.6 }))))))))));
    }
}
DonutChartWitoutTheme.defaultProps = {
    labelPlaceholder: '',
    data: [
        {
            label: "Default 1",
            realValue: 50,
        },
        {
            label: "Default 2",
            realValue: 50,
        },
    ],
    radius: 100,
    hightCoefficient: 16,
    widthCoefficient: 6,
    thicknessCoefficient: 10,
    gradients: defaultGradients,
};
export const DonutChart = withTheme()(DonutChartWitoutTheme);
export default DonutChart;
//# sourceMappingURL=index.js.map