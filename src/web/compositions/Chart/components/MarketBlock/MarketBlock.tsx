import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from 'styled-components'

import SvgIcon from '@sb/components/SvgIcon'
import { TokenExternalLinks } from '@sb/components/TokenExternalLinks'
import { TokenIcon } from '@sb/components/TokenIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { getTokenMintAddressByName, useMarket } from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { getDecimalCount } from '@sb/dexUtils/utils'

import ArrowLeft from '@icons/ArrowLeft.svg'
import ChartIcon from '@icons/chartIcon.svg'

import AutoSuggestSelect from '../../Inputs/AutoSuggestSelect/AutoSuggestSelect'
import { MintsPopup } from '../../Inputs/SelectWrapper/MintsPopup'
import MarketStats from '../MarketStats/MarketStats'
import {
  MarketStatsContainer,
  MobileMarketStatsContainer,
} from './MarketBlock.styles'

const selectStyles = (theme) => ({
  height: '100%',
  background: theme.colors.white5,
  marginRight: '.8rem',
  cursor: 'pointer',
  padding: 0,
  backgroundColor: theme.colors.white5,
  border: `none`,
  borderRadius: '0.75rem',
  boxShadow: '0px 0px 1.2rem rgba(8, 22, 58, 0.1)',
  width: '20rem',
  '& div': {
    fontFamily: 'Avenir Next Demi',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: theme.colors.white1,
    textTransform: 'uppercase',
  },
  '& svg': {
    color: theme.colors.white1,
  },
  '.custom-select-box__control': {
    padding: '0 .75rem',
  },
  '.custom-select-box__menu': {
    minWidth: '130px',
    marginTop: '0',
    borderRadius: '0',
    boxShadow: '0px 4px 8px rgba(10,19,43,0.1)',
  },
  '@media (max-width: 600px)': {
    border: `none`,
    width: '19rem',
    '& div': { fontSize: '2rem' },
    '& svg': {
      color: theme.colors.white5,
    },
  },
})

const MarketBlock = ({
  activeExchange = 'serum',
  marketType = 0,
  updateTerminalViewMode,
  terminalViewMode,
}) => {
  const theme = useTheme()
  const { market, customMarkets } = useMarket()
  const location = useLocation()
  const [isMintsPopupOpen, setIsMintsPopupOpen] = useState(false)

  const tokenMap = useTokenInfos()
  const pair = location.pathname.split('/')[3]

  const quantityPrecision =
    market?.minOrderSize && getDecimalCount(market.minOrderSize)
  const pricePrecision = market?.tickSize && getDecimalCount(market.tickSize)
  const marketAddress = market?.address?.toBase58()

  if (!pair) {
    return null
  }

  const [base] = pair.split('_')

  const marketName = pair.replaceAll('_', '/')
  const currentMarket = customMarkets?.find(
    (el) => el?.name.replaceAll('_', '/') === marketName
  )

  const isCustomUserMarket = currentMarket?.isCustomUserMarket

  const isPrivateCustomMarket =
    currentMarket?.isPrivateCustomMarket !== undefined && !isCustomUserMarket

  const isRINPair =
    pair.includes('RIN') && !isPrivateCustomMarket && !isCustomUserMarket

  return (
    <>
      <MarketStatsContainer>
        <Row justify="flex-start">
          <DarkTooltip
            title={
              isPrivateCustomMarket
                ? 'This is an unofficial custom market. Use at your own risk.'
                : isCustomUserMarket
                ? 'This is curated but unofficial market.'
                : 'This is the official market.'
            }
          >
            <div
              style={{
                width: '5rem',
                fontSize: '2rem',
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              <TokenIcon
                mint={getTokenMintAddressByName(base)}
                size={24}
                isAdditionalCustomUserMarket={isPrivateCustomMarket}
              />
            </div>
          </DarkTooltip>
          <div
            data-tut="pairs"
            style={{ height: '100%', padding: '1rem 0', position: 'relative' }}
          >
            <AutoSuggestSelect
              value={pair}
              id="pairSelector"
              style={{ width: '20rem' }}
              activeExchange={activeExchange}
              selectStyles={{ ...selectStyles(theme) }}
              marketType={marketType}
              pair={pair}
              quantityPrecision={quantityPrecision}
              pricePrecision={pricePrecision}
              market={market}
              tokenMap={tokenMap}
              isMintsPopupOpen={isMintsPopupOpen}
              setIsMintsPopupOpen={() => setIsMintsPopupOpen}
            />
          </div>

          <MarketStats
            isRINPair={isRINPair}
            symbol={pair}
            marketType={marketType}
            exchange={activeExchange}
            quantityPrecision={quantityPrecision}
            pricePrecision={pricePrecision}
          />
          <Row align="baseline">
            <TokenExternalLinks
              tokenName={base}
              marketAddress={marketAddress}
              marketPair={pair}
              onInfoClick={() => {
                setIsMintsPopupOpen(true)
              }}
            />
          </Row>
        </Row>
        <Row>
          {/* <Row align="flex-start" direction="column">
            <Title color={theme.colors.green3}>
              Try out new Aldrin’s orderbook DEX.
            </Title>
            <Title color={theme.colors.green3}>Learn More</Title>
          </Row> */}
          {/* <ExclamationMark
            theme={theme}
            margin="0 0 0 2rem"
            fontSize="5rem"
            color={theme.colors.green3}
          /> */}
        </Row>
        <MintsPopup
          symbol={marketName}
          marketAddress={marketAddress}
          open={isMintsPopupOpen}
          onClose={() => setIsMintsPopupOpen(false)}
        />
      </MarketStatsContainer>
      <MobileMarketStatsContainer>
        <AutoSuggestSelect
          value={pair}
          id="pairSelector"
          activeExchange={activeExchange}
          selectStyles={{ ...selectStyles(theme) }}
          marketType={marketType}
          pair={pair}
          quantityPrecision={quantityPrecision}
          pricePrecision={pricePrecision}
          market={market}
          tokenMap={tokenMap}
          isMintsPopupOpen={isMintsPopupOpen}
          setIsMintsPopupOpen={() => setIsMintsPopupOpen}
        />
        <Row>
          <MarketStats
            isRINPair={isRINPair}
            symbol={pair}
            marketType={marketType}
            exchange={activeExchange}
            quantityPrecision={quantityPrecision}
            pricePrecision={pricePrecision}
          />
          <SvgIcon
            src={terminalViewMode === 'mobileChart' ? ArrowLeft : ChartIcon}
            width="5rem"
            height="auto"
            style={{ margin: '0 0 0 2rem', padding: '1rem' }}
            onClick={() => {
              if (terminalViewMode === 'mobileChart') {
                updateTerminalViewMode('default')
              } else {
                updateTerminalViewMode('mobileChart')
              }
            }}
          />
        </Row>
      </MobileMarketStatsContainer>
    </>
  )
}

export default MarketBlock
