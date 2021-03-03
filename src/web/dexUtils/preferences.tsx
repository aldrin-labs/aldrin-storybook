import React, { useContext, useMemo } from 'react';
import { useLocalStorageState } from './utils';
import { useInterval } from './useInterval';
import { useConnection } from './connection';
import { useWallet } from './wallet';
import {useAllMarkets, useTokenAccounts, useMarket, useSelectedTokenAccounts, getSelectedTokenAccountForMint } from './markets';
import { settleAllFunds, settleFunds } from './send';
import {PreferencesContextValues} from "./types";

const PreferencesContext = React.createContext<PreferencesContextValues | null>(null);

export function PreferencesProvider({ children }) {
  console.log('rerender PreferencesProvider')
  const [autoSettleEnabled, setAutoSettleEnabled] = useLocalStorageState(
    'autoSettleEnabled',
    true,
  );

  const [tokenAccounts] = useTokenAccounts();
  const { connected, wallet } = useWallet();

  // const [marketList] = useAllMarkets();
  const { market } = useMarket()
  const connection = useConnection();
  const [selectedTokenAccounts] = useSelectedTokenAccounts();

  console.log('wallet?.autoApprove', wallet?.autoApprove)

  useInterval(() => {
    console.log('interval')
    const autoSettle = async () => {
      // const markets = (marketList || []).map((m) => m.market);
      try {
        console.log('Auto settling');
        const openOrders = await market.findOpenOrdersAccountsForOwner(
          connection,
          wallet.publicKey
        )
        console.log('openOrders', openOrders)
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
          tokenAccounts
        })
      } catch (e) {
        console.log('Error auto settling funds: ' + e.message);
      }
    };

    connected && wallet?.autoApprove && autoSettleEnabled && autoSettle();
  }, 10000);

  return (
    <PreferencesContext.Provider
      value={{
        autoSettleEnabled,
        setAutoSettleEnabled,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('Missing preferences context')
  }
  return {
    autoSettleEnabled: context.autoSettleEnabled,
    setAutoSettleEnabled: context.setAutoSettleEnabled,
  };
}
