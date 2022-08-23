import { SolidoSDK } from '@lidofinance/solido-sdk'
import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { ArrowsExchangeIcon } from '@sb/compositions/Swap/components/Inputs/images/arrowsExchangeIcon'
import { ReverseTokensContainer } from '@sb/compositions/Swap/styles'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import { RIN_MINT } from '@core/solana'

import { AmountInput } from '../../Inputs'
import { NumberWithLabel } from '../../NumberWithLabel/NumberWithLabel'
import { HeaderComponent } from '../Header'
import { Box, Column, Container, Row } from '../index.styles'
import { AdditionalInfoRow } from '../MarinadeStaking/index.styles'
import { Switcher } from '../Switcher/index'
import { ModalContainer } from '../WithdrawLiquidity/index.styles'
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
}: {
  onClose: () => void
  open: boolean
  socials: any // TO DO
}) => {
  const [isStakeModeOn, setIsStakeModeOn] = useState(true)
  const [amount, setAmount] = useState('')
  const [amountGet, setAmountGet] = useState('')

  const { wallet } = useWallet()
  const connection = useConnection()

  console.log({ connection })

  const solidoSDK = new SolidoSDK(
    'mainnet-beta',
    connection,
    'your_solana_referral_address'
  )

  const stake = async (amount: number) => {
    // try {
    const { transaction, stSolAccountAddress } =
      await solidoSDK.getStakeTransaction({
        amount, // The amount of SOL-s which need to stake
        payerAddress: wallet.publicKey,
      })
    // } catch (e) {
    //   console.log('error create transaction', e)
    // }

    try {
      // Do something before singing transaction
      const signed = await wallet.signTransaction(transaction)

      const transactionHash = await connection.sendRawTransaction(
        signed.serialize()
      )

      // Do something before confirming transaction
      const { value: status } = await connection.confirmTransaction(
        transactionHash
      )

      if (status?.err) {
        throw status.err
      }

      // Do something after getting success transaction
    } catch (e) {
      console.log('error sign transaction', e)
    }
  }

  const toggleStakeMode = (value: boolean) => {
    setAmount('0')
    setAmountGet('0')
    setIsStakeModeOn(value)
  }

  return (
    <MainContainer>
      <ModalContainer needBlur className="modal-container">
        <Modal open={open} onClose={onClose}>
          <HeaderComponent socials={socials} close={onClose} token="stSOL" />
          <Column height="auto" margin="2em 0">
            <Row width="100%" margin="2em 0 1em 0" className="apy-row">
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
                    title={isStakeModeOn ? 'Stake' : 'Unstake'}
                    maxAmount="0.00"
                    amount={0}
                    onMaxAmountClick={() => {}}
                    disabled={false}
                    onChange={() => {}}
                    appendComponent={
                      <Container>
                        <TokenIcon margin="0 5px 0 0" mint={RIN_MINT} />
                        <InlineText color="gray0" size="md" weight={600}>
                          RIN
                        </InlineText>
                      </Container>
                    }
                  />
                </FirstInputContainer>
                <ReverseTokensContainer $isReversed={false}>
                  <ArrowsExchangeIcon
                    onClick={() => setIsStakeModeOn(!isStakeModeOn)}
                  />
                </ReverseTokensContainer>
                <SecondInputContainer>
                  <AmountInput
                    title="Receive"
                    maxAmount="0.00"
                    amount={0}
                    onMaxAmountClick={() => {}}
                    onChange={() => {}}
                    appendComponent={
                      <Container>
                        <TokenIcon
                          margin="0 5px 0 0"
                          mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                        />
                        <InlineText color="gray0" size="md" weight={600}>
                          USDC
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
                      <InlineText size="sm">Rate:</InlineText>
                    </Row>
                    <Row>
                      <InlineText size="sm" color="gray0" weight={600}>
                        0.0005 SOL
                      </InlineText>
                    </Row>
                  </Row>
                </Box>

                <Box height="auto" width="48%" className="fee-box">
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
              </AdditionalInfoRow>
            </Column>

            <Column height="auto" width="100%">
              <Button
                className="stake-st-btn"
                onClick={() => {
                  stake(0.01)
                }}
                $variant={wallet.connected ? 'green' : 'violet'}
                $width="xl"
                $padding="xxxl"
                $fontSize="sm"
              >
                {!wallet.connected ? (
                  'Connect Wallet to Stake mSOL'
                ) : (
                  <>{isStakeModeOn ? 'Stake stSOL' : 'Unstake stSOL'}</>
                )}
              </Button>
            </Column>
          </Column>
        </Modal>
      </ModalContainer>
    </MainContainer>
  )
}
