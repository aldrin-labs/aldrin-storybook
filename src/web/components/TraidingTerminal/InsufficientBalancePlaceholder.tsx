import React from 'react'
import SvgIcon from '@sb/components/SvgIcon'
import Info from '@icons/inform.svg'
import { Theme } from '@sb/types/materialUI'
import {
  useSelectedBaseCurrencyAccount,
  useSelectedOpenOrdersAccount,
  useSelectedQuoteCurrencyAccount,
} from '@sb/dexUtils/markets'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { Loader } from '../Loader/Loader'
import {
  costOfAddingToken,
  costsOfTheFirstTrade,
  SOLFeeForTrade,
} from './utils'
import { Placeholder, SendButton } from './styles'

export const InsufficientBalancePlaceholder = ({
  pair,
  SOLAmount,
  theme,
  onClick,
  isLoading,
  sideType,
}: {
  pair: string
  SOLAmount: number
  theme: Theme
  onClick: any
  isLoading: boolean
  sideType: string
}) => {
  const isNotEnoughSOLForTransaction = SOLAmount < SOLFeeForTrade

  const isBaseCoinExistsInWallet = useSelectedBaseCurrencyAccount()
  const isQuoteCoinExistsInWallet = useSelectedQuoteCurrencyAccount()
  const openOrdersAccount = useSelectedOpenOrdersAccount(true)

  const needCreateOpenOrdersAccount = !openOrdersAccount

  const isNotEnoughSOLForFirstTrade =
    (needCreateOpenOrdersAccount && isNotEnoughSOLForTransaction) ||
    isNotEnoughSOLForTransaction

  const isEnoughSOLForAddingToken = SOLAmount > costOfAddingToken

  const needToAddToken = !isBaseCoinExistsInWallet || !isQuoteCoinExistsInWallet
  const needAndCantAddToken = needToAddToken && !isEnoughSOLForAddingToken

  if (isNotEnoughSOLForFirstTrade) {
    return (
      <DarkTooltip
        title={
          <>
            <p>Deposit some SOL to your wallet for successful trading.</p>
            <p>
              Due to Serum design there is need to open a trading account for
              this pair to trade it.
            </p>
            <p>
              So, the “first trade” fee is 0.0239
              <span style={{ color: '#BFEAB6' }}>
                ≈{costsOfTheFirstTrade} SOL
              </span>
              .
            </p>
            <p>
              The fee for all further trades on this pair will be
              <span style={{ color: '#BFEAB6' }}> ≈{SOLFeeForTrade} SOL</span>.
            </p>
          </>
        }
      >
        <Placeholder>
          Insufficient SOL balance to complete the transaction.
          <SvgIcon src={Info} width="5%" />
        </Placeholder>
      </DarkTooltip>
    )
  }

  if (needAndCantAddToken) {
    return (
      <DarkTooltip
        title={
          <>
            <p>Deposit some SOL to your wallet for successful trading.</p>
            <p>
              {`Your wallet does not have a ${
                !isBaseCoinExistsInWallet ? pair[0] : pair[1]
              }, so an address will be created for it. In Solana it costs 0.002039 SOL.`}
            </p>
            <p>Deposit some SOL to your wallet for successful trading.</p>
            <p>
              Also, due to Serum design there is need to open a trading account
              for this pair to trade it.
            </p>
            <p>
              So, the “first trade” fee is 0.024 SOL + (address creation cost)
            </p>
            <p>
              The fee for all further trades on this pair will be 0.00001 SOL
            </p>
          </>
        }
      >
        <Placeholder>
          Insufficient SOL balance to complete the transaction.
          <SvgIcon src={Info} width="5%" />
        </Placeholder>
      </DarkTooltip>
    )
  }

  if (isNotEnoughSOLForTransaction) {
    return (
      <DarkTooltip
        title={
          <>
            <p>Deposit some SOL to your wallet for successful trading.</p>
            <p>
              The fee size for each trade on the DEX is
              <span style={{ color: '#BFEAB6' }}> ≈0.00001 SOL</span>.
            </p>
          </>
        }
      >
        <Placeholder>
          Insufficient SOL balance to complete the transaction.
          <SvgIcon src={Info} width="5%" />
        </Placeholder>
      </DarkTooltip>
    )
  }

  return (
    <SendButton theme={theme} type={sideType} onClick={onClick}>
      {isLoading && <Loader text="Transaction Pending" />}
      {!isLoading && sideType === 'buy' ? `buy ${pair[0]}` : `sell ${pair[0]}`}
    </SendButton>
  )
}
