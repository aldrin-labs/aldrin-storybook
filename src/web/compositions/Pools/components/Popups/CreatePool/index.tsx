import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, StyledPaper } from '../index.styles'
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
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'

export const CreatePoolPopup = ({
  theme,
  open,
  allTokensData,
  close,
}: {
  theme: Theme
  open: boolean
  allTokensData: TokenInfo[]
  close: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [baseTokenMintAddress, setBaseTokenMintAddress] = useState<string>('')
  const [baseAmount, setBaseAmount] = useState<string | number>('')

  const [quoteTokenMintAddress, setQuoteTokenMintAddress] = useState<string>('')
  const [quoteAmount, setQuoteAmount] = useState<string | number>('')

  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)
  const [isBaseTokenSelecting, setIsBaseTokenSelecting] = useState(false)

  const [warningChecked, setWarningChecked] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)

  const isDisabled =
    !warningChecked || +baseAmount <= 0 || +quoteAmount <= 0 || operationLoading

  const baseSymbol = baseTokenMintAddress
    ? getTokenNameByMintAddress(baseTokenMintAddress)
    : 'Select token'
  const quoteSymbol = quoteTokenMintAddress
    ? getTokenNameByMintAddress(quoteTokenMintAddress)
    : 'Select token'

  const mints = allTokensData.map((tokenInfo: TokenInfo) => tokenInfo.mint)
  const baseTokenInfo = getTokenDataByMint(allTokensData, baseTokenMintAddress)
  const quoteTokenInfo = getTokenDataByMint(
    allTokensData,
    quoteTokenMintAddress
  )

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
        {baseTokenMintAddress && quoteTokenMintAddress && (
          <Text
            fontSize={'2rem'}
            color={'#A5E898'}
            fontFamily={'Avenir Next Demi'}
          >
            1 {baseSymbol} = 20 {quoteSymbol}
          </Text>
        )}
      </RowContainer>
      <RowContainer>
        <InputWithSelector
          theme={theme}
          value={baseAmount}
          onChange={setBaseAmount}
          symbol={baseSymbol}
          maxBalance={baseTokenInfo?.amount || 0}
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
          symbol={quoteSymbol}
          maxBalance={quoteTokenInfo?.amount || 0}
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
          showLoader={operationLoading}
          theme={theme}
          onClick={async () => {
            const userTokenAccountA = baseTokenInfo?.address
            const userTokenAccountB = quoteTokenInfo?.address

            const baseTokenDecimals = baseTokenInfo?.decimals || 0
            const quoteTokenDecimals = quoteTokenInfo?.decimals || 0

            const userAmountTokenA = +baseAmount * (10 ** baseTokenDecimals)
            const userAmountTokenB = +quoteAmount * (10 ** quoteTokenDecimals)

            if (
              !userTokenAccountA ||
              !userTokenAccountB ||
              !userAmountTokenA ||
              !userAmountTokenB
            )
              return // add notify

            console.log('create pool')
            await setOperationLoading(true)
            try {
              await createTokenSwap({
                wallet,
                connection,
                userAmountTokenA,
                userAmountTokenB,
                mintA: new PublicKey(baseTokenMintAddress),
                mintB: new PublicKey(quoteTokenMintAddress),
                userTokenAccountA: new PublicKey(userTokenAccountA),
                userTokenAccountB: new PublicKey(userTokenAccountB),
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
        mints={mints}
        open={isSelectCoinPopupOpen}
        selectTokenAddress={(address: string) => {
          const select = isBaseTokenSelecting
            ? () => {
                setBaseTokenMintAddress(address)
                setIsSelectCoinPopupOpen(false)
              }
            : () => {
                setQuoteTokenMintAddress(address)
                setIsSelectCoinPopupOpen(false)
              }

          select()
        }}
        close={() => setIsSelectCoinPopupOpen(false)}
      />
    </DialogWrapper>
  )
}
