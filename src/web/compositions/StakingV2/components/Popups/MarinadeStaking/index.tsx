import { MarinadeUtils } from '@marinade.finance/marinade-ts-sdk'
import { TokenInstructions } from '@project-serum/serum'
import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import {
  notifyAboutStakeTransaction,
  notifyAboutUnStakeTransaction,
} from '@sb/compositions/MarinadeStaking/utils'
import { SOL_GAP_AMOUNT } from '@sb/compositions/StakingV2/config'
import { StakingBlockProps } from '@sb/compositions/StakingV2/types'
import { ArrowsExchangeIcon } from '@sb/compositions/Swap/components/Inputs/images/arrowsExchangeIcon'
import { ReverseTokensContainer } from '@sb/compositions/Swap/styles'
import { useConnection } from '@sb/dexUtils/connection'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { useMarinadeSdk } from '@sb/dexUtils/staking/hooks'
import {
  useAssociatedTokenAccount,
  useUserTokenAccounts,
} from '@sb/dexUtils/token/hooks'
import { signAndSendSingleTransaction } from '@sb/dexUtils/transactions'
import { formatNumbersForState, MSOL_MINT } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'

import { getDexTokensPrices as getDexTokensPricesQuery } from '@core/graphql/queries/pools/getDexTokensPrices'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'

import { AmountInput } from '../../Inputs'
import { NumberWithLabel } from '../../NumberWithLabel/NumberWithLabel'
import { HeaderComponent } from '../Header'
import { Box, Column, Container, Row, ModalContainer } from '../index.styles'
import { Switcher } from '../Switcher'
import {
  AdditionalInfoRow,
  FirstInputContainer,
  InputsContainer,
  LabelsRow,
  SecondInputContainer,
} from './index.styles'

const SOL_MINT = TokenInstructions.WRAPPED_SOL_MINT.toString()

const Block: React.FC<StakingBlockProps> = (props) => {
  const {
    dexTokensPricesMap,
    open,
    onClose,
    setIsConnectWalletPopupOpen,
    mSolInfo,
    refreshStakingInfo,
    socials,
  } = props

  const [isStakeModeOn, setIsStakeModeOn] = useState(true)
  const [loading, setLoading] = useState(false)

  const [amount, setAmount] = useState('')
  const [amountGet, setAmountGet] = useState('')

  const { wallet } = useWallet()
  const connection = useConnection()

  const [_, refreshTokens] = useUserTokenAccounts()

  const mSolWallet = useAssociatedTokenAccount(MSOL_MINT)
  const solWallet = useAssociatedTokenAccount(SOL_MINT)

  const solWalletWithGap = solWallet
    ? { ...solWallet, amount: Math.max(solWallet.amount - SOL_GAP_AMOUNT, 0) }
    : undefined
  const fromWallet = isStakeModeOn ? solWalletWithGap : mSolWallet
  const toWallet = isStakeModeOn ? mSolWallet : solWalletWithGap

  const mSolPrice = mSolInfo?.stats.m_sol_price || 1

  const setAmountFrom = (v: string) => {
    const valueForState = formatNumbersForState(v)
    const value = parseFloat(valueForState)

    const newGetValue = isStakeModeOn
      ? value / mSolPrice
      : value * mSolPrice || 0

    const formattedNewGetValue = stripByAmount(newGetValue, 4).toString()

    setAmount(valueForState)
    setAmountGet(formattedNewGetValue)
  }

  const setAmountTo = (v: string) => {
    const valueForState = formatNumbersForState(v)
    const value = parseFloat(valueForState)

    const newFromValue = isStakeModeOn
      ? value * mSolPrice
      : value / mSolPrice || 0

    const formattedNewFromValue = stripByAmount(newFromValue, 4).toString()

    setAmountGet(valueForState)
    setAmount(formattedNewFromValue)
  }

  const toggleStakeMode = (value: boolean) => {
    setAmount('')
    setAmountGet('')
    setIsStakeModeOn(value)
  }

  const marinade = useMarinadeSdk()

  const refreshAll = async () =>
    Promise.all([refreshTokens(), refreshStakingInfo()])

  const stake = async () => {
    if (!wallet.publicKey) {
      throw new Error('No pubkey for wallet!')
    }
    const amountLamports = MarinadeUtils.solToLamports(parseFloat(amount))

    const { transaction } = await marinade.deposit(amountLamports, {
      mintToOwnerAddress: wallet.publicKey,
    })

    setLoading(true)

    try {
      const txResult = await signAndSendSingleTransaction({
        transaction,
        wallet,
        connection,
      })
      await refreshAll()
      notifyAboutStakeTransaction(txResult)
    } catch (e) {
      notify({
        message: 'Something went wrong. Please, try again later',
      })
    }

    setLoading(false)
    setAmount('')
    setAmountGet('')
  }

  const unstake = async () => {
    setLoading(true)
    const amountLamports = MarinadeUtils.solToLamports(parseFloat(amount))
    // Instant withdraw with fee
    const { transaction } = await marinade.liquidUnstake(amountLamports)
    try {
      const txResult = await signAndSendSingleTransaction({
        transaction,
        wallet,
        connection,
      })
      await refreshAll()
      notifyAboutUnStakeTransaction(txResult)
    } catch (e) {
      notify({
        message: 'Something went wrong. Please, try again later',
      })
    }
    setLoading(false)
    setAmount('')
    setAmountGet('')
  }

  const amountValue = parseFloat(amount)
  const isValid =
    amountValue > 0 && fromWallet && amountValue <= fromWallet.amount

  const tokenFrom = isStakeModeOn ? 'SOL' : 'mSOL'
  const tokenTo = isStakeModeOn ? 'mSOL' : 'SOL'

  return (
    <ModalContainer needBlur className="modal-container">
      <Modal open={open} onClose={onClose}>
        <HeaderComponent socials={socials} close={onClose} token="mSOL" />
        <Column height="auto" margin="2em 0">
          <LabelsRow width="100%" margin="2em 0 1em 0">
            <NumberWithLabel
              value={
                mSolInfo?.epochInfo.epochPct
                  ? stripByAmountAndFormat(mSolInfo.epochInfo.epochPct, 2)
                  : '---'
              }
              label="Epoch"
            />
            <NumberWithLabel
              value={mSolInfo?.stats.avg_staking_apy || 0}
              label="APY"
            />
          </LabelsRow>
          <Switcher
            isStakeModeOn={isStakeModeOn}
            setIsStakeModeOn={toggleStakeMode}
          />
          <InlineText color="white2" size="sm">
            Stake SOL and use mSOL while earning rewards
          </InlineText>
          <Column height="auto" width="100%" margin="1em 0 2.4em 0">
            <InputsContainer>
              <FirstInputContainer>
                <AmountInput
                  maxAmount={fromWallet?.amount}
                  data-testid="marinade-staking-amount-from-field"
                  title={isStakeModeOn ? 'Stake' : 'Unstake'}
                  onMaxAmountClick={() => setAmountFrom(fromWallet?.amount)}
                  amount={amount}
                  disabled={false}
                  onChange={setAmountFrom}
                  appendComponent={
                    <Container>
                      <TokenIcon
                        margin="0 5px 0 0"
                        mint={getTokenMintAddressByName(tokenFrom)}
                      />
                      <InlineText color="gray0" size="md" weight={600}>
                        {tokenFrom}
                      </InlineText>
                    </Container>
                  }
                />
              </FirstInputContainer>
              <ReverseTokensContainer
                onClick={() => {
                  setIsStakeModeOn(!isStakeModeOn)
                }}
                $isReversed={false}
              >
                <ArrowsExchangeIcon />
              </ReverseTokensContainer>
              <SecondInputContainer>
                <AmountInput
                  title="Receive"
                  maxAmount={toWallet?.amount}
                  amount={amountGet}
                  onMaxAmountClick={() => setAmountTo(toWallet?.amount)}
                  disabled={false}
                  onChange={setAmountTo}
                  appendComponent={
                    <Container>
                      <TokenIcon
                        margin="0 5px 0 0"
                        mint={getTokenMintAddressByName(tokenTo)}
                      />
                      <InlineText color="gray0" size="md" weight={600}>
                        {tokenTo}
                      </InlineText>
                    </Container>
                  }
                />
              </SecondInputContainer>
            </InputsContainer>
            <AdditionalInfoRow>
              <Box className="rate-box" height="auto" width="48%">
                <Row width="100%">
                  <Row>
                    <InlineText color="white2" size="sm">
                      Rate:
                    </InlineText>
                  </Row>
                  <Row>
                    <InlineText color="white2" size="es">
                      1 mSOL ⇄{' '}
                      {mSolInfo?.stats.m_sol_price
                        ? stripByAmountAndFormat(mSolInfo.stats.m_sol_price, 4)
                        : '---'}{' '}
                      SOL
                    </InlineText>
                  </Row>
                </Row>
              </Box>

              <Box height="auto" width="48%">
                <Row width="100%">
                  <Row>
                    <InlineText color="white2" size="sm">
                      Stake Fee:
                    </InlineText>
                  </Row>
                  <Row>
                    <InlineText color="white2" size="sm" weight={600}>
                      {isStakeModeOn ? '0%' : '≈0.3%'}
                    </InlineText>
                  </Row>
                </Row>
              </Box>
            </AdditionalInfoRow>
          </Column>

          <Column height="auto" width="100%">
            <Button
              className="stake-btn"
              onClick={() => {
                if (!wallet.connected) {
                  setIsConnectWalletPopupOpen(true)
                } else if (isStakeModeOn) {
                  stake()
                } else {
                  unstake()
                }
              }}
              $variant={wallet.connected ? 'green' : 'violet'}
              $width="xl"
              $padding="xxxl"
              $fontSize="sm"
              disabled={wallet.connected && (!isValid || loading)}
            >
              {!wallet.connected ? (
                'Connect Wallet to Stake mSOL'
              ) : (
                <>{isStakeModeOn ? 'Stake mSOL' : 'Unstake mSOL'}</>
              )}
            </Button>
          </Column>
        </Column>
      </Modal>
    </ModalContainer>
  )
}

export const MarinadeStaking = queryRendererHoc({
  query: getDexTokensPricesQuery,
  name: 'getDexTokensPricesQuery',
  fetchPolicy: 'cache-and-network',
  withoutLoading: true,
  pollInterval: 10000,
})(Block)
