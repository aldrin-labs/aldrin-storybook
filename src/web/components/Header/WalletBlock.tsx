import React, { useEffect, useState } from 'react'

import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { useWallet, useBalanceInfo } from '@sb/dexUtils/wallet'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import Astronaut from '@icons/astronaut.webp'

// TODO: move that
import { formatSymbol } from '../AllocationBlock/DonutChart/utils'
import {
  WalletButton,
  WalletDataContainer,
  WalletDisconnectButton,
  WalletData,
  Column,
  WalletAddress,
  BalanceTitle,
} from './styles'
import { getRegionData } from '@core/hoc/withRegionCheck'

export const WalletBlock = () => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  const { connected, wallet, providerName, providerFullName } = useWallet()

  const publicKey = wallet.publicKey?.toString() || ''
  const balanceInfo = useBalanceInfo(wallet.publicKey)
  const { amount, decimals } = balanceInfo || {
    amount: 0,
    decimals: 8,
  }
  const SOLAmount = amount / 10 ** decimals

  const [isFromRestrictedRegion, setIsFromRestrictedRegion] = useState<boolean>(false)
  useEffect(() => {
    getRegionData({ setIsFromRestrictedRegion })
  }, [setIsFromRestrictedRegion])

  return (
    <>
      {!connected && (
        <WalletButton
          disabled={isFromRestrictedRegion}
          onClick={() => {
            setIsConnectWalletPopupOpen(true)
          }}
        >
        {isFromRestrictedRegion ? `Restricted region` : `Connect wallet`}
        </WalletButton>
      )}
      {connected && (
        <WalletDataContainer>
          <WalletData>
            <img src={Astronaut} alt="aldrin" width="30px" height="30px" />
            <Column>
              {' '}
              <BalanceTitle>
                {stripByAmountAndFormat(SOLAmount)} SOL
              </BalanceTitle>
              <WalletAddress>
                {formatSymbol({ symbol: publicKey })}
              </WalletAddress>
            </Column>
          </WalletData>
          <WalletDisconnectButton
            onClick={() => {
              if (wallet?.disconnect) {
                wallet.disconnect()
              }
            }}
          >
            Disconnect
          </WalletDisconnectButton>
        </WalletDataContainer>
      )}
      <ConnectWalletPopup
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </>
  )
}
