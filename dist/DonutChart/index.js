import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { RadialChart, GradientDefs } from 'react-vis';
import { withTheme } from '@material-ui/core/styles';
import { ChartContainer, ValueContainer, LabelContainer } from './styles';
class DonutChartWitoutTheme extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = () => {
            this.setState({ data: this.getDataFromImput(this.props.data) });
        };
        this.getDataFromImput = (inputData) => (inputData.map((record, index) => ({
            angle: record.realValue,
            label: record.label,
            realValue: record.realValue,
            gradientIndex: index % 5 + 1,
        })));
        this.onValueMouseOver = (value) => {
            const { data } = this.state;
            if (this.state.value && this.state.value.label === value.label)
                return;
            const index = data.findIndex((d) => d.label === value.label);
            const newData = data.slice().map((d) => (Object.assign({}, d, { opacity: 0.1 })));
            newData.splice(index, 1, Object.assign({}, data[index], { opacity: 1 }));
            this.setState({ value, data: newData });
        };
        this.onSeriesMouseOut = () => {
            this.setState({ value: null, data: this.getDataFromImput(this.props.data) });
        };
        this.state = {
            data: [],
            value: null,
        };
    }
    render() {
        const { value, data } = this.state;
        const { width, height, radius, thickness, } = this.props;
        const WithDefaults = {
            width: width || 200,
            height: height || 200,
            radius: radius || 100,
            thickness: thickness || 20
        };
        return (React.createElement(ChartContainer, { width: width ? width : 200 },
            React.createElement(LabelContainer, null,
                React.createElement(Typography, { variant: 'display1' }, value && value.label)),
            React.createElement(RadialChart, { data: data, width: WithDefaults.width, height: WithDefaults.height, radius: WithDefaults.radius, innerRadius: WithDefaults.radius - WithDefaults.thickness, animation: true, colorType: 'literal', getColor: (d) => `url(#${d.gradientIndex})`, onValueMouseOver: (v) => this.onValueMouseOver(v), onSeriesMouseOut: () => this.onSeriesMouseOut(), style: {
                    strokeWidth: 0,
                } },
                React.createElement(ValueContainer, null,
                    React.createElement(Typography, { variant: 'display2' }, value && `${value.realValue}%`)),
                React.createElement(GradientDefs, null,
                    React.createElement("linearGradient", { id: "1", x1: "0", x2: "0", y1: "0", y2: "1" },
                        React.createElement("stop", { offset: "0%", stopColor: "#335ecc", opacity: 0.6 }),
                        React.createElement("stop", { offset: "100%", stopColor: "#2193b0", opacity: 0.6 })),
                    React.createElement("linearGradient", { id: "2", x1: "0", x2: "0", y1: "0", y2: "1" },
                        React.createElement("stop", { offset: "0%", stopColor: "#07c61b", opacity: 0.6 }),
                        React.createElement("stop", { offset: "100%", stopColor: "#17b27c", opacity: 0.6 })),
                    React.createElement("linearGradient", { id: "3", x1: "0", x2: "0", y1: "0", y2: "1" },
                        React.createElement("stop", { offset: "0%", stopColor: "#ce549d", opacity: 0.6 }),
                        React.createElement("stop", { offset: "100%", stopColor: "#ce39bd", opacity: 0.6 })),
                    React.createElement("linearGradient", { id: "4", x1: "0", x2: "0", y1: "0", y2: "1" },
                        React.createElement("stop", { offset: "0%", stopColor: "#f05011", opacity: 0.6 }),
                        React.createElement("stop", { offset: "100%", stopColor: "#f59519", opacity: 0.6 })),
                    React.createElement("linearGradient", { id: "5", x1: "0", x2: "0", y1: "0", y2: "1" },
                        React.createElement("stop", { offset: "0%", stopColor: "#CAC531", opacity: 0.6 }),
                        React.createElement("stop", { offset: "100%", stopColor: "#F3F9A7", opacity: 0.6 }))))));
    }
}
export const DonutChart = withTheme()(DonutChartWitoutTheme);
export default DonutChart;
//# sourceMappingURL=index.js.map