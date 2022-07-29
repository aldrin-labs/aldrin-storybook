import copy from 'clipboard-copy'
import React, { useState } from 'react'

import { SvgIcon } from '@sb/components'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { useWallet, useBalanceInfo } from '@sb/dexUtils/wallet'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import Astronaut from '@icons/astronaut.webp'
import CheckMark from '@icons/checkmarkWhite.svg'

import { formatSymbol } from '../AllocationBlock/DonutChart/utils'
import CopyIcon from './assets/CopyIcon'
import WalletIcon from './assets/WalletIcon'
import {
  WalletButton,
  WalletDataContainer,
  WalletDisconnectButton,
  WalletData,
  Column,
  WalletAddress,
  BalanceTitle,
  WalletDisconnectBlock,
  CopyAddressButton,
} from './styles'

export const WalletBlock = () => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  const [isCopied, setIsCopied] = useState(false)
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
        <WalletButton
          data-testid="header-connect-wallet-btn"
          onClick={() => {
            setIsConnectWalletPopupOpen(true)
          }}
        >
          <Row margin="0 0.3em 0 0">
            <WalletIcon />
          </Row>
          Connect Wallet
        </WalletButton>
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
          </WalletData>

          <WalletDisconnectBlock className="disconnect-wallet">
            <WalletDisconnectButton
              data-testid="header-disconnect-wallet-btn"
              onClick={() => {
                if (wallet?.disconnect) {
                  wallet.disconnect()
                }
              }}
            >
              Disconnect
            </WalletDisconnectButton>
            <CopyAddressButton
              data-testid="header-copy-address-btn"
              isCopied={isCopied}
              onClick={() => {
                setIsCopied(true)
                copy(publicKey)
                setTimeout(() => setIsCopied(false), 1500)
              }}
            >
              {isCopied ? <SvgIcon src={CheckMark} /> : <CopyIcon />}
            </CopyAddressButton>
          </WalletDisconnectBlock>
        </WalletDataContainer>
      )}

      <ConnectWalletPopup
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </>
  )
}
