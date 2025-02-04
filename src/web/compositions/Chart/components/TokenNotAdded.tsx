import { Paper } from '@material-ui/core'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import clipboardCopy from 'clipboard-copy'
import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { compose } from 'recompose'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { StyledDialogContent } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { notify } from '@sb/dexUtils//notifications'
import { useConnection } from '@sb/dexUtils/connection'
import {
  getTokenNameByMintAddress,
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedQuoteCurrencyAccount,
} from '@sb/dexUtils/markets'
import {
  createAssociatedTokenAccount,
  useBalanceInfo,
  useWallet,
} from '@sb/dexUtils/wallet'
import { withPublicKey } from '@sb/hoc/withPublicKey'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import greenDoneMark from '@icons/greenDoneMark.svg'

import { BlueButton } from '../Inputs/SelectWrapper/SelectWrapperStyles'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 75rem;
`

export const VioletButton = styled((props) => (
  <BtnCustom
    btnWidth={props.width || 'calc(50% - .5rem)'}
    fontSize="1.4rem"
    height="4.5rem"
    textTransform="capitalize"
    backgroundColor={
      props.disabled
        ? props.theme.palette.grey.dark
        : props.background || props.theme.palette.blue.serum
    }
    borderColor={
      props.disabled
        ? props.theme.palette.grey.dark
        : props.background || props.theme.palette.blue.serum
    }
    btnColor={props.color || props.theme.palette.white.main}
    borderRadius="1rem"
    border={props.border || 'none'}
    {...props}
  />
))`
  outline: none;
`

export const WhiteButton = styled((props) => (
  <BtnCustom
    btnWidth={props.width || 'calc(50% - .5rem)'}
    fontSize="1.4rem"
    height="4.5rem"
    textTransform="capitalize"
    backgroundColor={props.background || 'transparent'}
    borderColor={props.background || props.theme.palette.white.main}
    btnColor={props.color || props.theme.palette.white.main}
    borderRadius="1rem"
    border={props.border || 'none'}
    {...props}
  />
))`
  outline: none;
`

export const Text = styled.span`
  font-size: 1.5rem;
  font-family: Avenir Next Demi;
  padding-bottom: ${(props) => props.paddingBottom};
  text-transform: none;
  color: ${(props) =>
    props.type === 'danger'
      ? '#E04D6B'
      : props.type === 'warning'
      ? '#f4d413'
      : '#ecf0f3'};
`

const TokenNotAddedDialog = ({ open, pair, onClose, theme }) => {
  const { market } = useMarket()
  const { wallet, providerUrl } = useWallet()
  const [isTokenSuccessfullyAdded, setIsTokenSuccessfullyAdded] =
    useState(false)
  const [tokenName, setTokenName] = useState('')
  const connection = useConnection()
  const isBaseCoinExistsInWallet = useSelectedBaseCurrencyAccount()
  const isQuoteCoinExistsInWallet = useSelectedQuoteCurrencyAccount()
  const balanceInfo = useBalanceInfo(wallet.publicKey)
  const isBothNotAdded = !isBaseCoinExistsInWallet && !isQuoteCoinExistsInWallet

  const { amount, decimals } = balanceInfo || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
  }

  const displayName = isBothNotAdded
    ? `${pair[0]} and ${pair[1]}`
    : !isBaseCoinExistsInWallet
    ? pair[0]
    : pair[1]

  const SOLAmount = amount / Math.pow(10, decimals)
  const cost = wallet.tokenAccountCost / LAMPORTS_PER_SOL || 0.002039

  const mint = !isBaseCoinExistsInWallet
    ? market?.baseMintAddress
    : market?.quoteMintAddress

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      style={{ width: '85rem', margin: 'auto' }}
      fullScreen={false}
      onClose={onClose}
      maxWidth="md"
      open={open}
      onEnter={() => setIsTokenSuccessfullyAdded(false)}
      aria-labelledby="responsive-dialog-title"
    >
      <StyledDialogContent
        style={{
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
          background: theme.palette.grey.input,
        }}
        theme={theme}
        id="share-dialog-content"
      >
        {isTokenSuccessfullyAdded ? (
          <RowContainer padding="0 0 2rem 0">
            <RowContainer margin="2rem 0 5rem 0">
              <SvgIcon src={greenDoneMark} width="10rem" height="auto" />
            </RowContainer>
            <RowContainer margin="0 0 5rem 0">
              <Text>
                {tokenName} token has been successfully added to your wallet.
              </Text>
            </RowContainer>
            <BlueButton
              color="#17181A"
              background="#53DF11"
              onClick={() => onClose()}
            >
              Ok
            </BlueButton>
          </RowContainer>
        ) : (
          <Row width="70%" direction="column" padding="2rem 0">
            <RowContainer direction="column" margin="0 0 6rem 0">
              <Text>
                It seems like you don’t have {displayName} token in your wallet.
              </Text>
              <Text>
                Please create the address for {displayName} to continue trading.
              </Text>
            </RowContainer>
            <RowContainer align="flex-start" justify="space-between">
              <Row align="flex-start" direction="column">
                <Text style={{ paddingBottom: '1.5rem' }}>
                  Your SOL Balance:
                </Text>
                <Text
                  style={{
                    color:
                      SOLAmount < cost
                        ? theme.palette.red.main
                        : theme.palette.green.main,
                    fontSize: '2.4rem',
                    paddingBottom: '1rem',
                  }}
                >
                  {stripDigitPlaces(SOLAmount, 8)} SOL
                </Text>
                <BtnCustom
                  btnWidth="auto"
                  textTransform="capitalize"
                  color={theme.palette.blue.serum}
                  borderWidth="0"
                  fontFamily="Avenir Next Demi"
                  fontSize="1rem"
                  onClick={() => {
                    clipboardCopy(wallet.publicKey)
                    notify({
                      type: 'success',
                      message: 'Copied!',
                    })
                  }}
                >
                  Copy SOL Deposit Address
                </BtnCustom>
              </Row>
              <Row align="flex-start" direction="column">
                <Text style={{ paddingBottom: '1.5rem' }}>
                  Address creation cost:
                </Text>
                <Text
                  style={{
                    color: theme.palette.green.main,
                    fontSize: '2.4rem',
                    paddingBottom: '1rem',
                  }}
                >
                  {stripDigitPlaces(cost, 8)} SOL
                </Text>
                <BtnCustom
                  btnWidth="auto"
                  textTransform="capitalize"
                  color={theme.palette.blue.serum}
                  borderWidth="0"
                  fontFamily="Avenir Next Demi"
                  fontSize="1rem"
                  onClick={() => {
                    clipboardCopy(mint)
                    notify({
                      type: 'success',
                      message: 'Copied!',
                    })
                  }}
                >
                  Copy {!isBaseCoinExistsInWallet ? pair[0] : pair[1]} Mint
                  Address
                </BtnCustom>
              </Row>
            </RowContainer>
            <RowContainer justify="space-between" margin="4rem 0 0rem 0">
              <WhiteButton theme={theme} onClick={onClose}>
                Cancel
              </WhiteButton>
              <VioletButton
                theme={theme}
                onClick={async () => {
                  try {
                    await createAssociatedTokenAccount({
                      wallet,
                      connection,
                      splTokenMintAddress: new PublicKey(mint),
                    })
                  } catch (e) {
                    notify({
                      message: 'Token was not added, please try again',
                      type: 'error',
                    })

                    return
                  }

                  notify({
                    message: 'Token successfully added!',
                    type: 'success',
                  })

                  await setIsTokenSuccessfullyAdded(true)
                  await setTokenName(getTokenNameByMintAddress(mint.toString()))
                }}
              >
                Add to the wallet
              </VioletButton>
            </RowContainer>
          </Row>
        )}
      </StyledDialogContent>
    </DialogWrapper>
  )
}

export default compose(withRouter, withPublicKey)(TokenNotAddedDialog)
