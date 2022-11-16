import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Keypair, PublicKey } from '@solana/web3.js'
import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import { useTheme } from 'styled-components'

import { FORK_DEX_PID } from '../../../../../core/src/config/dex'
import { useConnection } from '../../dexUtils/connection'
import { notify } from '../../dexUtils/notifications'
import { listMarket } from '../../dexUtils/send'
import { useTokenInfos } from '../../dexUtils/tokenRegistry'
import { useWallet } from '../../dexUtils/wallet'
import { Button } from '../Button'
import { ConnectWalletWrapper } from '../ConnectWalletWrapper'
import { INPUT_FORMATTERS } from '../Input'
import { FlexBlock } from '../Layout'
import { Modal } from '../Modal'
import { TokenIcon } from '../TokenIcon'
import { InlineText, Text } from '../Typography'
import {
  Sidebar,
  Body,
  Content,
  FormGroup,
  Label,
  Li,
  FormInput,
  Step2Head,
  Step2Button,
  IconWrap,
} from './CreateSerumMarketModal.styles'
import { CreateSerumMarketModalProps } from './CreateSerumMarketModal.types'

const trimAddress = (address: string) =>
  `${address.slice(0, 3)}...${address.slice(address.length - 3)}`

const ExternalLinkIcon = () => {
  const t = useTheme()
  return (
    <IconWrap>
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.65 0.125C2.48801 0.125 1.57707 0.355101 0.966085 0.966085C0.355101 1.57707 0.125 2.48801 0.125 3.65V6.35C0.125 7.51199 0.355101 8.42293 0.966085 9.03391C1.57707 9.6449 2.48801 9.875 3.65 9.875H6.35C7.51199 9.875 8.42293 9.6449 9.03391 9.03391C9.6449 8.42293 9.875 7.51199 9.875 6.35V5.45C9.875 5.24289 9.70711 5.075 9.5 5.075C9.29289 5.075 9.125 5.24289 9.125 5.45V6.35C9.125 7.43801 8.9051 8.10207 8.50358 8.50358C8.10207 8.9051 7.43801 9.125 6.35 9.125H3.65C2.56199 9.125 1.89793 8.9051 1.49642 8.50358C1.0949 8.10207 0.875 7.43801 0.875 6.35V3.65C0.875 2.56199 1.0949 1.89793 1.49642 1.49642C1.89793 1.0949 2.56199 0.875 3.65 0.875H4.55C4.75711 0.875 4.925 0.707107 4.925 0.5C4.925 0.292893 4.75711 0.125 4.55 0.125H3.65ZM9.76517 0.234835C9.80112 0.270789 9.82825 0.312227 9.84655 0.356457C9.86488 0.400671 9.875 0.449154 9.875 0.5V2.75C9.875 2.95711 9.70711 3.125 9.5 3.125C9.29289 3.125 9.125 2.95711 9.125 2.75V1.40533L6.01516 4.51516C5.86872 4.66161 5.63128 4.66161 5.48484 4.51516C5.33839 4.36872 5.33839 4.13128 5.48484 3.98484L8.59467 0.875H7.25C7.04289 0.875 6.875 0.707107 6.875 0.5C6.875 0.292893 7.04289 0.125 7.25 0.125H9.49989H9.5C9.506 0.125 9.512 0.125143 9.51799 0.125429C9.5608 0.127472 9.60332 0.136814 9.64354 0.153454C9.68777 0.171754 9.72921 0.198881 9.76517 0.234835Z"
          fill={t.colors.block}
        />
      </svg>
    </IconWrap>
  )
}

export const CreateSerumMarketModal: React.FC<CreateSerumMarketModalProps> = (
  props
) => {
  const [step, setStep] = useState(1)
  const [marketAddress, setMarketAddress] = useState<PublicKey>()
  const { onClose } = props
  const connection = useConnection()
  const { wallet } = useWallet()
  const form = useFormik({
    initialValues: {
      baseTokenMintAddress: '',
      quoteTokenMintAddress: '',
      minOrderSize: '0',
      tickSize: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.baseTokenMintAddress) {
        errors.baseTokenMintAddress = 'Required'
      }
      if (!values.quoteTokenMintAddress) {
        errors.quoteTokenMintAddress = 'Required'
      }
      if (!values.minOrderSize) {
        errors.minOrderSize = 'Required'
      } else {
        const minOrderSize = parseFloat(values.minOrderSize)
        if (minOrderSize <= 0) {
          errors.minOrderSize = 'Must be greater than 0'
        }
      }
      if (!values.tickSize) {
        errors.tickSize = 'Required'
      } else {
        const tickSize = parseFloat(values.tickSize)
        if (tickSize <= 0) {
          errors.tickSize = 'Must be greater than 0'
        }
      }
      if (
        values.baseTokenMintAddress &&
        values.quoteTokenMintAddress === values.baseTokenMintAddress
      ) {
        errors.baseTokenMintAddress = 'Must be different from quote token'
        errors.quoteTokenMintAddress = 'Must be different from base token'
      }

      try {
        // eslint-disable-next-line no-new
        new PublicKey(values.baseTokenMintAddress)
      } catch (e) {
        errors.baseTokenMintAddress = 'Invalid address'
      }

      try {
        // eslint-disable-next-line no-new
        new PublicKey(values.quoteTokenMintAddress)
      } catch (e) {
        errors.quoteTokenMintAddress = 'Invalid address'
      }

      return errors
    },
    onSubmit: async (values) => {
      console.log('Submit form', values)
      const kp = Keypair.generate()
      const bt = new Token(
        connection,
        new PublicKey(values.baseTokenMintAddress),
        TOKEN_PROGRAM_ID,
        kp
      )
      const qt = new Token(
        connection,
        new PublicKey(values.quoteTokenMintAddress),
        TOKEN_PROGRAM_ID,
        kp
      )
      const [baseTokenInfo, quoteTokeInfo] = await Promise.all([
        bt.getMintInfo(),
        qt.getMintInfo(),
      ])
      const marketInfo = {
        baseMint: new PublicKey(values.baseTokenMintAddress),
        quoteMint: new PublicKey(values.quoteTokenMintAddress),
        quoteLotSize:
          parseFloat(values.tickSize) * 10 ** quoteTokeInfo.decimals,
        baseLotSize:
          parseFloat(values.minOrderSize) * 10 ** baseTokenInfo.decimals,
        dexProgramId: FORK_DEX_PID,
        connection,
        wallet,
      }
      console.log('marketInfo', marketInfo)
      const market = await listMarket(marketInfo)
      if (market.result === 'success') {
        setMarketAddress(market.market)
        setStep(2)
      } else {
        notify({
          message: 'Error creating market',
          type: 'error',
        })
      }
    },
  })

  const tokens = useTokenInfos()
  const baseToken = tokens.get(form.values.baseTokenMintAddress)
  const quoteToken = tokens.get(form.values.quoteTokenMintAddress)

  const name = `${
    baseToken?.symbol || trimAddress(form.values.baseTokenMintAddress)
  }/${quoteToken?.symbol || trimAddress(form.values.quoteTokenMintAddress)}`
  const jsonOutput = JSON.stringify(
    {
      name,
      address: marketAddress?.toString(),
      programId: FORK_DEX_PID.toString(),
      deprecated: true,
    },
    null,
    2
  ).replaceAll('",', '",\r')

  const copyMarketCode = () => {
    window.navigator.clipboard.writeText(jsonOutput)
    notify({
      message: 'JSON copied to clipboard',
    })
  }
  return (
    <Modal
      styles={{
        root: { zIndex: 999 },
      }}
      open
      onClose={onClose}
    >
      <Body>
        <FlexBlock direction="row">
          <Sidebar>
            <FlexBlock
              style={{ height: '100%' }}
              direction="column"
              justifyContent="space-between"
            >
              <div>
                <ol>
                  <Li
                    $color={step === 1 ? 'white1' : 'green1'}
                    $isActive={step === 1}
                  >
                    Create Market
                  </Li>
                  <Li
                    $color={step === 2 ? 'white1' : 'white2'}
                    $isActive={step === 2}
                  >
                    Submit Listing
                  </Li>
                </ol>
              </div>
              <div>
                <FlexBlock direction="row" $alignItems="center">
                  <ExternalLinkIcon />
                  <InlineText
                    color="border"
                    as="a"
                    size="sm"
                    href="https://google.com"
                    target="_blank"
                  >
                    Market Creation Guide
                  </InlineText>
                </FlexBlock>
                <FlexBlock direction="row" $alignItems="center">
                  <ExternalLinkIcon />
                  <InlineText
                    color="border"
                    as="a"
                    size="sm"
                    href="https://google.com"
                    target="_blank"
                  >
                    About Aldrin CLOB
                  </InlineText>
                </FlexBlock>
              </div>
            </FlexBlock>
          </Sidebar>
          <Content>
            {step === 1 && (
              <FormikProvider value={form}>
                <form onSubmit={form.handleSubmit}>
                  <FormGroup>
                    <Label htmlFor="baseTokenMintAddress">
                      Base Token Mint Address
                    </Label>
                    <FormInput
                      borderRadius="md"
                      variant="outline"
                      name="baseTokenMintAddress"
                      append={
                        <>
                          {baseToken && (
                            <FlexBlock alignItems="center" direction="row">
                              <TokenIcon mint={baseToken.address} />
                              <span>&nbsp;</span>
                              <InlineText size="sm">
                                {baseToken.symbol}
                              </InlineText>
                            </FlexBlock>
                          )}
                        </>
                      }
                    />
                    {form.errors.baseTokenMintAddress &&
                      form.touched.baseTokenMintAddress && (
                        <Text size="sm" color="red3">
                          {form.errors.baseTokenMintAddress}
                        </Text>
                      )}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="quoteTokenMintAddress">
                      Quote Token Mint Address
                    </Label>
                    <FormInput
                      borderRadius="md"
                      variant="outline"
                      name="quoteTokenMintAddress"
                      append={
                        <>
                          {quoteToken && (
                            <FlexBlock alignItems="center" direction="row">
                              <TokenIcon mint={quoteToken.address} />
                              <span>&nbsp;</span>
                              <InlineText size="sm">
                                {quoteToken.symbol}
                              </InlineText>
                            </FlexBlock>
                          )}
                        </>
                      }
                    />
                    {form.errors.quoteTokenMintAddress &&
                      form.touched.quoteTokenMintAddress && (
                        <Text size="sm" color="red3">
                          {form.errors.quoteTokenMintAddress}
                        </Text>
                      )}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="minOrderSize">
                      Minimum Order Size (in Base Token)
                    </Label>
                    <FormInput
                      borderRadius="md"
                      variant="outline"
                      name="minOrderSize"
                      placeholder="Lot size, in Base token, (e.g. 0.001)"
                      formatter={INPUT_FORMATTERS.DECIMAL}
                    />
                    {form.errors.minOrderSize && form.touched.minOrderSize && (
                      <Text size="sm" color="red3">
                        {form.errors.minOrderSize}
                      </Text>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="tickSize">
                      {' '}
                      Tick Size (in Quote Token)
                    </Label>
                    <FormInput
                      name="tickSize"
                      placeholder='Price tick size, in Quote token (e.g. "0.001"))'
                      borderRadius="md"
                      variant="outline"
                      formatter={INPUT_FORMATTERS.DECIMAL}
                    />
                    {form.errors.tickSize && form.touched.tickSize && (
                      <Text size="sm" color="red3">
                        {form.errors.tickSize}
                      </Text>
                    )}
                  </FormGroup>
                  <FlexBlock
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                  >
                    <div>
                      <Text size="sm">Market Creation Gas Fee</Text>
                      <InlineText weight={700} size="md" color="green1">
                        2.8 SOL
                      </InlineText>
                    </div>
                    <div>
                      <ConnectWalletWrapper size="button-only">
                        <Button
                          disabled={!form.isValid}
                          $variant="red"
                          $padding="lg"
                          type="submit"
                        >
                          Create Market
                        </Button>
                      </ConnectWalletWrapper>
                    </div>
                  </FlexBlock>
                </form>
              </FormikProvider>
            )}
            {step === 2 && (
              <>
                <Step2Head>
                  <Text>
                    Use information below to make a PR of your market listing to
                    Aldrin Registry. After PR is submitted you can close the
                    page.
                  </Text>
                </Step2Head>
                <FormGroup>
                  <Label>Market</Label>
                  <Text>{name}</Text>
                </FormGroup>
                <FormGroup>
                  <Label>JSON</Label>
                  <Text size="sm" as="pre">
                    {jsonOutput}
                  </Text>
                </FormGroup>
                <FormGroup>
                  <Button $variant="outline-white" onClick={copyMarketCode}>
                    Copy
                  </Button>
                </FormGroup>

                <FlexBlock justifyContent="space-between">
                  <Step2Button
                    onClick={onClose}
                    $padding="xl"
                    $variant="outline-red"
                  >
                    Close
                  </Step2Button>
                  <Step2Button
                    as="a"
                    href="https://github.com/aldrin-exchange/aldrin-registry"
                    target="blank"
                    $padding="xl"
                    $variant="red"
                  >
                    Open Github
                  </Step2Button>
                </FlexBlock>
              </>
            )}
          </Content>
        </FlexBlock>
      </Body>
    </Modal>
  )
}
