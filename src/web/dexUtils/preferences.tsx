import React, { useContext, useMemo } from 'react'
import { useLocalStorageState } from './utils'
import { useInterval } from './useInterval'
import { useConnection } from './connection'
import { useWallet } from './wallet'
import {
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedOpenOrdersAccount,
  useSelectedQuoteCurrencyAccount,
} from './markets'
import { settleFunds } from './send'

const PreferencesContext = React.createContext(null)

export function PreferencesProvider({ children }) {
  const [autoSettleEnabled, setAutoSettleEnabled] = useLocalStorageState(
    'autoSettleEnabled',
    true
  )

  const { connected, wallet } = useWallet()
  const connection = useConnection()

  const { market, baseCurrency, quoteCurrency } = useMarket()

  const openOrdersAccount = useSelectedOpenOrdersAccount()
  const baseTokenAccount = useSelectedBaseCurrencyAccount()
  const quoteTokenAccount = useSelectedQuoteCurrencyAccount()

  useInterval(() => {
    const autoSettle = async () => {
      // const Markets = (marketList || []).map((m) => m.market);
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
        // console.log('Error auto settling funds: ' + e.message)
      }
    }

    connected && wallet?.autoApprove && autoSettleEnabled && autoSettle()
  }, 10000)

  return (
    <PreferencesContext.Provider
      value={{
        autoSettleEnabled,
        setAutoSettleEnabled,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('Missing preferences context')
  }
  return {
    autoSettleEnabled: context.autoSettleEnabled,
    setAutoSettleEnabled: context.setAutoSettleEnabled,
  }
}
