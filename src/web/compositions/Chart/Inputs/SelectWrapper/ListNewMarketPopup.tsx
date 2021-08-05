import React, { ReactElement, useMemo, useState } from 'react'
// import { Button, Form, Input, Tooltip, Typography } from 'antd';
import copy from 'clipboard-copy'
import { PublicKey } from '@solana/web3.js'
import { notify } from '@sb/dexUtils/notifications'
import { MARKETS } from '@project-serum/serum'
import { useConnection, useAccountInfo } from '@sb/dexUtils/connection'
import { TokenInstructions } from '@project-serum/serum'
// import FloatingElement from '../components/layout/FloatingElement';
import styled from 'styled-components'
import { useWallet } from '@sb/dexUtils/wallet'
import { listMarket } from '@sb/dexUtils/send'
import { isValidPublicKey } from '@sb/dexUtils/utils'
import { parseTokenMintData, useMintToTickers } from '@sb/dexUtils/tokens'

import { Dialog, Paper } from '@material-ui/core'
import { FormInputContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { PurpleButton } from '@sb/compositions/Addressbook/components/Popups/NewCoinPopup'
import Clear from '@material-ui/icons/Clear'
import {
  TypographyTitle,
  StyledDialogContent,
  ClearButton,
  StyledDialogTitle,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { InputRowContainer } from '../../components/SmartOrderTerminal/styles'
import { PasteButton } from '@sb/compositions/Addressbook/components/Popups/NewContactPopup'
import { Loading } from '@sb/components'

// const { Text, Title } = Typography;

const Wrapper = styled.div`
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 24px;
  margin-bottom: 24px;
`

const StyledPasteButton = styled(PasteButton)`
  bottom: 1rem;
  padding: 1rem;
`

const Text = styled.span`
  font-size: 1.5rem;
  padding-bottom: ${(props) => props.paddingBottom};
  text-transform: none;
  color: ${(props) =>
    props.type === 'danger'
      ? '#E04D6B'
      : props.type === 'warning'
      ? '#f4d413'
      : '#ecf0f3'};
`

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 100rem;
`

const Input = styled.input`
  width: 100%;
  height: ${(props) => props.height || '5rem'};
  margin-bottom: 1rem;
  background: ${(props) =>
    props.disabled
      ? props.theme.palette.grey.disabledInput
      : props.theme.palette.grey.input};
  border: ${(props) => `0.1rem solid ${props.theme.palette.text.white}`};
  border-radius: 0.4rem;
  padding-left: 1rem;
  color: ${(props) => props.theme.palette.text.light};

  &::placeholder {
    color: #abbad1;
    font-weight: normal;
  }
`
const StyledInput = styled(Input)`
  font-weight: bold;
`

export interface MintInfo {
  address: PublicKey
  decimals: number
}

export function useMintInput({
  title,
  theme,
}): [ReactElement, MintInfo | null] {
  const [address, setAddress] = useState('')
  const [accountInfo, loaded] = useAccountInfo(
    isValidPublicKey(address) ? new PublicKey(address) : null
  )

  const { validateStatus, hasFeedback, help, mintInfo } = useMemo(() => {
    let validateStatus = ''
    let hasFeedback = false
    let help: string | null = null
    let mintInfo: MintInfo | null = null
    if (address) {
      hasFeedback = true
      if (accountInfo) {
        if (
          accountInfo.owner.equals(TokenInstructions.TOKEN_PROGRAM_ID) &&
          accountInfo.data.length === 82
        ) {
          let parsed = parseTokenMintData(accountInfo.data)
          if (parsed.initialized) {
            validateStatus = 'success'
            mintInfo = {
              address: new PublicKey(address),
              decimals: parsed.decimals,
            }
          } else {
            validateStatus = 'error'
            help = 'Invalid SPL mint'
          }
        } else {
          validateStatus = 'error'
          help = 'Invalid SPL mint address'
        }
      } else if (isValidPublicKey(address) && !loaded) {
        validateStatus = 'validating'
      } else {
        validateStatus = 'error'
        help = 'Invalid Solana address'
      }
    }
    return { validateStatus, hasFeedback, help, mintInfo }
  }, [address, accountInfo, loaded])

  const input = (
    <>
      <FormInputContainer theme={theme} padding={'1.2rem 0 0 0'} title={title}>
        <StyledInput
          theme={theme}
          height={'4rem'}
          value={address}
          onChange={(e) => setAddress(e.target.value.trim())}
          type="text"
          min="0"
          step="any"
          style={{ paddingRight: '10rem' }}
        />
        <StyledPasteButton
          key={title}
          theme={theme}
          style={{ bottom: '1rem' }}
          onClick={() => {
            navigator.clipboard
              .readText()
              .then((clipText) => setAddress(clipText))
          }}
        >
          Paste
        </StyledPasteButton>
      </FormInputContainer>
      {validateStatus === 'error' && (
        <InputRowContainer>
          <Text type={'danger'}>{help}</Text>
        </InputRowContainer>
      )}
    </>
  )

  return [input, mintInfo]
}

export default function ListNewMarketPopup({ theme, open, onClose }) {
  const connection = useConnection()
  const { wallet, connected } = useWallet()
  const [lotSize, setLotSize] = useState('1')
  const [tickSize, setTickSize] = useState('0.01')
  const dexProgramId = MARKETS.find(({ deprecated }) => !deprecated).programId
  const [submitting, setSubmitting] = useState(false)

  const [listedMarket, setListedMarket] = useState(null)

  const [baseMintInput, baseMintInfo] = useMintInput({
    title:
      'Base Token Mint Address (e.g. BTC solana address: 9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E)',
    theme,
  })
  const [quoteMintInput, quoteMintInfo] = useMintInput({
    title:
      'Quote Token Mint Address (e.g. USDT solana address: BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4)',
    theme,
  })

  let baseLotSize
  let quoteLotSize
  if (baseMintInfo && parseFloat(lotSize) > 0) {
    baseLotSize = Math.round(10 ** baseMintInfo.decimals * parseFloat(lotSize))
    if (quoteMintInfo && parseFloat(tickSize) > 0) {
      quoteLotSize = Math.round(
        parseFloat(lotSize) *
          10 ** quoteMintInfo.decimals *
          parseFloat(tickSize)
      )
    }
  }

  const canSubmit =
    connected &&
    !!baseMintInfo &&
    !!quoteMintInfo &&
    !!baseLotSize &&
    !!quoteLotSize

  async function onSubmit() {
    if (!canSubmit) {
      return
    }
    setSubmitting(true)
    try {
      const marketAddress = await listMarket({
        connection,
        wallet,
        baseMint: baseMintInfo.address,
        quoteMint: quoteMintInfo.address,
        baseLotSize,
        quoteLotSize,
        dexProgramId,
      })

      await setListedMarket(marketAddress)
    } catch (e) {
      console.warn(e)
      console.log('e.message', e.message)
      notify({
        message: 'Error listing new market',
        description: e.message,
        type: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      style={{ width: '100rem', margin: 'auto' }}
      fullScreen={false}
      onClose={onClose}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <StyledDialogTitle
        disableTypography
        theme={theme}
        style={{
          justifyContent: 'space-between',
          background: theme.palette.grey.input,
          borderBottom: `.1rem solid ${theme.palette.text.white}`,
        }}
      >
        <Text
          theme={theme}
          style={{
            fontSize: '1.8rem',
            color: theme.palette.text.light,
            fontFamily: 'Avenir Next Demi',
          }}
        >
          Create new market
        </Text>
        <ClearButton theme={theme}>
          <Clear
            theme={theme}
            style={{ fontSize: '2rem' }}
            color="inherit"
            onClick={onClose}
          />
        </ClearButton>
      </StyledDialogTitle>
      <StyledDialogContent
        style={{ background: theme.palette.grey.input }}
        theme={theme}
        id="share-dialog-content"
      >
        <Wrapper theme={theme}>
          <div>
            <div>
              {baseMintInput}
              {quoteMintInput}

              <InputRowContainer theme={theme}>
                <InputRowContainer
                  style={{ marginRight: '1rem' }}
                  width={'calc(50% - 1rem)'}
                  theme={theme}
                >
                  <FormInputContainer
                    theme={theme}
                    padding={'1.2rem 0 0 0'}
                    title={`Minimum Order Size (Lot size in e.g. BTC)`}
                  >
                    <StyledInput
                      theme={theme}
                      height={'4rem'}
                      value={lotSize}
                      onChange={(e) => setLotSize(e.target.value.trim())}
                      type="number"
                      min="0"
                      step="any"
                    />
                  </FormInputContainer>
                </InputRowContainer>

                <InputRowContainer
                  theme={theme}
                  style={{ marginLeft: '1rem' }}
                  width={'calc(50% - 1rem)'}
                >
                  <FormInputContainer
                    theme={theme}
                    padding={'1.2rem 0 00'}
                    title={`Tick Size (Price increment in e.g. USDT)`}
                  >
                    <StyledInput
                      theme={theme}
                      height={'4rem'}
                      value={tickSize}
                      onChange={(e) => setTickSize(e.target.value.trim())}
                      type="number"
                      min="0"
                      step="any"
                    />
                  </FormInputContainer>
                </InputRowContainer>
              </InputRowContainer>

              <InputRowContainer theme={theme} align={'flex-start'}>
                <PurpleButton
                  theme={theme}
                  disabled={!canSubmit}
                  text={connected ? 'Submit' : 'Not connected to wallet'}
                  width={connected ? '12rem' : '25rem'}
                  height={'4rem'}
                  margin={'0 0 0 0'}
                  onClick={onSubmit}
                  showLoader={submitting}
                />
                <InputRowContainer
                  theme={theme}
                  width={
                    connected ? 'calc(100% - 13rem)' : 'calc(100% - 26rem)'
                  }
                  style={{ marginLeft: '1rem' }}
                >
                  <StyledInput
                    theme={theme}
                    height={'4rem'}
                    value={listedMarket ? listedMarket.toBase58() : ''}
                    type="text"
                    min="0"
                    step="any"
                    disabled={true}
                    placeholder={'Here will appear new market ID'}
                    style={{ paddingRight: '8rem' }}
                  />
                  {listedMarket && (
                    <StyledPasteButton
                      theme={theme}
                      style={{ bottom: '1.5rem', outline: 'none' }}
                      onClick={() => {
                        copy(listedMarket.toBase58())
                        notify({ message: 'Copied!', type: 'success' })
                      }}
                    >
                      Copy
                    </StyledPasteButton>
                  )}
                </InputRowContainer>
              </InputRowContainer>
              <InputRowContainer theme={theme} justify={'center'}>
                <PurpleButton
                  theme={theme}
                  text={'Close'}
                  onClick={onClose}
                  width={'12rem'}
                  height={'4rem'}
                  margin={connected ? '0' : '0 1rem 0 0'}
                />
                {!connected && (
                  <PurpleButton
                    theme={theme}
                    text={'Connect wallet'}
                    onClick={wallet.connect}
                    width={'20rem'}
                    height={'4rem'}
                    margin={'0 0 0 1rem'}
                  />
                )}
              </InputRowContainer>
            </div>
          </div>
        </Wrapper>
      </StyledDialogContent>
    </DialogWrapper>
  )
}
