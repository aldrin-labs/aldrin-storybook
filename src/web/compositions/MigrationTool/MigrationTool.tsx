import { BORDER_RADIUS } from '@variables/variables'
import React, { FC, useState } from 'react'
import styled from 'styled-components'

import { SvgIcon } from '@sb/components'
import { Button } from '@sb/components/Button'
import { Input } from '@sb/components/Input'
import {
  BlackPage,
  Cell,
  Row,
  StretchedBlock,
  WideContent,
} from '@sb/components/Layout'
import { InlineText, Text } from '@sb/components/Typography'

import AldrinHelmetIcon from './assets/aldrinHelmet.svg'
import ToolKitIcon from './assets/toolKit.svg'

const MigrationToolBlockContainer = styled(StretchedBlock)`
  min-height: 80%;
  background: ${({ theme }) => theme.colors.white6};
  border-radius: ${BORDER_RADIUS.lg};
  padding: 2em;
`

const StyledButton = styled(Button)`
  height: 4em;
`

const ColumnStretchBlock = styled(StretchedBlock)`
  flex-direction: column;
`

const StyledLink = styled.a`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue1};
`

interface CommonStepParams {
  nextStep: () => void
}

const ConnectWalletStep: FC<CommonStepParams> = ({ nextStep }) => {
  return (
    <>
      <StretchedBlock>
        <SvgIcon src={ToolKitIcon} width="2em" height="2em" />
        <SvgIcon src={AldrinHelmetIcon} width="2em" height="2em" />
      </StretchedBlock>
      <ColumnStretchBlock>
        <Text margin="0" weight={600}>
          Dear Aldrinauts,
        </Text>
        <Text margin="1em 0 0 0">
          About 8 000 Solana Wallets got compromised today. Funds locked in
          smart contracts are safe but withdrawal may cause them to get stolen.
          Follow next instructions to get your staking and liquidity positions
          safe.
        </Text>
      </ColumnStretchBlock>
      <StyledButton $variant="blue" onClick={nextStep}>
        Connect Wallet
      </StyledButton>
    </>
  )
}

const CreateNewWalletStep: FC<CommonStepParams> = ({ nextStep }) => {
  return (
    <>
      <StretchedBlock>
        <InlineText size="xl" weight={600}>
          1
        </InlineText>
        <SvgIcon src={AldrinHelmetIcon} width="2em" height="2em" />
      </StretchedBlock>
      <ColumnStretchBlock>
        <Text margin="0" weight={600}>
          Create New Wallet
        </Text>
        <Text margin="1em 0 0 0">
          To ensure that you withdraw funds to an uncompromised wallet, we
          recommend you to create a new address on the basic Solana wallet{' '}
          <StyledLink
            target="_blank"
            rel="noopener noreferrer"
            href="https://sollet.io"
          >
            Sollet.io
          </StyledLink>
        </Text>
      </ColumnStretchBlock>
      <StyledButton $variant="blue" onClick={nextStep}>
        I have created new wallet
      </StyledButton>
    </>
  )
}

interface SpecifyWalletAddressParams extends CommonStepParams {
  setSendToWalletAddress: (address: string) => void
}

const StyledInput = styled(Input)`
  margin-top: 1em;
  border: 1px solid ${({ theme }) => theme.colors.white4};
  background: ${({ theme }) => theme.colors.white5};
  border-radius: ${BORDER_RADIUS.lg};

  input {
    color: ${({ theme }) => theme.colors.white1};

    &:placeholder {
      color: ${({ theme }) => theme.colors.white2};
    }
  }
`

const SpecifyWalletAddressStep = ({
  nextStep,
  setSendToWalletAddress,
}: SpecifyWalletAddressParams) => {
  const [walletAddress, setWalletAddress] = useState('')

  return (
    <>
      <StretchedBlock>
        <InlineText size="xl" weight={600}>
          2
        </InlineText>
        <SvgIcon src={AldrinHelmetIcon} width="2em" height="2em" />
      </StretchedBlock>
      <ColumnStretchBlock>
        <Text margin="0" weight={600}>
          Specify your recently created new wallet address
        </Text>
        <StyledInput
          name="toWalletAddress"
          value={walletAddress}
          placeholder="Paste address here"
          onChange={(value) => setWalletAddress(value)}
        />
      </ColumnStretchBlock>
      <StyledButton
        $variant="blue"
        onClick={() => {
          nextStep()
          setSendToWalletAddress(walletAddress)
        }}
      >
        Next
      </StyledButton>
    </>
  )
}

interface WithdrawPositionsParams extends CommonStepParams {
  sendToWalletAddress: string
}

const WithdrawPositionsStep = ({
  nextStep,
  sendToWalletAddress,
}: WithdrawPositionsParams) => {
  console.log('sendToWalletAddress', sendToWalletAddress)
  return (
    <>
      <StretchedBlock>
        <InlineText size="xl" weight={600}>
          3
        </InlineText>
        <SvgIcon src={AldrinHelmetIcon} width="2em" height="2em" />
      </StretchedBlock>
      <ColumnStretchBlock>
        <Text margin="0" weight={600}>
          Withdraw your positions to the new wallet
        </Text>
        <div />
      </ColumnStretchBlock>
      <StyledButton
        $variant="blue"
        onClick={() => {
          nextStep()
        }}
      >
        Transfer LP Positions, Claimed Rewards & Unstaked RIN
      </StyledButton>
    </>
  )
}

const MigrationTool = () => {
  const [step, setStep] = useState(0)
  const [sendToWalletAddress, setSendToWalletAddress] = useState('')

  const nextStep = () => setStep(step + 1)

  return (
    <BlackPage>
      <WideContent style={{ height: '100%' }}>
        <Row
          style={{ width: '100%', height: '100%', justifyContent: 'center' }}
        >
          <Cell
            col={10}
            colSm={9}
            colMd={8}
            colLg={7}
            colXl={6}
            style={{ justifyContent: 'center' }}
          >
            <MigrationToolBlockContainer direction="column">
              {step === 0 && <ConnectWalletStep nextStep={nextStep} />}
              {step === 1 && <CreateNewWalletStep nextStep={nextStep} />}
              {step === 2 && (
                <SpecifyWalletAddressStep
                  nextStep={nextStep}
                  setSendToWalletAddress={setSendToWalletAddress}
                />
              )}
              {step === 3 && (
                <WithdrawPositionsStep
                  sendToWalletAddress={sendToWalletAddress}
                  nextStep={nextStep}
                />
              )}
            </MigrationToolBlockContainer>
          </Cell>
        </Row>
      </WideContent>
    </BlackPage>
  )
}

export { MigrationTool }
