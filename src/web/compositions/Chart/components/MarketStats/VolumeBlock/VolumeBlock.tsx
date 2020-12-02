import React from 'react';
import { Theme } from '@material-ui/core';

import SvgIcon from '@sb/components/SvgIcon';
import BinanceLogo from '@icons/binanceLogo.svg';
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip';
import { PanelCard, PanelCardTitle, PanelCardValue, PanelCardSubValue } from '../../../Chart.styles';
import { formatNumberToUSFormat, stripDigitPlaces, roundAndFormatNumber } from '@core/utils/PortfolioTableUtils';

export interface IProps {
	volume: number;
	theme: Theme;
	marketType: 0 | 1;
	symbol: string;
}

const VolumeBlock = ({ volume, theme, marketType, symbol }: IProps) => {
	const [ base, quote ] = symbol.split('_');

	return (
		<DarkTooltip title={'Our liquidity provider’s volume.'}>
			<PanelCard
				marketType={marketType}
				theme={theme}
				style={{
					borderRight: marketType === 0 ? '0' : theme.palette.border.main,
					position: 'relative'
				}}
			>
				<PanelCardTitle theme={theme}>24h volume</PanelCardTitle>
				<PanelCardValue theme={theme}>
					{formatNumberToUSFormat(stripDigitPlaces(volume))}
					{` ${marketType === 0 ? quote : base}`}
				</PanelCardValue>
				<SvgIcon style={{ position: 'absolute', right: '1rem' }} src={BinanceLogo} />
			</PanelCard>
		</DarkTooltip>
	);
};

export default React.memo(VolumeBlock);
