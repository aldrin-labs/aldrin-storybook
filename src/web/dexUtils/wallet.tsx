import React, { useContext, useEffect, useMemo, useState } from 'react';
import Wallet from '@project-serum/sol-wallet-adapter';
import MathWallet from '@sb/dexUtils/MathWallet/MathWallet';
import SolongWallet from '@sb/dexUtils/SolongWallet/SolongWallet'
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

const WalletContext = React.createContext(null);

export function WalletProvider({ children }) {
  const [connected, setConnected] = useState(false);

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

  // old code should be removed
  // const isMathWallet = !!providerUrl.match('https://www.mathwallet.org')
  // const isSolongWallet = !!providerUrl.match('https://solongwallet.com')
  // const WalletClass = isMathWallet ? MathWallet : isSolongWallet ? SolongWallet : Wallet
  
  const wallet = useMemo(() => { 
    const isMathWallet = !!providerUrl.match('https://www.mathwallet.org')
    const WalletClass = isMathWallet ? MathWallet : Wallet
    
    const wallet = new WalletClass(providerUrl, endpoint)

    console.log('providerUrl', providerUrl, 'endpoint', endpoint, 'wallet', wallet)


    return wallet
  }, [
    providerUrl,
    endpoint,
  ]);

  useEffect(() => {
    console.log('trying to connect');
    const connect = async () => {
      console.log('Connecting Wallet: ', wallet, providerUrl)
      const resultofconnect = wallet.connect()
      console.log('resultofconnect', resultofconnect)
  
      wallet.on('connect', async () => {
        console.log('connected');
        console.log('wallet', wallet)
        let walletPublicKey = wallet.publicKey.toBase58();
        console.log('walletPublicKey', walletPublicKey)
        let keyToDisplay =
          walletPublicKey.length > 20
            ? `${walletPublicKey.substring(0, 7)}.....${walletPublicKey.substring(
              walletPublicKey.length - 7,
              walletPublicKey.length,
            )}`
            : walletPublicKey;
  
        notify({
          message: 'Wallet update',
          description: 'Connected to wallet ' + keyToDisplay,
        });

        await setConnected(true);
      });
  
      wallet.on('disconnect', () => {
        setConnected(false);
        notify({
          message: 'Wallet update',
          description: 'Disconnected from wallet',
        });
      });
    }

    connect()

    return () => {
      wallet.disconnect();
      setConnected(false);
    };
  }, [wallet]);

  console.log('wallet in render', wallet)

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        providerUrl,
        setProviderUrl,
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
  };
}
