import { Card } from '@material-ui/core'
import useMobileSize from '@webhooks/useMobileSize'
import BN from 'bn.js'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

import { TriggerTitle } from '@sb/components/ChartCardHeader/styles'
import { CustomCard } from '@sb/compositions/Chart/Chart.styles'
import { cancelOrder as cancel, amendOrder } from '@sb/dexUtils/send'
import { useWallet } from '@sb/dexUtils/wallet'

import { CHARTS_API_URL, PROTOCOL } from '@core/utils/config'

import { useSerumConnection } from '../../dexUtils/connection'
import {
  useOpenOrders,
  useSelectedBaseCurrencyAccount,
  useSelectedQuoteCurrencyAccount,
  useSelectedOpenOrdersAccount,
} from '../../dexUtils/markets'
import {
  Order,
  MESSAGE_TYPE,
  SingleChartProps,
  SingleChartWithButtonsProps,
} from './Chart.types'

const Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-shadow: none;
  border: none;
  border-radius: 0;
`

// TODO: types
const orderToMessage = (order: any): Order => {
  return {
    orderId: order.orderId.toJSON(),
    marketName: order.marketName,
    price: order.price,
    side: order.side,
    size: order.size,
  }
}

const round = (v: number, dec: number) => Math.round(v / dec) * dec

type OrderCancel = (orderId: string) => void
type OrderAmend = (orderId: string, price: number) => void

export const SingleChart = (props: SingleChartProps) => {
  const { additionalUrl } = props
  const { wallet } = useWallet()
  const isMobile = useMobileSize()
  const openOrders = useOpenOrders()
  const connection = useSerumConnection()

  const baseCurrencyAccount = useSelectedBaseCurrencyAccount()
  const quoteCurrencyAccount = useSelectedQuoteCurrencyAccount()
  const openOrdersAccount = useSelectedOpenOrdersAccount(true)

  const iframe = useRef<HTMLIFrameElement | null>(null)
  const cancelCallback = useRef<OrderCancel | null>(null)
  const amendCallback = useRef<OrderAmend | null>(null)

  const { data: themeMode } = useSWR('theme')

  useEffect(() => {
    cancelCallback.current = async (orderId: string) => {
      const ordId = new BN(orderId, 16)
      const order = openOrders?.find((_: any) => ordId.eq(_.orderId))
      if (order) {
        await cancel({
          order,
          market: order.market,
          connection,
          wallet,
        })
      }
    }

    amendCallback.current = async (orderId: string, price: number) => {
      const ordId = new BN(orderId, 16)
      const order = openOrders?.find((_: any) => ordId.eq(_.orderId))
      if (
        order &&
        openOrdersAccount &&
        baseCurrencyAccount &&
        quoteCurrencyAccount
      ) {
        await amendOrder({
          order,
          market: order.market,
          connection,
          wallet,
          amendOrder: { price: round(price, order.market.tickSize) },
          baseCurrencyAccount,
          quoteCurrencyAccount,
          openOrdersAccount,
        })
      }
    }
  }, [
    connection,
    wallet,
    openOrders,
    baseCurrencyAccount,
    quoteCurrencyAccount,
    openOrdersAccount,
  ])

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      const { data } = e
      switch (data.messageType) {
        case MESSAGE_TYPE.ORDER_CANCEL: {
          const cancelOrder = cancelCallback.current
          if (cancelOrder) {
            cancelOrder(data.orderId)
          }
          return true
        }
        case MESSAGE_TYPE.ORDER_AMEND: {
          const amend = amendCallback.current
          if (amend) {
            amend(data.orderId, data.price)
          }
          return true
        }
        default:
          return false
      }
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  useEffect(() => {
    if (openOrders && iframe.current) {
      const orders = openOrders.map(orderToMessage)
      const message = { messageType: MESSAGE_TYPE.ACCOUNT_ORDERS, orders }
      iframe?.current.contentWindow?.postMessage(message, '*')
    }
  }, [openOrders])

  return (
    <Wrapper>
      <iframe
        allowFullScreen
        style={{ borderWidth: 0 }}
        src={`${PROTOCOL}//${CHARTS_API_URL}${additionalUrl}&theme=serum-${themeMode}&isMobile=${isMobile}${
          wallet.connected ? `&user_id=${wallet.publicKey}` : ''
        }`}
        height="100%"
        id={`tv_chart_${themeMode}`}
        title="Chart"
        key={`${themeMode}${additionalUrl}`}
        ref={iframe}
      />
    </Wrapper>
  )
}

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  borderRight: 'none',
  borderTop: 'none',
}

const ChartTitle = styled.span`
  width: calc(100% - 20rem);
  white-space: pre-line;
  text-align: left;
  color: ${(props) => props.theme.colors.white1};
  text-transform: capitalize;
  font-size: 1.3rem;
  line-height: 1rem;
  padding: 0 1rem;
`

export const SingleChartWithButtons = (props: SingleChartWithButtonsProps) => {
  const { currencyPair, base, quote, marketType } = props
  const theme = localStorage.getItem('theme')

  return (
    <CustomCard id="tradingViewChart" style={CARD_STYLE}>
      <TriggerTitle>
        <ChartTitle>Chart</ChartTitle>
      </TriggerTitle>
      <SingleChart
        key={`${theme}${base}/${quote}`}
        currencyPair={currencyPair}
        additionalUrl={`/?symbol=${base}/${quote}&marketType=${marketType}&exchange=serum`}
      />
    </CustomCard>
  )
}

export default SingleChartWithButtons
