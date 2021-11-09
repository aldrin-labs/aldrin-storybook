import React from 'react'
import { DarkTooltip } from '../TooltipCustom/Tooltip'
import { Placeholder, SendButton } from './styles'
import {
  costOfAddingToken,
  costsOfTheFirstTrade,
  SOLFeeForTrade,
} from './utils'
import SvgIcon from '@sb/components/SvgIcon'
import Info from '@icons/inform.svg'
import { Theme } from '@sb/types/materialUI'
import {
  useSelectedBaseCurrencyAccount,
  useSelectedOpenOrdersAccount,
  useSelectedQuoteCurrencyAccount,
} from '@sb/dexUtils/markets'
import { Loader } from '../Loader/Loader'

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
  const isEnoughSOLForTransaction = SOLAmount < SOLFeeForTrade

  const isBaseCoinExistsInWallet = useSelectedBaseCurrencyAccount()
  const isQuoteCoinExistsInWallet = useSelectedQuoteCurrencyAccount()
  const openOrdersAccount = useSelectedOpenOrdersAccount(true)

  const needCreateOpenOrdersAccount = !openOrdersAccount

  const isNotEnoughSOLForFirstTrade =
    (needCreateOpenOrdersAccount && isEnoughSOLForTransaction) ||
    isEnoughSOLForTransaction

  const isEnoughSOLForAddingToken = SOLAmount > costOfAddingToken

  const needToAddToken = !isBaseCoinExistsInWallet || !isQuoteCoinExistsInWallet

  const needPlaceholder =
    isNotEnoughSOLForFirstTrade ||
    (needToAddToken && !isEnoughSOLForAddingToken) ||
    isEnoughSOLForTransaction

  return (
    <>
      {needPlaceholder ? (
        isNotEnoughSOLForFirstTrade ? (
          <DarkTooltip
            title={
              <>
                <p>Deposit some SOL to your wallet for successful trading.</p>
                <p>
                  Due to Serum design there is need to open a trading account
                  for this pair to trade it.
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
                  <span style={{ color: '#BFEAB6' }}>
                    {' '}
                    ≈{SOLFeeForTrade} SOL
                  </span>
                  .
                </p>
              </>
            }
          >
            <Placeholder>
              Insufficient SOL balance to complete the transaction.
              <SvgIcon src={Info} width={'5%'} />
            </Placeholder>
          </DarkTooltip>
        ) : needToAddToken && !isEnoughSOLForAddingToken ? (
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
                  Also, due to Serum design there is need to open a trading
                  account for this pair to trade it.
                </p>
                <p>
                  So, the “first trade” fee is 0.024 SOL + (address creation
                  cost)
                </p>
                <p>
                  The fee for all further trades on this pair will be 0.00001
                  SOL
                </p>
              </>
            }
          >
            <Placeholder>
              Insufficient SOL balance to complete the transaction.
              <SvgIcon src={Info} width={'5%'} />
            </Placeholder>
          </DarkTooltip>
        ) : (
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
              <SvgIcon src={Info} width={'5%'} />
            </Placeholder>
          </DarkTooltip>
        )
      ) : (
        <SendButton
          theme={theme}
          type={sideType}
          onClick={onClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader text={'Transaction Pending'} />
          ) : sideType === 'buy' ? (
            `buy ${pair[0]}`
          ) : (
            `sell ${pair[0]}`
          )}
        </SendButton>
      )}
    </>
  )
}
