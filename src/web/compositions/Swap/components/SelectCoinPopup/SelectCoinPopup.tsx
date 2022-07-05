import { FONTS } from '@variables/variables'
import React, { useEffect, useState } from 'react'
import { DefaultTheme } from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
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

import { SelectorRow, StyledText, UpdatedPaper } from './styles'

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
  theme: DefaultTheme
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
  const { connected } = useWallet()

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

  useEffect(() => {
    const closePopup = (e) => {
      if (e.code === 'Escape') {
        close()
      }
    }
    window.addEventListener('keydown', closePopup)
    return () => window.removeEventListener('keydown', closePopup)
  }, [])

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
        {sortedMints.map(({ mint, amount, name, symbol, total }) => {
          return (
            <SelectorRow
              key={mint}
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
                <TokenIcon mint={mint} size={32} />
                <Row margin="0 0 0 0.5em" align="flex-start" direction="column">
                  <StyledText>{symbol}</StyledText>
                  {name && <Text padding="0.5em 0 0 0">{name}</Text>}
                </Row>
              </Row>
              {connected && (
                <Row direction="column" align="flex-end" wrap="nowrap">
                  <Text fontFamily={FONTS.demi}>
                    ${formatNumberToUSFormat(stripDigitPlaces(total, 2))}
                  </Text>
                  <Text color="green3" padding="0.5em 0 0 0">
                    {formatNumberToUSFormat(stripByAmount(amount))} {symbol}
                  </Text>
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
    </DialogWrapper>
  )
}
