import React from 'react'
import { useWallet } from '../../dexUtils/wallet'
import { ConnectWalletInner } from '../ConnectWalletScreen/ConnectWalletScreen'

export const ConnectWalletWrapper: React.FC = (props) => {
  const { wallet } = useWallet()
  if (!wallet.connected) {
    return (<ConnectWalletInner />)

  }
  return <>{props.children}</>
}