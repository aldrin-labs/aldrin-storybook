import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import { compose } from 'recompose'
import { Paper } from '@material-ui/core'

import { notify } from '@sb/dexUtils//notifications'
import {
  useBalanceInfo,
  useWallet,
} from '@sb/dexUtils/wallet'

import {
  StyledDialogContent,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { withPublicKey } from '@core/hoc/withPublicKey'
import {
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedQuoteCurrencyAccount,
} from '@sb/dexUtils/markets'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import clipboardCopy from 'clipboard-copy'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { useConnection } from '@sb/dexUtils/connection'
import { Theme } from '@material-ui/core'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 75rem;
`

export const VioletButton = styled((props) => (
  <BtnCustom
    btnWidth={props.width || 'calc(50% - .5rem)'}
    fontSize={'1.4rem'}
    height={'4.5rem'}
    textTransform={'capitalize'}
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
    borderRadius={'1rem'}
    border={props.border || 'none'}
    {...props}
  />
))`
  outline: none;
`

export const WhiteButton = styled((props) => (
  <BtnCustom
    btnWidth={props.width || 'calc(50% - .5rem)'}
    fontSize={'1.4rem'}
    height={'4.5rem'}
    textTransform={'capitalize'}
    backgroundColor={props.background || 'transparent'}
    borderColor={props.background || props.theme.palette.white.main}
    btnColor={props.color || props.theme.palette.white.main}
    borderRadius={'1rem'}
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

const TokenNotAddedDialog = ({
  open,
  pair,
  onClose,
  theme,
}: {
  theme: Theme,
  open: boolean,
  pair: string[],
  onClose: () => void
}) => {
  const { market } = useMarket()
  const { wallet, providerUrl } = useWallet()
  const connection = useConnection()
  const isBaseCoinExistsInWallet = useSelectedBaseCurrencyAccount()
  const isQuoteCoinExistsInWallet = useSelectedQuoteCurrencyAccount()
  const balanceInfo = useBalanceInfo(wallet.publicKey)
  const isBothNotAdded = !isBaseCoinExistsInWallet && !isQuoteCoinExistsInWallet

  let { amount, decimals } = balanceInfo || {
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
  const cost =
    (wallet.tokenAccountCost / LAMPORTS_PER_SOL || 0.002039) *
    (isBothNotAdded ? 2 : 1)

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      style={{ width: '85rem', margin: 'auto' }}
      fullScreen={false}
      onClose={onClose}
      maxWidth={'md'}
      open={open}
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
              <Text style={{ paddingBottom: '1.5rem' }}>Your SOL Balance:</Text>
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
                  clipboardCopy(
                    !isBaseCoinExistsInWallet
                      ? market?.baseMintAddress
                      : market?.quoteMintAddress
                  )
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
              component="a"
              href={providerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to the Wallet
            </VioletButton>
          </RowContainer>
        </Row>
      </StyledDialogContent>
    </DialogWrapper>
  )
}

export default compose(withRouter, withPublicKey)(TokenNotAddedDialog)
