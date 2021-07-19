import React from 'react'

import { TerminalHeaderBlockProps } from '../types'

import {
  StyledSelect,
  StyledOption,
} from '@sb/components/TradingWrapper/styles'

import { getMarks } from '@core/utils/chartPageUtils'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { LeverageLabel } from '@sb/components/TradingWrapper/styles'

import SmallSlider from '@sb/components/Slider/SmallSlider'
import { TerminalHeaders, TerminalHeader, BlockHeader } from '../styles'

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

export const TerminalHeadersBlock = ({
  pair,
  theme,
  entryPoint,
  marketType,
  selectedKey,
  maxLeverage,
  initialMargin,
  startLeverage,
  updateLeverage,
  quantityPrecision,
  priceForCalculate,
  componentMarginType,
  updateSubBlockValue,
  changeMarginTypeWithStatus,
  updateStopLossAndTakeProfitPrices,
}: TerminalHeaderBlockProps) => {
  return (
    <TerminalHeaders>
      <TerminalHeader
        theme={theme}
        key={'entryPoint'}
        width={'calc(100% / 3)'}
        justify={marketType === 0 ? 'flex-start' : 'space-around'}
        style={{ borderLeft: 'none' }}
      >
        <DarkTooltip title={'Conditions for opening your position.'}>
          <BlockHeader
            theme={theme}
            style={{
              cursor: 'default',
              textTransform: 'capitalize',
            }}
          >
            1. Set <span style={{ fontFamily: 'Avenir Next Demi' }}>Entry</span>{' '}
            conditions
          </BlockHeader>
        </DarkTooltip>

        {marketType === 1 && (
          <div
            style={{
              display: 'flex',
              width: '85%',
              alignItems: 'center',
            }}
          >
            <StyledSelect
              theme={theme}
              onChange={() => {
                console.log('componentMarginType', componentMarginType)
                changeMarginTypeWithStatus(
                  componentMarginType,
                  selectedKey,
                  pair
                )
              }}
              value={componentMarginType}
              style={{
                color: theme.palette.dark.main,
                width: '30%',
                marginRight: '1rem',
              }}
            >
              <StyledOption value={'cross'}>cross leverage:</StyledOption>
              <StyledOption value={'isolated'}>isolated leverage:</StyledOption>
            </StyledSelect>

            <SmallSlider
              style={{ height: '2rem', width: '60%' }}
              min={1}
              max={maxLeverage}
              defaultValue={startLeverage}
              value={
                !entryPoint.order.leverage
                  ? startLeverage
                  : entryPoint.order.leverage
              }
              valueSymbol={'X'}
              marks={getMarks(maxLeverage)}
              onChange={(leverage: number) => {
                updateSubBlockValue('entryPoint', 'order', 'leverage', leverage)

                const total = initialMargin * leverage

                updateSubBlockValue(
                  'entryPoint',
                  'order',
                  'total',
                  stripDigitPlaces(total, marketType === 1 ? 2 : 8)
                )

                updateSubBlockValue(
                  'entryPoint',
                  'order',
                  'amount',
                  stripDigitPlaces(
                    total / priceForCalculate,
                    marketType === 1 ? quantityPrecision : 8
                  )
                )

                updateStopLossAndTakeProfitPrices({
                  leverage,
                })
              }}
              onAfterChange={(leverage: number) => {
                // add args
                updateLeverage(leverage, selectedKey.keyId, pair)
              }}
              sliderContainerStyles={{
                width: '65%',
                margin: '0 auto',
              }}
              trackBeforeBackground={theme.palette.green.main}
              handleStyles={{
                width: '1.2rem',
                height: '2rem',
                // top: '.3rem',
                border: 'none',
                borderRadius: '0',
                backgroundColor: '#036141',
                // marginTop: '-.28rem',
                boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
                transform: 'translate(-50%, -15%) !important',
                '@media only screen and (maxWidth: 1440px)': {
                  top: '1.3rem',
                },
              }}
              dotStyles={{
                border: 'none',
                backgroundColor: theme.palette.slider.dots,
              }}
              activeDotStyles={{
                backgroundColor: theme.palette.green.main,
              }}
              markTextSlyles={{
                color: theme.palette.grey.light,
                fontSize: '1rem',
              }}
              railStyle={{
                backgroundColor: theme.palette.slider.rail,
              }}
            />
            <LeverageLabel theme={theme} style={{ width: '12.5%' }}>
              {entryPoint.order.leverage || 1}x
            </LeverageLabel>
          </div>
        )}
      </TerminalHeader>
      <TerminalHeader
        theme={theme}
        width={'calc(100% / 3)'}
        padding={'0rem 1.5rem'}
        justify={'flex-start'}
        key={'stopLoss'}
        style={{ borderLeft: 'none' }}
      >
        <DarkTooltip
          title={
            'Conditions for closing your position, provided that it is unprofitable.'
          }
        >
          <BlockHeader
            style={{
              textTransform: 'capitalize',
              cursor: 'default',
            }}
            theme={theme}
          >
            2. Set up a{' '}
            <span style={{ fontFamily: 'Avenir Next Demi' }}>Stop Loss</span>
          </BlockHeader>
        </DarkTooltip>
      </TerminalHeader>
      <TerminalHeader
        theme={theme}
        key={'takeProfit'}
        width={'calc(100% / 3)'}
        padding={'0rem 1.5rem'}
        justify={'space-between'}
        style={{ borderLeft: 'none', borderRight: 'none' }}
      >
        <DarkTooltip
          title={
            'Conditions for closing your position, provided that it is profitable.'
          }
        >
          <BlockHeader
            style={{
              textTransform: 'capitalize',
              cursor: 'default',
            }}
            theme={theme}
          >
            3. Set up a{' '}
            <span style={{ fontFamily: 'Avenir Next Demi' }}>Take Profit</span>
          </BlockHeader>
        </DarkTooltip>
        {/* <a
          href="https://cryptocurrencies.ai/smartTrading"
          target={'_blank'}
          rel={'noreferrer noopener'}
          style={{
            color: theme.palette.blue.main,
            fontSize: '1.5rem',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Learn how to trade with Smart Order &rarr;
        </a> */}
      </TerminalHeader>
    </TerminalHeaders>
  )
}

export const TerminalHeadersBlockMemo = React.memo(TerminalHeadersBlock)
