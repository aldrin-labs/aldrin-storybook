import React from 'react';
import { Theme } from '@material-ui/core';

import { PanelCard, PanelCardTitle, PanelCardValue, PanelCardSubValue } from '../../../Chart.styles';
import { formatNumberToUSFormat, stripDigitPlaces, roundAndFormatNumber } from '@core/utils/PortfolioTableUtils';

export interface IProps {
	theme: Theme;
	marketType: 0 | 1;
	highPrice: number;
	lowPrice: number;
	pricePrecision: number;
}

const LowHighPrice = ({ marketType, theme, highPrice, lowPrice, pricePrecision }: IProps) => (
	<>
		<PanelCard marketType={marketType} theme={theme}>
			<PanelCardTitle theme={theme}>24h high</PanelCardTitle>
			<PanelCardValue theme={theme}>
				{formatNumberToUSFormat(roundAndFormatNumber(highPrice, pricePrecision, false))}
			</PanelCardValue>
		</PanelCard>

		<PanelCard marketType={marketType} theme={theme}>
			<PanelCardTitle theme={theme}>24h low</PanelCardTitle>
			<PanelCardValue theme={theme}>
				{formatNumberToUSFormat(roundAndFormatNumber(lowPrice, pricePrecision, false))}
			</PanelCardValue>
		</PanelCard>
	</>
);

export default React.memo(LowHighPrice);
