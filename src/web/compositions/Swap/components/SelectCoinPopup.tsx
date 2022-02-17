import { Theme } from '@material-ui/core'
import { BREAKPOINTS, COLORS, FONTS, FONT_SIZES } from '@variables/variables'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Page } from '@sb/components/Layout'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { StyledPaper } from '@sb/compositions/Pools/components/Popups/index.styles'
import { SearchInputWithLoop } from '@sb/compositions/Pools/components/Tables/components'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import {
  ALL_TOKENS_MINTS_MAP,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { useWallet } from '@sb/dexUtils/wallet'

import { stripByAmount } from '@core/utils/chartPageUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import { SelectSeveralAddressesPopup } from '../../Pools/components/Popups/SelectorForSeveralAddresses'

const UpdatedPaper = styled(({ ...props }) => <StyledPaper {...props} />)`
  font-size: 16px;
  background: #1a1a1a;
  width: 30em;

  @media (max-width: ${BREAKPOINTS.sm}) {
    max-height: 100%;
    margin: 0;
    width: 100%;
  }
`

export const SelectorRow = styled(({ ...props }) => (
  <RowContainer {...props} />
))`
  background: ${COLORS.background};
  border-radius: 1.2rem;
  margin-bottom: 0.8em;
  padding: 1.5em;
`

export const StyledText = styled(({ ...props }) => <Text {...props} />)`
  font-size: ${FONT_SIZES.md};
  font-family: ${FONTS.demi};
`

export const SelectCoinPopup = ({
  theme,
  open,
  mints,
  allTokensData,
  pricesMap,
  isBaseTokenSelecting,
  close,
  selectTokenMintAddress,
  setBaseTokenAddressFromSeveral,
  setQuoteTokenAddressFromSeveral,
}: {
  theme: Theme
  open: boolean
  mints: string[]
  isBaseTokenSelecting: boolean
  allTokensData: TokenInfo[]
  pricesMap: Map<string, number>
  close: () => void
  selectTokenMintAddress: (address: string) => void
  setBaseTokenAddressFromSeveral: (address: string) => void
  setQuoteTokenAddressFromSeveral: (address: string) => void
}) => {
  const tokenInfos = useTokenInfos()
  const { wallet, connected } = useWallet()

  const needKnownMints = false
  const [searchValue, onChangeSearch] = useState<string>('')
  const [selectedMint, setSelectedMint] = useState<string>('')
  const [
    isSelectorForSeveralAddressesOpen,
    setIsSelectorForSeveralAddressesOpen,
  ] = useState(false)

  const usersMints = needKnownMints
    ? mints.filter(
        (el) => getTokenNameByMintAddress(el) === ALL_TOKENS_MINTS_MAP[el]
      )
    : mints

  const sortedAllTokensData = new Map()

  allTokensData.forEach((tokensData) => {
    if (sortedAllTokensData.has(tokensData.mint)) {
      sortedAllTokensData.set(
        tokensData.mint,
        sortedAllTokensData.get(tokensData.mint) + tokensData.amount
      )
    } else {
      sortedAllTokensData.set(tokensData.mint, tokensData.amount)
    }
  })

  const filteredMints = searchValue
    ? usersMints.filter(
        (mint) =>
          getTokenNameByMintAddress(mint)
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          mint.toLowerCase().includes(searchValue.toLowerCase())
      )
    : usersMints

  const sortedMints = filteredMints
    .map((mint) => {
      const { name, symbol } = tokenInfos.get(mint) || {
        name: '',
        symbol: getTokenNameByMintAddress(mint),
      }

      const amount = sortedAllTokensData.get(mint) || 0
      const price = pricesMap.get(getTokenNameByMintAddress(mint)) || 0

      return {
        mint,
        name,
        symbol,
        amount,
        price,
        total: amount * price,
      }
    })
    .filter((token) => !!token.price)
    .sort((a, b) => b.total - a.total)

  useEffect(() => {
    const closePopup = (e) => {
      if (e.keyCode === 27) {
        close()
      }
    }
    window.addEventListener('keydown', closePopup)
    return () => window.removeEventListener('keydown', closePopup)
  }, [])

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={UpdatedPaper}
      fullScreen={false}
      onClose={close}
      maxWidth="md"
      open={open}
      onEnter={() => {
        onChangeSearch('')
        setSelectedMint('')
        setIsSelectorForSeveralAddressesOpen(false)
      }}
      aria-labelledby="responsive-dialog-title"
    >
      <Page $color="blockBlackBackground">
        <RowContainer padding="1.5em 0">
          <SearchInputWithLoop
            searchValue={searchValue}
            onChangeSearch={onChangeSearch}
            placeholder="Search token or paste address"
            width="calc(100% - 4em)"
          />
          <Row
            width="3em"
            height="3em"
            margin="0 0 0 1em"
            onClick={close}
            style={{
              border: '1px solid #383B45',
              borderRadius: '1.2rem',
              cursor: 'pointer',
            }}
          >
            <Text>Esc</Text>
          </Row>
        </RowContainer>
        <RowContainer>
          {sortedMints.map(
            ({
              mint,
              amount,
              price,
              name,
              symbol,
              total,
            }: {
              mint: string
              amount: number
              price: number
              symbol: string
              name: string
              total: number
            }) => {
              return (
                <SelectorRow
                  justify="space-between"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    const isSeveralCoinsWithSameAddress =
                      allTokensData.filter((el) => el.mint === mint).length > 1

                    if (isSeveralCoinsWithSameAddress) {
                      setSelectedMint(mint)
                      setIsSelectorForSeveralAddressesOpen(true)
                    } else {
                      selectTokenMintAddress(mint)
                    }
                  }}
                >
                  <Row wrap="nowrap">
                    <TokenIcon mint={mint} width="3em" height="3em" />
                    <Row
                      margin="0 0 0 0.5em"
                      align="flex-start"
                      direction="column"
                    >
                      <StyledText>{symbol}</StyledText>
                      {name && (
                        <Text
                          color={COLORS.inputPlaceholder}
                          padding="0.5em 0 0 0"
                        >
                          {name}
                        </Text>
                      )}
                    </Row>
                  </Row>
                  {connected && (
                    <Row direction="column" align="flex-end" wrap="nowrap">
                      <Text fontFamily={FONTS.demi}>
                        ${formatNumberToUSFormat(stripDigitPlaces(total, 2))}
                      </Text>
                      <Text color="#2C981E" padding="0.5em 0 0 0">
                        {formatNumberToUSFormat(stripByAmount(amount))} {symbol}
                      </Text>
                    </Row>
                  )}
                </SelectorRow>
              )
            }
          )}
          {mints.length === 0 && (
            <RowContainer>
              <StyledText>Loading...</StyledText>
            </RowContainer>
          )}
          <SelectSeveralAddressesPopup
            theme={theme}
            tokens={allTokensData.filter((el) => el.mint === selectedMint)}
            open={isSelectorForSeveralAddressesOpen}
            close={() => setIsSelectorForSeveralAddressesOpen(false)}
            selectTokenMintAddress={selectTokenMintAddress}
            selectTokenAddressFromSeveral={
              isBaseTokenSelecting
                ? setBaseTokenAddressFromSeveral
                : setQuoteTokenAddressFromSeveral
            }
          />
        </RowContainer>
      </Page>
    </DialogWrapper>
  )
}
