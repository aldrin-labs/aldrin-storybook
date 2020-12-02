import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Theme } from '@material-ui/core';
import Timer from 'react-compound-timer';

import { PanelCard, PanelCardTitle, PanelCardValue, PanelCardSubValue } from '../../../Chart.styles';

export interface IProps {
	marketType: 0 | 1;
	theme: Theme;
	fundingTime: number;
    fundingRate: number;
	getFundingRateQueryRefetch: () => Promise<void>
	refetching: boolean
	setRefetching: (refetching: boolean) => void
	key: number
	setKey: (key: number) => void
}

const FundingRateBlock = ({ marketType, theme, fundingRate, fundingTime, refetching, setRefetching, key, setKey, getFundingRateQueryRefetch }: IProps) => {     
    return (
	<PanelCard
		marketType={marketType}
		theme={theme}
		style={{
			borderRight: '0'
		}}
	>
		<PanelCardTitle theme={theme}>Funding</PanelCardTitle>
		<span style={{ display: 'flex', justifyContent: 'space-between' }}>
			<PanelCardValue
				theme={theme}
				style={{
					color: '#235DCF',
					whiteSpace: 'nowrap'
				}}
			>
				{`${fundingRate > 0 ? '+ ' : ''}${(+fundingRate * 100).toFixed(4)} %`}
			</PanelCardValue>
			<PanelCardSubValue theme={theme} style={{ minWidth: '57px', color: theme.palette.grey.text }}>
				{' '}
				<Timer
					initialTime={+dayjs(fundingTime) - Date.now()}
					formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
					direction="backward"
					startImmediately={true}
					checkpoints={[
						{
							time: 0,
							callback: () => {
								console.log('funding rate finished');
                                getFundingRateQueryRefetch();
                                setKey(key + 1)
							}
						}
					]}
				>
					{() => (
						<React.Fragment>
							<Timer.Hours />
							{':'}
							<Timer.Minutes />
							{':'}
							<Timer.Seconds />
						</React.Fragment>
					)}
				</Timer>
			</PanelCardSubValue>
		</span>
	</PanelCard>
);
}
export default React.memo(FundingRateBlock);
