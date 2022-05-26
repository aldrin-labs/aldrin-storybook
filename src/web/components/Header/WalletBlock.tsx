/import copy from 'clipboard-copy'
import React, { useState } from 'react'

import { Loading, SvgIcon, TooltipRegionBlocker } from '@sb/components'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { useWallet, useBalanceInfo } from '@sb/dexUtils/wallet'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import Astronaut from '@icons/astronaut.webp'
import CheckMark from '@icons/checkmarkWhite.svg'

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
  WalletDisconnectBlock,
  CopyAddressButton,
} from './styles'

export const WalletBlock = () => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { connected, wallet, providerName, providerFullName } = useWallet()

  const publicKey = wallet.publicKey?.toString() || ''
  const balanceInfo = useBalanceInfo(wallet.publicKey)
  const { amount, decimals } = balanceInfo || {
    amount: 0,
    decimals: 8,
  }
  const SOLAmount = amount / 10 ** decimals

  const [isRegionCheckIsLoading, setRegionCheckIsLoading] =
    useState<boolean>(false)
  const [isFromRestrictedRegion, setIsFromRestrictedRegion] =
    useState<boolean>(false)

  // useEffect(() => {
  //   setRegionCheckIsLoading(true)
  //   getRegionData({ setIsFromRestrictedRegion }).then(() => {
  //     setRegionCheckIsLoading(false)
  //   })
  // }, [setIsFromRestrictedRegion])

  return (
    <>
      {!connected && (
        <TooltipRegionBlocker isFromRestrictedRegion={isFromRestrictedRegion}>
          <span>
            <WalletButton
              data-test-id="header-connect-wallet-button"
              disabled={isFromRestrictedRegion}
              onClick={() => {
                if (isFromRestrictedRegion || isRegionCheckIsLoading) {
                  return
                }
                setIsConnectWalletPopupOpen(true)
              }}
            >
              {isRegionCheckIsLoading && (
                <Loading color="#FFFFFF" size={16} style={{ height: '16px' }} />
              )}
              {!isRegionCheckIsLoading &&
                (isFromRestrictedRegion
                  ? `Restricted region`
                  : `Connect wallet`)}
            </WalletButton>
          </span>
        </TooltipRegionBlocker>
      )}
      {connected && (
        <WalletDataContainer>
          <WalletData className="wallet-data">
            <img src={Astronaut} alt="aldrin" width="30px" height="30px" />
            <Column>
              {' '}
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
              onClick={() => {
                if (wallet?.disconnect) {
                  wallet.disconnect()
                }
              }}
            >
              Disconnect
            </WalletDisconnectButton>
            <CopyAddressButton
              isCopied={isCopied}
              onClick={() => {
                setIsCopied(true)
                copy(publicKey)
                setTimeout(() => setIsCopied(false), 1500)
              }}
            >
              {isCopied ? (
                <SvgIcon src={CheckMark} />
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 7.4V14.8667C17 16.04 16.04 17 14.8667 17H7.4"
                    stroke="#C1C1C1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.1334 1.00007H10.6001C11.7734 1.00007 12.7334 1.96007 12.7334 3.1334V10.6001C12.7334 11.7734 11.7734 12.7334 10.6001 12.7334H3.1334C1.96007 12.7334 1.00007 11.7734 1.00007 10.6001V3.1334C1.00007 1.96007 1.96007 1.00007 3.1334 1.00007Z"
                    stroke="#C1C1C1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </CopyAddressButton>
          </WalletDisconnectBlock>
        </WalletDataContainer>
      )}
      <ConnectWalletPopup
        open={isConnectWalletPopupOpen && !isFromRestrictedRegion}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </>
  )
}
