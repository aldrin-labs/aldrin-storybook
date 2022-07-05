import React, { useState } from 'react'

import { SvgIcon } from '@sb/components'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { useWallet, useBalanceInfo } from '@sb/dexUtils/wallet'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import Astronaut from '@icons/astronaut.webp'

import { formatSymbol } from '../AllocationBlock/DonutChart/utils'
import DownArrow from './icons/down_arrow.svg'

// TODO: move that
import {
  WalletButton,
  WalletDataContainer,
  WalletData,
  Column,
  WalletAddress,
  BalanceTitle,
  DownArrowWrapper,
} from './styles'

export const WalletBlock = () => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  const { connected, wallet } = useWallet()

  const publicKey = wallet.publicKey?.toString() || ''
  const balanceInfo = useBalanceInfo(wallet.publicKey)
  const { amount, decimals } = balanceInfo || {
    amount: 0,
    decimals: 8,
  }
  const SOLAmount = amount / 10 ** decimals

  return (
    <>
      {!connected && (
        <span>
          <WalletButton
            data-testid="header-connect-wallet-btn"
            onClick={() => {
              setIsConnectWalletPopupOpen(true)
            }}
          >
            Connect Wallet
          </WalletButton>
        </span>
      )}

      {connected && (
        <WalletDataContainer>
          <WalletData className="wallet-data">
            <img src={Astronaut} alt="aldrin" width="24px" height="24px" />
            <Column>
              <BalanceTitle>
                {stripByAmountAndFormat(SOLAmount, 4)} SOL
              </BalanceTitle>
              <WalletAddress>
                {formatSymbol({ symbol: publicKey })}
              </WalletAddress>
            </Column>

            <DownArrowWrapper>
              <SvgIcon src={DownArrow} />
            </DownArrowWrapper>
          </WalletData>
        </WalletDataContainer>
      )}

      <ConnectWalletPopup
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </>
  )
}
