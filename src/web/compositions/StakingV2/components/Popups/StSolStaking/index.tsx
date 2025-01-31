import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import React, { useEffect, useState } from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { TokenIcon } from '@sb/components/TokenIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { SOL_GAP_AMOUNT } from '@sb/compositions/StakingV2/config'
import { ArrowsExchangeIcon } from '@sb/compositions/Swap/components/Inputs/images/arrowsExchangeIcon'
import { ReverseTokensContainer } from '@sb/compositions/Swap/styles'
import { useConnection } from '@sb/dexUtils/connection'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'
import { useAssociatedTokenAccount } from '@sb/dexUtils/token/hooks'
import {
  sendSignedSignleTransaction,
  signAndSendSingleTransaction,
} from '@sb/dexUtils/transactions'
import { formatNumbersForState } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'
import { useRegionRestriction } from '@sb/hooks/useRegionRestriction'

import { walletAdapterToWallet } from '@core/solana'
import { stripByAmount } from '@core/utils/numberUtils'

import { TooltipIcon } from '../../Icons'
import { AmountInput } from '../../Inputs'
import { NumberWithLabel } from '../../NumberWithLabel/NumberWithLabel'
import { ConfirmUnstakeModal } from '../ConfirmUnstake'
import { HeaderComponent } from '../Header'
import { Box, Column, Container, Row, ModalContainer } from '../index.styles'
import { AdditionalInfoRow } from '../MarinadeStaking/index.styles'
import { SpanContainer } from '../RinStaking/index.styles'
import { Switcher } from '../Switcher/index'
import {
  FirstInputContainer,
  InputsContainer,
  SecondInputContainer,
  MainContainer,
} from './index.styles'

export const StSolStaking = ({
  onClose,
  open,
  socials,
  setIsConnectWalletPopupOpen,
  lidoApy,
  solidoSDK,
}: {
  onClose: () => void
  open: boolean
  socials: string[]
  setIsConnectWalletPopupOpen: (a: boolean) => void
  lidoApy: number
  solidoSDK: any
}) => {
  const isRegionRestricted = useRegionRestriction()
  const [isStakeModeOn, setIsStakeModeOn] = useState(true)
  const [isConfirmUnStakeModalOpen, setIsConfirmUnStakeModalOpen] =
    useState(false)
  const [amount, setAmount] = useState('')
  const [amountGet, setAmountGet] = useState('')
  const [lidoFee, setLidoFee] = useState(0)
  const [priceRatios, setStSOLPriceInSOL] = useState({
    stSOLPriceInSOL: 0.9471,
    SOLPriceInStSOL: 1.0558,
  })
  const [stSOLmaxUnStakeAmountInLamports, setStSOLMaxUnStakeAmountInLamports] =
    useState(0)

  const stSOLWallet = useAssociatedTokenAccount(
    getTokenMintAddressByName('stSOL') || ''
  ) || { amount: 0, symbol: 'stSOL' }

  const SOLWallet = useAssociatedTokenAccount(
    getTokenMintAddressByName('SOL') || ''
  ) || { amount: 0, symbol: 'SOL' }

  const solWalletWithGap = SOLWallet
    ? { ...SOLWallet, amount: Math.max(SOLWallet.amount - SOL_GAP_AMOUNT, 0) }
    : undefined

  const toWalletWithMaxUnStakeAmount = {
    ...stSOLWallet,
    amount: stSOLmaxUnStakeAmountInLamports,
  }

  const fromWallet = isStakeModeOn
    ? solWalletWithGap
    : toWalletWithMaxUnStakeAmount
  const toWallet = isStakeModeOn
    ? toWalletWithMaxUnStakeAmount
    : solWalletWithGap

  const { wallet } = useWallet()
  const connection = useConnection()

  const stake = async () => {
    const walletWithPk = walletAdapterToWallet(wallet)

    try {
      const { transaction } = await solidoSDK.getStakeTransaction({
        amount,
        payerAddress: walletWithPk.publicKey,
      })

      await signAndSendSingleTransaction({
        wallet: walletWithPk,
        connection,
        transaction,
      })
    } catch (e) {
      console.error('stake error', e)
    }
  }

  const unstake = async () => {
    const walletWithPk = walletAdapterToWallet(wallet)
    try {
      const { transaction } = await solidoSDK.getUnStakeTransaction({
        amount,
        payerAddress: walletWithPk.publicKey,
      })

      const signedTx = await wallet.signTransaction(transaction)

      await sendSignedSignleTransaction({
        connection,
        transaction: signedTx,
      })

      setIsConfirmUnStakeModalOpen(false)
    } catch (e) {
      console.error('unstake error', e)
      setIsConfirmUnStakeModalOpen(false)
    }
  }

  const toggleStakeMode = (value: boolean) => {
    setAmount('')
    setAmountGet('')
    setIsStakeModeOn(value)
  }

  const setAmountFrom = (v: string) => {
    const valueForState = formatNumbersForState(v)
    const value = parseFloat(valueForState)

    const newGetValue = isStakeModeOn
      ? value / priceRatios.SOLPriceInStSOL
      : value * priceRatios.SOLPriceInStSOL || 0

    const formattedNewGetValue = stripByAmount(newGetValue, 4).toString()

    setAmount(valueForState)
    setAmountGet(formattedNewGetValue)
  }

  const setAmountTo = (v: string) => {
    const valueForState = formatNumbersForState(v)
    const value = parseFloat(valueForState)

    const newFromValue = isStakeModeOn
      ? value * priceRatios.SOLPriceInStSOL
      : value / priceRatios.SOLPriceInStSOL || 0

    const formattedNewFromValue = stripByAmount(newFromValue, 4).toString()

    setAmountGet(valueForState)
    setAmount(formattedNewFromValue)
  }

  useEffect(() => {
    const getStakingData = async () => {
      const [{ fee }, { stSOLToSOL, SOLToStSOL }, maxUnStakeAmountInLamports] =
        await Promise.all([
          solidoSDK.getStakingRewardsFee(),
          solidoSDK.getExchangeRate(),
          solidoSDK.calculateMaxUnStakeAmount(wallet.publicKey),
        ])

      setLidoFee(fee)

      setStSOLPriceInSOL({
        stSOLPriceInSOL: stSOLToSOL,
        SOLPriceInStSOL: SOLToStSOL,
      })

      setStSOLMaxUnStakeAmountInLamports(
        maxUnStakeAmountInLamports / LAMPORTS_PER_SOL
      )
    }
    getStakingData()
  }, [])

  const isValid = +amount > 0 && fromWallet && +amount <= fromWallet.amount

  return (
    <MainContainer>
      <ModalContainer needBlur className="modal-container">
        <Modal open={open} onClose={onClose}>
          <HeaderComponent socials={socials} close={onClose} token="stSOL" />
          <Column height="auto" margin="2em 0">
            <Row width="100%" margin="2em 0 1em 0" className="apy-row">
              <NumberWithLabel value={lidoApy} label="APY" />
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
                    title={isStakeModeOn ? 'Stake' : 'Unstake'}
                    maxAmount={fromWallet?.amount}
                    amount={amount}
                    onMaxAmountClick={() => {
                      setAmountFrom(stripByAmount(fromWallet?.amount))
                    }}
                    disabled={false}
                    onChange={setAmountFrom}
                    appendComponent={
                      <Container>
                        <TokenIcon
                          margin="0 5px 0 0"
                          mint={getTokenMintAddressByName(
                            fromWallet?.symbol || ''
                          )}
                        />
                        <InlineText color="gray0" size="md" weight={600}>
                          {fromWallet?.symbol}
                        </InlineText>
                      </Container>
                    }
                  />
                </FirstInputContainer>
                <ReverseTokensContainer
                  onClick={() => toggleStakeMode(!isStakeModeOn)}
                  $isReversed={false}
                >
                  <ArrowsExchangeIcon />
                </ReverseTokensContainer>
                <SecondInputContainer>
                  <AmountInput
                    title="Receive"
                    maxAmount={toWallet?.amount}
                    amount={amountGet}
                    onMaxAmountClick={() => {
                      setAmountTo(stripByAmount(toWallet?.amount))
                    }}
                    onChange={setAmountTo}
                    appendComponent={
                      <Container>
                        <TokenIcon
                          margin="0 5px 0 0"
                          mint={getTokenMintAddressByName(
                            toWallet?.symbol || ''
                          )}
                        />
                        <InlineText color="gray0" size="md" weight={600}>
                          {toWallet?.symbol}
                        </InlineText>
                      </Container>
                    }
                  />
                </SecondInputContainer>
              </InputsContainer>
              <AdditionalInfoRow
                margin="1em 0"
                width="100%"
                className="rate-row"
              >
                <Box className="rate-box" height="auto" width="48%">
                  <Row width="100%">
                    <Row>
                      <InlineText color="white2" size="sm">
                        Rate:
                      </InlineText>
                    </Row>
                    <Row>
                      <InlineText color="white2" size="es">
                        1 SOL ⇄ {priceRatios.stSOLPriceInSOL} stSOL
                      </InlineText>
                    </Row>
                  </Row>
                </Box>

                <Box height="auto" width="48%" className="fee-box">
                  <Row width="100%">
                    <Row>
                      <InlineText size="sm" color="white2">
                        <DarkTooltip
                          title={
                            <p>
                              Please note: This fee applies to staking
                              rewards/earnings only, and is NOT taken from your
                              staked amount. It is a fee on earnings only. This
                              fee is split between node operators, the DAO
                              treasury, and Lido for Solana developers.
                            </p>
                          }
                        >
                          <span>
                            <TooltipIcon margin="0 0.5em 0 0" color="white2" />
                          </span>
                        </DarkTooltip>
                        Staking rewards fee:
                      </InlineText>
                    </Row>
                    <Row>
                      <InlineText size="sm" color="white2" weight={600}>
                        {lidoFee}
                      </InlineText>
                    </Row>
                  </Row>
                </Box>
              </AdditionalInfoRow>
            </Column>

            <Column height="auto" width="100%">
              <DarkTooltip
                title={
                  wallet.connected && isRegionRestricted && isStakeModeOn
                    ? "Sorry, Aldrin.com doesn't offer its services in your region."
                    : ''
                }
              >
                <SpanContainer>
                  <Button
                    className="stake-st-btn"
                    onClick={() => {
                      if (!wallet.connected) {
                        setIsConnectWalletPopupOpen(true)
                      }
                      if (isStakeModeOn) {
                        stake()
                      } else {
                        setIsConfirmUnStakeModalOpen(true)
                      }
                    }}
                    $variant={wallet.connected ? 'green' : 'violet'}
                    $width="xl"
                    $padding="xxxl"
                    $fontSize="sm"
                    disabled={
                      (wallet.connected && !isValid) ||
                      (isStakeModeOn && isRegionRestricted)
                    }
                  >
                    {!wallet.connected ? (
                      'Connect Wallet to Stake mSOL'
                    ) : (
                      <>{isStakeModeOn ? 'Stake stSOL' : 'Unstake stSOL'}</>
                    )}
                  </Button>
                </SpanContainer>
              </DarkTooltip>
            </Column>
          </Column>
        </Modal>
      </ModalContainer>
      <ConfirmUnstakeModal
        open={isConfirmUnStakeModalOpen}
        onClose={() => setIsConfirmUnStakeModalOpen(false)}
        unstake={() => unstake()}
      />
    </MainContainer>
  )
}
