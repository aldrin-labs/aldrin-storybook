import React from 'react';
import { Theme } from '@material-ui/core';

import { PanelCard, PanelCardTitle, PanelCardValue, PanelCardSubValue } from '../../../Chart.styles';
import { formatNumberToUSFormat, stripDigitPlaces } from '@core/utils/PortfolioTableUtils';

export interface IProps {
	theme: Theme;
	marketType: 0 | 1;
	priceChange: number;
	priceChangePercent: number;
	pricePrecision: number;
}

const PriceChange = ({ marketType, theme, priceChange, priceChangePercent, pricePrecision }: IProps) => {
    const sign24hChange = +priceChangePercent > 0 ? `+` : ``;
    
	return (
		<PanelCard marketType={marketType} theme={theme}>
			<PanelCardTitle theme={theme}>24h change</PanelCardTitle>
			<span style={{ display: 'flex', justifyContent: 'space-between' }}>
				<PanelCardValue
					theme={theme}
					style={{
						color: +priceChange > 0 ? theme.palette.green.main : theme.palette.red.main
					}}
				>
					{formatNumberToUSFormat(stripDigitPlaces(priceChange, pricePrecision))}
				</PanelCardValue>
				<PanelCardSubValue
					theme={theme}
					style={{
						color: +priceChangePercent > 0 ? theme.palette.green.main : theme.palette.red.main
					}}
				>
					{`${sign24hChange}
${formatNumberToUSFormat(stripDigitPlaces(+priceChangePercent))}%`}
				</PanelCardSubValue>
			</span>
		</PanelCard>
	);
};

export default React.memo(PriceChange);
