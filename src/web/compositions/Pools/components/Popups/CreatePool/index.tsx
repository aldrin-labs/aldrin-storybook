import React, { useState } from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Paper, Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader } from '../index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { InputWithSelector } from '../components'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { SelectCoinPopup } from '../SelectCoin'
import { createTokenSwap } from '@sb/dexUtils/pools'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { PublicKey } from '@solana/web3.js'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem;
  width: 55rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
`

export const CreatePoolPopup = ({
  theme,
  open,
  close,
}: {
  theme: Theme
  open: boolean
  close: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [baseTokenAddress, setBaseTokenAddress] = useState<string>('')
  const [baseAmount, setBaseAmount] = useState<string | number>('')

  const [quoteTokenAddress, setQuoteTokenAddress] = useState<string>('')
  const [quoteAmount, setQuoteAmount] = useState<string | number>('')

  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)
  const [isBaseTokenSelecting, setIsBaseTokenSelecting] = useState(false)

  const [warningChecked, setWarningChecked] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)

  const isDisabled =
    !warningChecked || +baseAmount <= 0 || +quoteAmount <= 0 || operationLoading

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify={'space-between'}>
        <BoldHeader>Create Pool</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer margin={'2rem 0'} justify={'space-between'}>
        <Text color={theme.palette.grey.title}>Market Price:</Text>
        <Text
          fontSize={'2rem'}
          color={'#A5E898'}
          fontFamily={'Avenir Next Demi'}
        >
          1 CCAI = 20 USDT
        </Text>
      </RowContainer>
      <RowContainer>
        <InputWithSelector
          theme={theme}
          value={baseAmount}
          onChange={setBaseAmount}
          symbol={getTokenNameByMintAddress(baseTokenAddress)}
          maxBalance={baseTokenAddress ? 2000 : 0}
          openSelectCoinPopup={() => {
            setIsBaseTokenSelecting(true)
            setIsSelectCoinPopupOpen(true)
          }}
        />
        <Row>
          <Text fontSize={'4rem'} fontFamily={'Avenir Next Medium'}>
            +
          </Text>
        </Row>
        <InputWithSelector
          theme={theme}
          value={quoteAmount}
          onChange={setQuoteAmount}
          symbol={getTokenNameByMintAddress(quoteTokenAddress)}
          maxBalance={quoteTokenAddress ? 2000 : 0}
          openSelectCoinPopup={() => {
            setIsBaseTokenSelecting(false)
            setIsSelectCoinPopupOpen(true)
          }}
        />
      </RowContainer>
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Row
          width={'60%'}
          justify="space-between"
          wrap={'nowrap'}
          padding={'0 2rem 0 0'}
        >
          <SCheckbox
            id={'warning_checkbox'}
            style={{ padding: 0, marginRight: '1rem' }}
            onChange={() => setWarningChecked(!warningChecked)}
            checked={warningChecked}
          />
          <label htmlFor={'warning_checkbox'}>
            <WhiteText
              style={{
                cursor: 'pointer',
                color: '#F2ABB1',
                fontSize: '1.12rem',
                fontFamily: 'Avenir Next Medium',
                letterSpacing: '0.01rem',
              }}
            >
              I understand the risks of providing liquidity, and that I could
              lose money to impermanent loss.
            </WhiteText>
          </label>
        </Row>
        <BlueButton
          style={{ width: '40%', fontFamily: 'Avenir Next Medium' }}
          disabled={isDisabled}
          isUserConfident={true}
          theme={theme}
          onClick={async () => {
            console.log('create pool')
            await setOperationLoading(true)
            try {
              await createTokenSwap({
                wallet,
                connection,
                mintA: new PublicKey(
                  '8jZjXuaNA3uBcAax77hnjyhaZwkssV2VNoMNW5JYcDaL'
                ),
                mintB: new PublicKey(
                  '5FDj4Hk6iHbv5hxzqRs9zT6L7Hbu347HLpYyf1zZkFxq'
                ),
                userAmountTokenA: 100000,
                userAmountTokenB: 100000,
                userTokenAccountA: new PublicKey(
                  'C5qDUKtsQmUZ6QPDojp5pygoEwmaKg3XGuPCSbCswVM4'
                ),
                userTokenAccountB: new PublicKey(
                  '6CLDZwFGXRxwAdjG9hvmPGfUKMQKy3EjQBt4YitGSaq1'
                ),
              })
            } catch (e) {
              console.error('createTokenSwap error:', e)
            }
            await setOperationLoading(false)
          }}
        >
          Create pool
        </BlueButton>
      </RowContainer>
      <SelectCoinPopup
        theme={theme}
        open={isSelectCoinPopupOpen}
        selectTokenAddress={(address: string) => {
          const select = isBaseTokenSelecting
            ? () => {
                setBaseTokenAddress(address)
                setIsSelectCoinPopupOpen(false)
              }
            : () => {
                setQuoteTokenAddress(address)
                setIsSelectCoinPopupOpen(false)
              }

          select()
        }}
        close={() => setIsSelectCoinPopupOpen(false)}
      />
    </DialogWrapper>
  )
}
