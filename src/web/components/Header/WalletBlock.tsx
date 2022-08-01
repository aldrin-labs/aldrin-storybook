import React, { useState } from 'react'

import { SvgIcon } from '@sb/components'
import WalletBreakdownPopup from '@sb/components/WalletBreakdownPopup/WalletBreakdownPopup'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { useWallet, useBalanceInfo } from '@sb/dexUtils/wallet'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import Astronaut from '@icons/astronaut.webp'

import { formatSymbol } from '../AllocationBlock/DonutChart/utils'
import ArrowDown from './images/arrow-down.svg'
import {
  WalletButton,
  WalletDataContainer,
  WalletData,
  Column,
  WalletAddress,
  BalanceTitle,
  ArrowDownIconContainer,
  AstronautImage,
} from './styles'

export const WalletBlock = () => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  const [isWalletBreakdownPopupOpen, setIsWalletBreakdownPopupOpen] =
    useState(false)
  const { wallet } = useWallet()

  const publicKey = wallet.publicKey?.toString() || ''
  const balanceInfo = useBalanceInfo(wallet.publicKey)
  const { amount, decimals } = balanceInfo || {
    amount: 0,
    decimals: 8,
  }
  const SOLAmount = amount / 10 ** decimals

  return (
    <>
      {wallet.connected && (
        <WalletBreakdownPopup
          open={isWalletBreakdownPopupOpen}
          onClose={() => setIsWalletBreakdownPopupOpen(false)}
        />
      )}

      {wallet.connected ? (
        <WalletDataContainer
          onClick={() => setIsWalletBreakdownPopupOpen(true)}
        >
          <WalletData className="wallet-data">
            <AstronautImage
              src={Astronaut}
              alt="aldrin"
              width="24px"
              height="24px"
            />
            <Column>
              <BalanceTitle>
                {stripByAmountAndFormat(SOLAmount, 4)} SOL
              </BalanceTitle>
              <WalletAddress>
                {formatSymbol({ symbol: publicKey })}
              </WalletAddress>
            </Column>

            <ArrowDownIconContainer>
              <SvgIcon src={ArrowDown} width="12px" height="12px" />
            </ArrowDownIconContainer>
          </WalletData>
        </WalletDataContainer>
      ) : (
        <WalletButton
          data-testid="header-connect-wallet-btn"
          onClick={() => {
            setIsConnectWalletPopupOpen(true)
          }}
        >
          Connect Wallet
        </WalletButton>
      )}

      <ConnectWalletPopup
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </>
  )
}
