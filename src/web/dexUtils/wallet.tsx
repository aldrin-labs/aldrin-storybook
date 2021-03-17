import React, { useContext, useEffect, useMemo, useState } from 'react';
import Wallet from '@project-serum/sol-wallet-adapter';
import MathWallet from '@sb/dexUtils/MathWallet/MathWallet';
import SolongWallet from '@sb/dexUtils/SolongWallet/SolongWallet'
import CcaiWallet from '@sb/dexUtils/CcaiWallet/CcaiWallet'
import { notify } from './notifications';
import { useConnectionConfig } from './connection';
import { useLocalStorageState } from './utils';

export const WALLET_PROVIDERS = [
  // { name: 'solflare.com', url: 'https://solflare.com/access-wallet' },
  { name: 'cryptocurrencies.ai', url: 'https://wallet.cryptocurrencies.ai' },
  { name: 'sollet.io', url: 'https://www.sollet.io' },
  { name: 'mathwallet.org', url: 'https://www.mathwallet.org' },
  { name: "solongwallet.com", url: "https://solongwallet.com" },
];

const getWalletByProviderUrl = (providerUrl: string) => {
  switch (providerUrl) {
    case 'https://solongwallet.com': {
      return SolongWallet
    }
    case 'https://www.mathwallet.org': {
      return MathWallet
    }
    case 'https://wallet.cryptocurrencies.ai': {
      return CcaiWallet
    }
    default: {
      return Wallet
    }
  }
}

const WalletContext = React.createContext(null);

export function WalletProvider({ children }) {
  const [connected, setConnected] = useState(false);

  const [autoConnect, setAutoConnect] = useState(false);

  const { endpoint } = useConnectionConfig();
  const [savedProviderUrl, setProviderUrl] = useLocalStorageState(
    'walletProvider',
    'https://www.sollet.io',
  );

  let providerUrl;
  if (!savedProviderUrl) {
    providerUrl = 'https://www.sollet.io';
  } else {
    providerUrl = savedProviderUrl;
  }

  const wallet = useMemo(() => { 
    const WalletClass = getWalletByProviderUrl(providerUrl)
    const wallet = new WalletClass(providerUrl, endpoint)

    console.log('providerUrl', providerUrl, 'endpoint', endpoint, 'wallet', wallet)


    return wallet
  }, [
    providerUrl,
    endpoint,
  ]);

  useEffect(() => {

    if (wallet) {
      wallet.on('connect', async () => {
        if (wallet.publicKey) {
          console.log('connected');
          setConnected(true);
          const walletPublicKey = wallet.publicKey.toBase58();
          const keyToDisplay =
            walletPublicKey.length > 20
              ? `${walletPublicKey.substring(
                  0,
                  7,
                )}.....${walletPublicKey.substring(
                  walletPublicKey.length - 7,
                  walletPublicKey.length,
                )}`
              : walletPublicKey;

          notify({
            message: 'Wallet update',
            description: 'Connected to wallet ' + keyToDisplay,
          });
        }
      });
  
      wallet.on('disconnect', () => {
        setConnected(false);
        notify({
          message: 'Wallet update',
          description: 'Disconnected from wallet',
        });
      });
    }

    return () => {
      setConnected(false);
      if (wallet) {
        wallet.disconnect();
        setConnected(false);
      }
    };
  }, [wallet]);

  useEffect(() => {
    if (wallet && autoConnect) {
      wallet.connect();
      setAutoConnect(false);
    }

    return () => {};
  }, [wallet, autoConnect]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        providerUrl,
        setProviderUrl,
        setAutoConnect,
        providerName:
          WALLET_PROVIDERS.find(({ url }) => url === providerUrl)?.name ??
          providerUrl,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('Missing wallet context');
  }
  return {
    connected: context.connected,
    wallet: context.wallet,
    providerUrl: context.providerUrl,
    setProvider: context.setProviderUrl,
    providerName: context.providerName,
    setAutoConnect: context.setAutoConnect,
  };
}
