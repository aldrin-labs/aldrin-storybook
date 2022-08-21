import React, { useState } from 'react'
import { TokenInstructions } from '@project-serum/serum'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { InlineText } from '@sb/components/Typography'
import { useWallet } from '@sb/dexUtils/wallet'

import { NumberWithLabel } from '../../NumberWithLabel/NumberWithLabel'
import { HeaderComponent } from '../Header'
import { Box, Column, Row } from '../index.styles'
import { Switcher } from '../Switcher/index'
import { ModalContainer } from '../WithdrawLiquidity/index.styles'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'

import { ValuesContainer } from './DepositContainer'
import {
  notifyAboutStakeTransaction,
  notifyAboutUnStakeTransaction,
} from '@sb/compositions/MarinadeStaking/utils'
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
import { MarinadeUtils } from '@marinade.finance/marinade-ts-sdk'
import { stripByAmount } from '@core/utils/chartPageUtils'
import { useConnection } from '@sb/dexUtils/connection'
import { toMap } from '@sb/utils'
import {
  formatNumbersForState,
  formatNumberWithSpaces,
} from '@sb/dexUtils/utils'
import { MSolStakingBlockProps } from '../types'
import {
  FirstInputContainer,
  InputsContainer,
  PositionatedIconContainer,
  SecondInputContainer,
} from './index.styles'
import { AmountInput } from '@sb/components/AmountInput'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { getDexTokensPrices as getDexTokensPricesQuery } from '@core/graphql/queries/pools/getDexTokensPrices'

const SOL_MINT = TokenInstructions.WRAPPED_SOL_MINT.toString()
const SOL_GAP_AMOUNT = 0.0127 // to allow transaactions pass

const Block = ({
  open,
  onClose,
  getDexTokensPricesQuery,
}: {
  open: boolean
  onClose: () => void
}) => {
  // const {
  //   getDexTokensPricesQuery: { getDexTokensPrices = [] },
  //   open,
  //   onClose,
  // } = props
  const pricesMap = toMap(getDexTokensPricesQuery, (p) => p.symbol)
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

  const [isRebalanceChecked, setIsRebalanceChecked] = useState(false)
  return (
    <ModalContainer needBlur className="modal-container">
      <Modal open={open} onClose={onClose}>
        <HeaderComponent arrow close={onClose} token="stSOL" />
        <Column height="auto" margin="2em 0">
          <Row width="100%" margin="2em 0 1em 0">
            <NumberWithLabel value={0} label="Epoch" />
            <NumberWithLabel value={12} label="APY" />
          </Row>
          <Switcher
            isStakeModeOn={isStakeModeOn}
            setIsStakeModeOn={toggleStakeMode}
          />
          <InlineText color="white2" size="sm">
            Stake SOL and use stSOL while earning rewards
          </InlineText>
          <Column height="auto" width="100%" margin="1em 0 2.4em 0">
            <InputsContainer>
              <FirstInputContainer>
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
              </FirstInputContainer>
              <PositionatedIconContainer>+</PositionatedIconContainer>
              <SecondInputContainer>
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
              </SecondInputContainer>
            </InputsContainer>
            <Row margin="1em 0" width="100%">
              <Box height="auto" width="48%">
                <Row width="100%">
                  <Row>
                    <InlineText size="sm">Rate:</InlineText>
                  </Row>
                  <Row>
                    <InlineText size="sm" color="gray0" weight={600}>
                      0.0005 SOL
                    </InlineText>
                  </Row>
                </Row>
              </Box>

              <Box height="auto" width="48%">
                <Row width="100%">
                  <Row>
                    <InlineText size="sm">Stake Fee:</InlineText>
                  </Row>
                  <Row>
                    <InlineText size="sm" color="gray0" weight={600}>
                      $14.42
                    </InlineText>
                  </Row>
                </Row>
              </Box>
            </Row>
          </Column>

          <Column height="auto" width="100%">
            <Button
              onClick={() => {
                // connect wallet
              }}
              $variant={wallet.connected ? 'green' : 'violet'}
              $width="xl"
              $padding="xxxl"
              $fontSize="sm"
            >
              {isRebalanceChecked || !wallet.connected ? (
                'Connect Wallet to Stake stSOL'
              ) : (
                <>{isStakeModeOn ? 'Stake stSOL' : 'Unstake stSOL'}</>
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
