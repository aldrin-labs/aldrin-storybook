import React from 'react'
import { useWallet } from '../../dexUtils/wallet'
import { ConnectWalletInner } from '../ConnectWalletScreen'

interface ConnectWalletWrapperProps {
  size?: 'md' | 'sm'
}
export const ConnectWalletWrapper: React.FC<ConnectWalletWrapperProps> = (props) => {
  const { wallet } = useWallet()
  if (!wallet.connected) {
    return (<ConnectWalletInner size={props.size} />)

  }
  return <>{props.children}</>
}