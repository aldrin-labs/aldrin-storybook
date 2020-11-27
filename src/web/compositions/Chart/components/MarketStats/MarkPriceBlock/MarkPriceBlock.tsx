import React from 'react';
import { Theme } from '@material-ui/core';

import { PanelCard, PanelCardTitle, PanelCardValue, PanelCardSubValue } from '../../../Chart.styles';
import { formatNumberToUSFormat, stripDigitPlaces, roundAndFormatNumber } from '@core/utils/PortfolioTableUtils';

export interface IProps {
	marketType: 0 | 1;
	theme: Theme;
	lastMarketPrice: number;
	pricePrecision: number;
}

const MarkPriceBlock = ({ marketType, theme, lastMarketPrice, pricePrecision }: IProps) => (
	<PanelCard marketType={marketType} theme={theme}>
		<PanelCardValue
			theme={theme}
			style={{
				whiteSpace: 'nowrap',
				fontSize: '2rem',
				textAlign: 'center'
			}}
		>
			{formatNumberToUSFormat(roundAndFormatNumber(lastMarketPrice, pricePrecision, false))}
		</PanelCardValue>
	</PanelCard>
);

export default React.memo(MarkPriceBlock);
