import React, { useState } from 'react'
import { DefaultTheme } from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { EscapeButton } from '@sb/components/EscapeButton'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { SelectSeveralAddressesPopup } from '@sb/compositions/Pools/components/Popups/SelectorForSeveralAddresses'
import { SearchInputWithLoop } from '@sb/compositions/Pools/components/Tables/components'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { useWallet } from '@sb/dexUtils/wallet'

import { stripByAmount } from '@core/utils/chartPageUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import {
  SelectorRow,
  StyledText,
  TokenButton,
  TokenButtonText,
  UpdatedPaper,
} from './styles'

export const SelectCoinPopup = ({
  theme,
  open,
  mints,
  topTradingMints,
  allTokensData,
  pricesMap,
  isBaseTokenSelecting,
  close,
  selectTokenMintAddress,
  setBaseTokenAddressFromSeveral,
  setQuoteTokenAddressFromSeveral,
}: {
  theme: DefaultTheme
  open: boolean
  mints: string[]
  topTradingMints: string[]
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

  const [searchValue, onChangeSearch] = useState<string>('')
  const [selectedMint, setSelectedMint] = useState<string>('')
  const [
    isSelectorForSeveralAddressesOpen,
    setIsSelectorForSeveralAddressesOpen,
  ] = useState(false)

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
    ? mints.filter((mint) => {
        const { symbol, name } = tokenInfos.get(mint) || {
          symbol: getTokenNameByMintAddress(mint),
          name: '',
        }

        const searchValueLowerCase = searchValue.toLowerCase()

        return (
          symbol.toLowerCase().includes(searchValueLowerCase) ||
          name.toLowerCase().includes(searchValueLowerCase) ||
          mint.includes(searchValueLowerCase)
        )
      })
    : mints

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

  const selectMint = (mint: string) => {
    const isSeveralCoinsWithSameAddress =
      allTokensData.filter((el) => el.mint === mint).length > 1

    if (isSeveralCoinsWithSameAddress) {
      setSelectedMint(mint)
      setIsSelectorForSeveralAddressesOpen(true)
    } else {
      selectTokenMintAddress(mint)
    }
  }

  return (
    <DialogWrapper
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
      <RowContainer>
        <RowContainer padding="1.5em 0 0 0">
          <SearchInputWithLoop
            searchValue={searchValue}
            onChangeSearch={onChangeSearch}
            placeholder="Search token or paste address"
            width="calc(100% - 4em)"
          />
          <Row margin="0 0 0 1em">
            <EscapeButton close={close} />
          </Row>
        </RowContainer>
        <RowContainer justify="flex-start" padding="0.8em 0">
          {/* top-8 tokens */}
          {topTradingMints.slice(0, 8).map((mint) => (
            <TokenButton onClick={() => selectMint(mint)}>
              <TokenIcon
                mint={mint}
                width="1.5em"
                height="1.5em"
                margin="0 0.5em 0 0"
              />
              <TokenButtonText>{tokenInfos.get(mint)?.symbol}</TokenButtonText>
            </TokenButton>
          ))}
        </RowContainer>
        <RowContainer>
          {sortedMints.map(({ mint, amount, name, symbol, total }) => {
            return (
              <SelectorRow
                justify="space-between"
                style={{ cursor: 'pointer' }}
                onClick={() => selectMint(mint)}
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
                      <Row padding="0.5em 0 0 0">
                        <InlineText>{name}</InlineText>
                      </Row>
                    )}
                  </Row>
                </Row>
                {connected && (
                  <Row direction="column" align="flex-end" wrap="nowrap">
                    <InlineText color="white" weight={600}>
                      ${formatNumberToUSFormat(stripDigitPlaces(total, 2))}
                    </InlineText>
                    <Row padding="0.5em 0 0 0">
                      <InlineText color="gray1">
                        {formatNumberToUSFormat(stripByAmount(amount))} {symbol}
                      </InlineText>
                    </Row>
                  </Row>
                )}
              </SelectorRow>
            )
          })}
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
      </RowContainer>
    </DialogWrapper>
  )
}
