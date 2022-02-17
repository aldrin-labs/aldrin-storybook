import React, { ReactNode } from 'react'

import { useWallet } from '../../dexUtils/wallet'
import { ConnectWalletInner } from '../ConnectWalletScreen'

interface ConnectWalletWrapperProps {
  size?: 'button-only' | 'md' | 'sm'
  text?: ReactNode
}
export const ConnectWalletWrapper: React.FC<ConnectWalletWrapperProps> = (
  props
) => {
  const { size, children, text } = props
  const { wallet } = useWallet()
  if (!wallet.connected) {
    return <ConnectWalletInner text={text} size={size} />
  }
  return <>{children}</>
}
