import { MarinadeUtils } from '@marinade.finance/marinade-ts-sdk'
import { TokenInstructions } from '@project-serum/serum'
import { COLORS } from '@variables/variables'
import React, { useState } from 'react'

import { AmountInput } from '@sb/components/AmountInput'
import { Page } from '@sb/components/Layout'
import { Radio } from '@sb/components/RadioButton/RadioButton'
import { InlineText } from '@sb/components/Typography'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import { ConnectWalletWrapper } from '../../components/ConnectWalletWrapper'
import { useConnection } from '../../dexUtils/connection'
import { notify } from '../../dexUtils/notifications'
import {
  useMarinadeSdk,
  useMarinadeStakingInfo,
} from '../../dexUtils/staking/hooks'
import {
  useAssociatedTokenAccount,
  useUserTokenAccounts,
} from '../../dexUtils/token/hooks'
import { signAndSendSingleTransaction } from '../../dexUtils/transactions'
import { SignAndSendTransactionResult } from '../../dexUtils/transactions/types'
import { MSOL_MINT } from '../../dexUtils/utils'
import { useWallet } from '../../dexUtils/wallet'
import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { InputWrapper } from '../RinStaking/styles'
import {
  StretchedContent,
  ContentBlock,
  StakeButton,
  UnStakeButton,
} from '../Staking/styles'
import MarinadeBg from './bg.png'
import { BlockWithRadio } from './components/styles'
import { Switcher } from './components/Switcher/Switcher'
import { Container } from './styles'

const SOL_MINT = TokenInstructions.WRAPPED_SOL_MINT.toString()
const SOL_GAP_AMOUNT = 0.0127 // to allow transaactions pass

const notifyAboutStakeTransaction = (result: SignAndSendTransactionResult) => {
  if (result === 'success') {
    return notify({
      message: 'Staked succesfully',
      type: 'success',
    })
  }
  if (result === 'cancelled' || result === 'rejected') {
    return notify({
      message: 'Staking cancelled',
      type: 'warn',
    })
  }
  if (result === 'failed') {
    return notify({
      message: 'Staking failed',
    })
  }
  return notify({
    message: 'Something went wrong',
    type: 'error',
  })
}

const notifyAboutUnStakeTransaction = (
  result: SignAndSendTransactionResult
) => {
  if (result === 'success') {
    return notify({
      message: 'Unstaked succesfully',
      type: 'success',
    })
  }
  if (result === 'cancelled' || result === 'rejected') {
    return notify({
      message: 'Untaking cancelled',
      type: 'warn',
    })
  }
  if (result === 'failed') {
    return notify({
      message: 'Unstaking failed',
    })
  }
  return notify({
    message: 'Something went wrong',
    type: 'error',
  })
}
export const MarinadeStaking = () => {
  const [canUserUnstakeNow, setIfUserCanUnstakeNow] = useState(true)
  const [isStakeModeOn, setIsStakeModeOn] = useState(false)

  const [amount, setAmount] = useState('0')

  const { wallet } = useWallet()
  const connection = useConnection()
  // const { data } = useMarinadeTickets()
  const { data: mSolInfo, mutate: refreshStakingInfo } =
    useMarinadeStakingInfo()
  const [_, refreshTokens] = useUserTokenAccounts()

  const mSolWallet = useAssociatedTokenAccount(MSOL_MINT)
  const solWallet = useAssociatedTokenAccount(SOL_MINT)

  const solWalletWithGap = solWallet
    ? { ...solWallet, amount: Math.max(solWallet.amount - SOL_GAP_AMOUNT, 0) }
    : undefined
  const fromWallet = isStakeModeOn ? solWalletWithGap : mSolWallet
  const toWallet = isStakeModeOn ? mSolWallet : solWalletWithGap

  const solPrice = mSolInfo?.stats.m_sol_price || 1
  const amountGet = isStakeModeOn
    ? parseFloat(amount) / solPrice
    : parseFloat(amount) * solPrice

  const toggleStakeMode = (value: boolean) => {
    setAmount('0')
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
  }

  const unstake = async () => {
    const amountLamports = MarinadeUtils.solToLamports(parseFloat(amount))
    if (canUserUnstakeNow) {
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
    } else {
      // const { transaction } = await marinade.depositStakeAccount(amountLamports)
    }
  }

  const amountValue = parseFloat(amount)
  const isValid =
    amountValue > 0 && fromWallet && amountValue <= fromWallet.amount
  return (
    <Page>
      <RowContainer margin="5rem 0" direction="column">
        <Container>
          <img src={MarinadeBg} width="100%" height="auto" alt="marinade" />
        </Container>
        {/* <Container>
          <ContentBlock
            style={{
              margin: '2rem 0 0 0',
              background: COLORS.newBlack,
              flexDirection: 'column',
            }}
          >
            <InlineText size="sm" weight={700} color="lightGray">
              Your unstake tickets
            </InlineText>
            <ContentBlock style={{ margin: '1rem 0' }}>
              <RowContainer justify="space-between">
                {' '}
                <InlineText
                  color="lightGray"
                  size="sm"
                  style={{ textDecoration: 'underline' }}
                >
                  5FbM...2ktH
                </InlineText>{' '}
                <InlineText size="sm">
                  Receive{' '}
                  <InlineText weight={600} color="newGreen">
                    5.1252 SOL
                  </InlineText>
                </InlineText>
                <Button
                  $fontSize="sm"
                  $borderRadius="md"
                  style={{ fontWeight: '600' }}
                >
                  Claim
                </Button>
              </RowContainer>
            </ContentBlock>
            <ContentBlock style={{ margin: '1rem 0' }}>
              <RowContainer justify="space-between">
                {' '}
                <InlineText
                  color="lightGray"
                  size="sm"
                  style={{ textDecoration: 'underline' }}
                >
                  5FbM...2ktH
                </InlineText>{' '}
                <InlineText size="sm">
                  Receive{' '}
                  <InlineText weight={600} color="newGreen">
                    5.1252 SOL
                  </InlineText>
                </InlineText>
                <InlineText size="sm">
                  {' '}
                  <SvgIcon src={Clock} height="11px" /> 1d 8h 14m
                </InlineText>
              </RowContainer>
            </ContentBlock>
          </ContentBlock>
        </Container> */}
        <Container>
          <StretchedContent>
            <ContentBlock width="48%" style={{ background: COLORS.newBlack }}>
              <Row justify="flex-start" margin="0 0 2rem 0">
                <InlineText color="primaryGray" size="sm">
                  Epoch
                </InlineText>{' '}
              </Row>
              <InlineText size="lg" weight={700}>
                {stripByAmountAndFormat(mSolInfo?.epochInfo.epochPct || 0, 2)}%
              </InlineText>
            </ContentBlock>
            <ContentBlock style={{ background: '#121E10' }} width="48%">
              <Row justify="flex-start" margin="0 0 2rem 0">
                <InlineText color="primaryGray" size="sm">
                  APY
                </InlineText>{' '}
              </Row>
              <InlineText color="newGreen" size="lg" weight={700}>
                {stripByAmountAndFormat(
                  mSolInfo?.stats.avg_staking_apy || 0,
                  2
                )}
                %
              </InlineText>
            </ContentBlock>
          </StretchedContent>
        </Container>
        <Container>
          <ContentBlock style={{ margin: '0', background: COLORS.newBlack }}>
            <Switcher
              setIsStakeModeOn={toggleStakeMode}
              isStakeModeOn={isStakeModeOn}
            />
            <RowContainer margin="0 0 2rem 0" justify="space-between">
              <InlineText color="primaryGray" size="sm">
                Stake SOL and use mSOL while earning rewards
              </InlineText>
            </RowContainer>
            <ConnectWalletWrapper>
              <RowContainer>
                <InputWrapper style={{ position: 'relative' }}>
                  {' '}
                  <AmountInput
                    value={amount}
                    onChange={(v) => setAmount(v)}
                    placeholder="0"
                    name="amountFrom"
                    amount={fromWallet?.amount || 0}
                    mint={fromWallet?.mint || ''}
                    label={isStakeModeOn ? 'Stake' : 'Unstake'}
                  />
                </InputWrapper>
              </RowContainer>
              <RowContainer margin="2rem 0">
                <InputWrapper style={{ position: 'relative' }}>
                  <AmountInput
                    value={`${amountGet || 0}`}
                    onChange={() => {}}
                    placeholder="0"
                    name="amountTo"
                    amount={toWallet?.amount || 0}
                    mint={toWallet?.mint || ''}
                    label="Receive"
                    showButtons={false}
                  />
                </InputWrapper>
              </RowContainer>
              {!isStakeModeOn && (
                <RowContainer justify="space-between">
                  <BlockWithRadio
                    onClick={() => {
                      setIfUserCanUnstakeNow(true)
                    }}
                    checked={canUserUnstakeNow}
                  >
                    <RowContainer justify="space-between">
                      <InlineText weight={600} size="sm">
                        Unstake Now {JSON.stringify(canUserUnstakeNow)}
                      </InlineText>
                      <Radio change={() => {}} checked={canUserUnstakeNow} />
                    </RowContainer>
                    <RowContainer justify="space-between">
                      <InlineText size="sm">Fee ≈0.3%</InlineText>
                    </RowContainer>
                  </BlockWithRadio>
                  <BlockWithRadio
                    onClick={() => {
                      setIfUserCanUnstakeNow(false)
                    }}
                    checked={!canUserUnstakeNow}
                  >
                    <RowContainer justify="space-between">
                      <InlineText weight={600} size="sm">
                        Unstake in ≈2 days
                      </InlineText>
                      <Radio change={() => {}} checked={!canUserUnstakeNow} />
                    </RowContainer>
                    <RowContainer justify="space-between">
                      <InlineText weight={600} size="sm">
                        No fee
                      </InlineText>
                    </RowContainer>
                  </BlockWithRadio>{' '}
                </RowContainer>
              )}

              <RowContainer>
                {isStakeModeOn ? (
                  <StakeButton onClick={stake} disabled={!isValid}>
                    Stake
                  </StakeButton>
                ) : (
                  <UnStakeButton onClick={unstake} disabled={!isValid}>
                    Unstake
                  </UnStakeButton>
                )}
              </RowContainer>
            </ConnectWalletWrapper>
            <RowContainer justify="space-between">
              <ContentBlock width={isStakeModeOn ? '48%' : '100%'}>
                <RowContainer justify="space-between">
                  {' '}
                  <InlineText color="primaryGray" size="sm">
                    Rate:{' '}
                  </InlineText>{' '}
                  <InlineText size="es">
                    1 mSOL ⇄{' '}
                    {stripByAmountAndFormat(
                      mSolInfo?.stats.m_sol_price || 0,
                      4
                    )}{' '}
                    SOL
                  </InlineText>
                </RowContainer>
              </ContentBlock>
              {isStakeModeOn && (
                <ContentBlock width="48%">
                  <RowContainer justify="space-between">
                    {' '}
                    <InlineText color="primaryGray" size="sm">
                      Deposit fee:{' '}
                    </InlineText>{' '}
                    <InlineText size="es">0%</InlineText>
                  </RowContainer>
                </ContentBlock>
              )}
            </RowContainer>
          </ContentBlock>
        </Container>
      </RowContainer>
    </Page>
  )
}
