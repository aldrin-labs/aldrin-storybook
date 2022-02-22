import { MarinadeUtils } from '@marinade.finance/marinade-ts-sdk'
import { TokenInstructions } from '@project-serum/serum'
import { COLORS } from '@variables/variables'
import React, { useState } from 'react'

import { SvgIcon } from '@sb/components'
import { AmountInput } from '@sb/components/AmountInput'
import { Page } from '@sb/components/Layout'
import { InlineText } from '@sb/components/Typography'

import { getDexTokensPrices as getDexTokensPricesQuery } from '@core/graphql/queries/pools/getDexTokensPrices'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'

import InfoIcon from '@icons/info.svg'

import { queryRendererHoc } from '../../../../../core/src/components/QueryRenderer'
import { ConnectWalletWrapper } from '../../components/ConnectWalletWrapper'
import { DarkTooltip } from '../../components/TooltipCustom/Tooltip'
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
import { MSOL_MINT } from '../../dexUtils/utils'
import { useWallet } from '../../dexUtils/wallet'
import { toMap } from '../../utils'
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
    getDexTokensPricesQuery: { getDexTokensPrices },
  } = props
  const pricesMap = toMap(getDexTokensPrices, (p) => p.symbol)
  const [isStakeModeOn, setIsStakeModeOn] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [amount, setAmount] = useState('')

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

  const amountGet = isStakeModeOn
    ? parseFloat(amount) / mSolPrice
    : parseFloat(amount) * mSolPrice

  const solPrice = pricesMap.get('SOL')?.price || 0
  const usdValue = isStakeModeOn
    ? parseFloat(amount) * solPrice
    : amountGet * solPrice

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
              <ContentBlock width="48%" style={{ background: COLORS.newBlack }}>
                <Row justify="space-between" margin="0 0 2rem 0">
                  <InlineText color="primaryGray" size="sm">
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
              <ContentBlock style={{ background: '#121E10' }} width="48%">
                <Row justify="space-between" margin="0 0 2rem 0">
                  <InlineText color="primaryGray" size="sm">
                    APY
                  </InlineText>{' '}
                  <DarkTooltip title="This annual percentage yield is based on the average APY of last months. See our stats for more details.">
                    <span>
                      <SvgIcon src={InfoIcon} width="1.5rem" />
                    </span>
                  </DarkTooltip>
                </Row>
                <InlineText color="newGreen" size="lg" weight={700}>
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
          <ContentBlock style={{ margin: '0', background: COLORS.newBlack }}>
            <Switcher
              setIsStakeModeOn={toggleStakeMode}
              isStakeModeOn={isStakeModeOn}
            />
            <RowContainer margin="0 0 2rem 0" justify="space-between">
              <InlineText color="primaryGray" size="sm">
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
                  value={`${stripByAmount(amountGet || 0, 4)}`}
                  onChange={() => {}}
                  placeholder="0"
                  name="amountTo"
                  disabled
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
                  <StakeButton onClick={stake} disabled={!isValid || loading}>
                    Stake
                  </StakeButton>
                ) : (
                  <UnStakeButton
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
                  <StyledInlineText color="primaryGray" size="sm">
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
                    <InlineText color="primaryGray" size="sm">
                      Stake fee:{' '}
                    </InlineText>{' '}
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
                    <InlineText color="primaryGray" size="sm">
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
