import { useRef } from 'react';

import { useWallet } from '@sb/dexUtils/wallet'
import { useAsyncData } from './fetch-loop'
import {
  useTokenAccounts,
} from '@sb/dexUtils/markets'

export function useRefEqual<T>(
  value: T,
  areEqual: (oldValue: T, newValue: T) => boolean,
): T {
  const prevRef = useRef<T>(value);
  if (prevRef.current !== value && !areEqual(prevRef.current, value)) {
    prevRef.current = value;
  }
  return prevRef.current;
}


export function useWalletPublicKeys() {
    const wallet = useWallet();
    const [accounts] = useTokenAccounts()

    let publicKeys = [
      wallet.wallet.publicKey,
      ...(accounts
        ? accounts.map(({ pubkey }) => pubkey)
        : []),
    ];
    
    // Prevent users from re-rendering unless the list of public keys actually changes
    publicKeys = useRefEqual(
      publicKeys,
      (oldKeys, newKeys) =>
        oldKeys.length === newKeys.length &&
        oldKeys.every((key, i) => key.equals(newKeys[i])),
    );

    return [publicKeys];
  }