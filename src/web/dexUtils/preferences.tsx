import React, { useContext, useMemo } from 'react'
import { useLocalStorageState } from './utils'
import { useInterval } from './useInterval'
import { useConnection } from './connection'
import { useWallet } from './wallet'
import {
  useAllMarkets,
  useTokenAccounts,
  useMarket,
  useSelectedTokenAccounts,
  getSelectedTokenAccountForMint,
} from './markets'
import { settleAllFunds, settleFunds } from './send'
import { PreferencesContextValues } from './types'

const PreferencesContext = React.createContext<PreferencesContextValues | null>(
  null
)

export function PreferencesProvider({ children }) {
  const [autoSettleEnabled, setAutoSettleEnabled] = useLocalStorageState(
    'autoSettleEnabled',
    true
  )

  const [tokenAccounts] = useTokenAccounts()
  const { connected, wallet } = useWallet()

  // const [marketList] = useAllMarkets();
  const { market, baseCurrency, quoteCurrency } = useMarket()
  const connection = useConnection()
  const [selectedTokenAccounts] = useSelectedTokenAccounts()

  useInterval(() => {
    const autoSettle = async () => {
      // const markets = (marketList || []).map((m) => m.market);
      try {
        const openOrders = await market.findOpenOrdersAccountsForOwner(
          connection,
          wallet.publicKey
        )

        const selectedOpenOrders = openOrders[0]

        const baseExists =
        selectedOpenOrders && selectedOpenOrders.baseTokenTotal && selectedOpenOrders.baseTokenFree

        const quoteExists =
          selectedOpenOrders && selectedOpenOrders.quoteTokenTotal && selectedOpenOrders.quoteTokenFree

        // await settleAllFunds({ connection, wallet, tokenAccounts: (tokenAccounts || []), markets, selectedTokenAccounts });
        await settleFunds({
          market,
          openOrders,
          connection,
          wallet,
          baseCurrencyAccount: getSelectedTokenAccountForMint(
            tokenAccounts,
            market?.baseMintAddress
          ),
          quoteCurrencyAccount: getSelectedTokenAccountForMint(
            tokenAccounts,
            market?.quoteMintAddress
          ),
          selectedTokenAccounts: selectedTokenAccounts,
          tokenAccounts,
          baseCurrency,
          quoteCurrency,
          baseUnsettled: baseExists && market ? market.baseSplSizeToNumber(selectedOpenOrders.baseTokenFree) : null,
          quoteUnsettled: quoteExists && market ? market.quoteSplSizeToNumber(selectedOpenOrders.quoteTokenFree) : null,
        })
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
