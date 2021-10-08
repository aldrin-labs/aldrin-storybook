import React, { useState, useEffect } from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import ArrowUp from '@icons/ArrowUp.svg'
import ArrowDown from '@icons/ArrowDown.svg'

import {
  LastTradeContainer,
  LastTradeContainerMobile,
  LastTradePrice,
} from './LastTrade.styles'

import { OrderbookMode } from '../../OrderBookTableContainer.types'

interface IProps {
  data: { marketTickers: [string] }
  group: number
  mode: OrderbookMode
  marketType: 0 | 1
  minPriceDigits: number
  getPriceQuery: {
    getPrice: number
    subscribeToMoreFunction: () => () => void
  }
  getFundingRateQueryRefetch: () => void
  getMarkPriceQuery: {
    getMarkPrice: {
      symbol: string
      markPrice: number
    }
    subscribeToMoreFunction: () => () => void
  }
  updateTerminalPriceFromOrderbook: (price: number | string) => void
}

const LastTrade = (props: IProps) => {
  const {
    updateTerminalPriceFromOrderbook,
    getPriceQuery,
    getMarkPriceQuery,
    marketType,
    theme,
    markPrice,
    pricePrecision,
    terminalViewMode,
  } = props

  const [prevLastPrice, setPrevLastPrice] = useState(0)
  const [currentLastPrice, setCurrentLastPrice] = useState(0)

  useEffect(() => {
    setPrevLastPrice(currentLastPrice)
    setCurrentLastPrice(markPrice)
  }, [markPrice])

  const isPriceDown = prevLastPrice > currentLastPrice
  return (
    <>
      <LastTradeContainer
        terminalViewMode={terminalViewMode}
        theme={theme}
        onClick={() =>
          updateTerminalPriceFromOrderbook(
            Number(markPrice).toFixed(pricePrecision)
          )
        }
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <LastTradePrice
            style={{ color: isPriceDown ? '#F69894' : '#A5E898' }}
            theme={theme}
          >
            {Number(markPrice).toFixed(pricePrecision)}
          </LastTradePrice>

          <SvgIcon src={isPriceDown ? ArrowDown : ArrowUp} />
        </div>
      </LastTradeContainer>
    </>
  )
}

export const LastTradeMobile = (props: IProps) => {
  const {
    updateTerminalPriceFromOrderbook,
    getPriceQuery,
    getMarkPriceQuery,
    marketType,
    theme,
    markPrice,
    pricePrecision,
    terminalViewMode,
  } = props

  const [prevLastPrice, setPrevLastPrice] = useState(0)
  const [currentLastPrice, setCurrentLastPrice] = useState(0)

  useEffect(() => {
    setPrevLastPrice(currentLastPrice)
    setCurrentLastPrice(markPrice)
  }, [markPrice])

  const isPriceDown = prevLastPrice > currentLastPrice

  return (
    <>
      <LastTradeContainerMobile
        terminalViewMode={terminalViewMode}
        theme={theme}
        onClick={() =>
          updateTerminalPriceFromOrderbook(
            Number(markPrice).toFixed(pricePrecision)
          )
        }
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <LastTradePrice
            style={{ color: isPriceDown ? '#F69894' : '#A5E898' }}
            theme={theme}
          >
            {Number(markPrice).toFixed(pricePrecision)}
          </LastTradePrice>

          <SvgIcon src={isPriceDown ? ArrowDown : ArrowUp} />
        </div>
      </LastTradeContainerMobile>
    </>
  )
}

export default LastTrade
