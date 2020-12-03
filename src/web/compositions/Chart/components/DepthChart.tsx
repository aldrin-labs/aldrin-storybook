import React from 'react';

import ChartCardHeader from '@sb/components/ChartCardHeader';
import DepthChartComponent from '../DepthChart/DepthChart';

import { DepthChartContainer } from '../Chart.styles';

const MemoizedChartCardHeader = React.memo(ChartCardHeader);
const MemoizedDepthChartContainer = React.memo(DepthChartContainer);

const DepthChartRaw = ({ theme, data }) => {
	return (
		<MemoizedDepthChartContainer theme={theme}>
			<MemoizedChartCardHeader theme={theme}>Depth chart</MemoizedChartCardHeader>
			<DepthChartComponent key="depth_chart_query_render" data={data} />
		</MemoizedDepthChartContainer>
	);
};

export const DepthChart = React.memo(DepthChartRaw);
