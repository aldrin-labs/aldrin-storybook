import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'

import SvgIcon from '@sb/components/SvgIcon'

import ArrowDown from '@icons/ArrowDown.svg'
import ArrowUp from '@icons/ArrowUp.svg'

import { OrderbookMode } from '../../OrderBookTableContainer.types'
import {
  LastTradeContainer,
  LastTradeContainerMobile,
  LastTradePrice,
} from './LastTrade.styles'

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
    markPrice,
    pricePrecision,
    terminalViewMode,
  } = props
  const theme = useTheme()
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
            style={{
              color: isPriceDown
                ? theme.colors.obRedFont
                : theme.colors.obGreenFont,
            }}
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
            style={{ color: isPriceDown ? '#F69894' : '#53DF11' }}
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
