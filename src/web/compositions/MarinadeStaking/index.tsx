import { MarinadeUtils } from '@marinade.finance/marinade-ts-sdk'
import { TokenInstructions } from '@project-serum/serum'
import React, { useState } from 'react'

import { SvgIcon } from '@sb/components'
import { AmountInput } from '@sb/components/AmountInput'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { Page } from '@sb/components/Layout'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import {
  useMarinadeSdk,
  useMarinadeStakingInfo,
} from '@sb/dexUtils/staking/hooks'
import {
  useAssociatedTokenAccount,
  useUserTokenAccounts,
} from '@sb/dexUtils/token/hooks'
import { signAndSendSingleTransaction } from '@sb/dexUtils/transactions'
import {
  formatNumbersForState,
  formatNumberWithSpaces,
  MSOL_MINT,
} from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'
import { toMap } from '@sb/utils'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices as getDexTokensPricesQuery } from '@core/graphql/queries/pools/getDexTokensPrices'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'

import InfoIcon from '@icons/info.svg'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { InputWrapper } from '../RinStaking/styles'
import {
  StretchedContent,
  ContentBlock,
  StakeButton,
  UnStakeButton,
} from '../Staking/styles'
import MarinadeBg from './bg.png'
import { Switcher } from './components/Switcher/Switcher'
import { WellDoneModal } from './components/WellDoneModal'
import { Container, StyledInlineText } from './styles'
import { StakingBlockProps } from './types'
import {
  notifyAboutStakeTransaction,
  notifyAboutUnStakeTransaction,
} from './utils'

const SOL_MINT = TokenInstructions.WRAPPED_SOL_MINT.toString()
const SOL_GAP_AMOUNT = 0.0127 // to allow transaactions pass

const Block: React.FC<StakingBlockProps> = (props) => {
  const {
    getDexTokensPricesQuery: { getDexTokensPrices = [] },
  } = props
  const pricesMap = toMap(getDexTokensPrices, (p) => p.symbol)
  const [isStakeModeOn, setIsStakeModeOn] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [amount, setAmount] = useState('')
  const [amountGet, setAmountGet] = useState('')

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

  const mSolPrice = mSolInfo?.stats.m_sol_price || 1

  // const amountGet = isStakeModeOn
  //   ? parseFloat(amount) / mSolPrice
  //   : parseFloat(amount) * mSolPrice

  const solPrice = pricesMap.get('SOL')?.price || 0
  const usdValue = isStakeModeOn
    ? parseFloat(amount) * solPrice
    : parseFloat(amountGet) * solPrice

  const setAmountFrom = (v: string) => {
    const valueForState = formatNumbersForState(v)
    const value = parseFloat(valueForState)

    const newGetValue = isStakeModeOn ? value / mSolPrice : value * mSolPrice

    setAmount(valueForState)
    setAmountGet(stripByAmount(newGetValue || 0, 4))
  }

  const setAmountTo = (v: string) => {
    const valueForState = formatNumbersForState(v)
    const value = parseFloat(valueForState)

    const newFromValue = isStakeModeOn ? value * mSolPrice : value / mSolPrice

    setAmountGet(valueForState)
    setAmount(stripByAmount(newFromValue || 0, 4))
  }

  const toggleStakeMode = (value: boolean) => {
    setAmount('0')
    setAmountGet('0')
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
      setModalOpen(true)
    } catch (e) {
      notify({
        message: 'Something went wrong. Please, try again later',
      })
    }

    setLoading(false)
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
        {isStakeModeOn && (
          <Container>
            <StretchedContent>
              <ContentBlock width="48%" background="green8">
                <Row justify="space-between" margin="0 0 2rem 0">
                  <InlineText color="gray0" size="sm">
                    Epoch
                  </InlineText>{' '}
                  <DarkTooltip title="Epochs have variable length on the Solana blockchain. They are tied to the number of slots produced by the blockchain. Staking rewards are distributed at the end of each epoch.">
                    <span>
                      <SvgIcon src={InfoIcon} width="1.5rem" />
                    </span>
                  </DarkTooltip>
                </Row>
                <InlineText size="lg" weight={700}>
                  {mSolInfo?.epochInfo.epochPct
                    ? stripByAmountAndFormat(mSolInfo.epochInfo.epochPct, 2)
                    : '---'}
                  %
                </InlineText>
              </ContentBlock>
              <ContentBlock background="gray6" width="48%">
                <Row justify="space-between" margin="0 0 2rem 0">
                  <InlineText color="gray0" size="sm">
                    APY
                  </InlineText>{' '}
                  <DarkTooltip title="This annual percentage yield is based on the average APY of last months. See our stats for more details.">
                    <span>
                      <SvgIcon src={InfoIcon} width="1.5rem" />
                    </span>
                  </DarkTooltip>
                </Row>
                <InlineText color="green7" size="lg" weight={700}>
                  {mSolInfo?.stats.avg_staking_apy
                    ? stripByAmount(mSolInfo.stats.avg_staking_apy, 2)
                    : '---'}
                  {}%
                </InlineText>
              </ContentBlock>
            </StretchedContent>
          </Container>
        )}
        <Container>
          <ContentBlock background="gray6" style={{ margin: '0' }}>
            <Switcher
              setIsStakeModeOn={toggleStakeMode}
              isStakeModeOn={isStakeModeOn}
            />
            <RowContainer margin="0 0 2rem 0" justify="space-between">
              <InlineText size="sm">
                Stake SOL and use mSOL while earning rewards
              </InlineText>
              <DarkTooltip
                title={
                  <>
                    <p>
                      mSOL has been integrated by many protocols in the Solana
                      ecosystem including Aldrin!{' '}
                    </p>
                    <p>
                      mSOL opens up new opportunities for you to cook your own
                      DeFi recipes, adapted to your own needs and risk appetite.
                      From single staking your mSOL without any added risk to
                      adventurous degen strategies, mSOL can be marinated in all
                      your DeFi recipes.
                    </p>
                    <p>
                      Also keep in mind that mSOL can be traded at its current
                      value in exchange for any other cryptocurrency on a
                      decentralized exchange without the need to unstake first.
                    </p>
                  </>
                }
              >
                <span>
                  <SvgIcon src={InfoIcon} width="1.5rem" />
                </span>
              </DarkTooltip>
            </RowContainer>

            <RowContainer>
              <InputWrapper style={{ position: 'relative' }}>
                {' '}
                <AmountInput
                  data-testid="marinade-staking-amount-from-field"
                  value={formatNumberWithSpaces(amount)}
                  onChange={setAmountFrom}
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
                  data-testid="marinade-staking-receive-amount-field"
                  value={formatNumberWithSpaces(amountGet)}
                  onChange={setAmountTo}
                  placeholder="0"
                  name="amountTo"
                  amount={toWallet?.amount || 0}
                  mint={toWallet?.mint || ''}
                  label="Receive"
                  showButtons={false}
                  usdValue={usdValue}
                />
              </InputWrapper>
            </RowContainer>
            <RowContainer>
              <ConnectWalletWrapper size="button-only">
                {isStakeModeOn ? (
                  <StakeButton
                    data-testid="marinade-staking-submit-btn"
                    onClick={stake}
                    disabled={!isValid || loading}
                  >
                    Stake
                  </StakeButton>
                ) : (
                  <UnStakeButton
                    data-testid="marinade-unstaking-submit-btn"
                    onClick={unstake}
                    disabled={!isValid || loading}
                  >
                    Unstake
                  </UnStakeButton>
                )}
              </ConnectWalletWrapper>
            </RowContainer>
            <RowContainer justify="space-between">
              <ContentBlock width="48%">
                <RowContainer justify="space-between">
                  {' '}
                  <StyledInlineText color="gray0" size="sm">
                    Rate:{' '}
                  </StyledInlineText>{' '}
                  <InlineText size="es">
                    1 mSOL ⇄{' '}
                    {mSolInfo?.stats.m_sol_price
                      ? stripByAmountAndFormat(mSolInfo.stats.m_sol_price, 4)
                      : '---'}{' '}
                    SOL
                  </InlineText>
                </RowContainer>
              </ContentBlock>
              {isStakeModeOn ? (
                <ContentBlock width="48%">
                  <Row justify="space-between">
                    {' '}
                    <InlineText size="sm">Stake fee: </InlineText>{' '}
                    <InlineText style={{ margin: '0 4px 0 auto' }} size="es">
                      0%
                    </InlineText>
                    <DarkTooltip title="There is 0% fee for staking your SOL and receiving mSOL.">
                      <span>
                        <SvgIcon
                          style={{ paddingTop: '3px' }}
                          src={InfoIcon}
                          width="1.5rem"
                        />
                      </span>
                    </DarkTooltip>
                  </Row>
                </ContentBlock>
              ) : (
                <ContentBlock width="48%">
                  <RowContainer justify="space-between">
                    <InlineText color="gray0" size="sm">
                      Unstake fee:{' '}
                    </InlineText>{' '}
                    <InlineText style={{ margin: '0 4px 0 auto' }} size="es">
                      ≈0.3%
                    </InlineText>
                  </RowContainer>
                </ContentBlock>
              )}
            </RowContainer>
          </ContentBlock>
        </Container>
      </RowContainer>
      {modalOpen && <WellDoneModal onClose={() => setModalOpen(false)} />}
    </Page>
  )
}

export const MarinadeStaking = queryRendererHoc({
  query: getDexTokensPricesQuery,
  name: 'getDexTokensPricesQuery',
  fetchPolicy: 'cache-and-network',
  withoutLoading: true,
  pollInterval: 10000,
})(Block)
