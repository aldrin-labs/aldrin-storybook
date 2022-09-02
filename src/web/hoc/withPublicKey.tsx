import * as React from 'react'

import { useWallet } from '@sb/dexUtils/wallet'

export function withPublicKey(Component: React.ComponentType<any>) {
  return function PublicKeyComponent(props: any) {
    const { wallet } = useWallet()
    const publicKey =
      wallet && wallet.publicKey ? wallet.publicKey.toBase58() : ''
    return <Component {...props} wallet={wallet} publicKey={publicKey} />
  }
}
