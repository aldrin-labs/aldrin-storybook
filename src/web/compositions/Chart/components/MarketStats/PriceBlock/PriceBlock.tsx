import React from 'react'
import { Theme } from '@material-ui/core';

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { PanelCard, PanelCardTitle, PanelCardValue, PanelCardSubValue } from '../../../Chart.styles';
import PriceTitle from './PriceTitle'
import { formatNumberToUSFormat, stripDigitPlaces, roundAndFormatNumber } from '@core/utils/PortfolioTableUtils';

export interface IProps {
	marketType: 0 | 1;
	theme: Theme;
    pricePrecision: number;
    lastMarketPrice: number
    markPrice: number
}

const PriceBlock = ({ marketType, theme, pricePrecision, lastMarketPrice, markPrice }: IProps) => (
    <DarkTooltip
    title={
      'Estimate of the true value of a contract (fair price) when compared to its actual trading price (last price).'
    }
  >
    <PanelCard marketType={marketType} theme={theme}>
      <PriceTitle marketType={marketType} theme={theme} />
      <span style={{ display: 'flex', justifyContent: 'space-between' }}>
        {marketType === 0 && (
          <PanelCardValue theme={theme}>
            {formatNumberToUSFormat(
              roundAndFormatNumber(lastMarketPrice, pricePrecision, false)
            )}
          </PanelCardValue>
        )}

        {marketType === 1 && (
          <PanelCardValue theme={theme}>
            {formatNumberToUSFormat(
              roundAndFormatNumber(markPrice, pricePrecision, false)
            )}
          </PanelCardValue>
        )}
      </span>
    </PanelCard>
  </DarkTooltip>
)

export default React.memo(PriceBlock)