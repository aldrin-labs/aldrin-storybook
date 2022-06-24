import { OpenOrders } from '@project-serum/serum'
import React from 'react'

import { useConnection } from './connection'
import {
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedOpenOrdersAccount,
  useSelectedQuoteCurrencyAccount,
} from './markets'
import { settleFunds } from './send'
import { useInterval } from './useInterval'
import { useWallet } from './wallet'

// TODO: move to a separate file
const AutoSettlmentHandlerInner: React.FC<{ openOrdersAccount: OpenOrders }> = (
  props
) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const { openOrdersAccount } = props

  const baseTokenAccount = useSelectedBaseCurrencyAccount()
  const quoteTokenAccount = useSelectedQuoteCurrencyAccount()
  const { market, baseCurrency, quoteCurrency } = useMarket()

  useInterval(() => {
    const autoSettle = async () => {
      try {
        const selectedOpenOrders = openOrdersAccount

        const baseExists =
          selectedOpenOrders &&
          selectedOpenOrders.baseTokenTotal &&
          selectedOpenOrders.baseTokenFree

        const quoteExists =
          selectedOpenOrders &&
          selectedOpenOrders.quoteTokenTotal &&
          selectedOpenOrders.quoteTokenFree

        const baseUnsettled =
          baseExists && market
            ? market.baseSplSizeToNumber(selectedOpenOrders.baseTokenFree)
            : null
        const quoteUnsettled =
          quoteExists && market
            ? market.quoteSplSizeToNumber(selectedOpenOrders.quoteTokenFree)
            : null

        if (baseUnsettled > 0 || quoteUnsettled > 0) {
          await settleFunds({
            market,
            openOrders: openOrdersAccount,
            connection,
            wallet,
            baseCurrency,
            quoteCurrency,
            baseTokenAccount,
            quoteTokenAccount,
            baseUnsettled,
            quoteUnsettled,
          })
        }
      } catch (e) {
        // console.warn(`Unable to auto settling funds: ${e.message}`)
      }
    }

    autoSettle()
  }, 10000)
  return null
}

const AutoSettlmentHandler = () => {
  const openOrdersAccount = useSelectedOpenOrdersAccount()
  return (
    <>
      {/* Add inner handler to avoid unnecessary requests to RPC */}
      {openOrdersAccount ? (
        <AutoSettlmentHandlerInner openOrdersAccount={openOrdersAccount} />
      ) : null}
    </>
  )
}

export const PreferencesProvider: React.FC = ({ children }) => {
  const { connected, wallet } = useWallet()

  return (
    <>
      {connected && wallet?.autoApprove && <AutoSettlmentHandler />}
      {children}
    </>
  )
}
