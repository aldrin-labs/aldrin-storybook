import { useOutsideRef } from '@webhooks/useOutsideRef'
import React, { useEffect, useRef, useState } from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { SelectSeveralAddressesPopup } from '@sb/compositions/Pools/components/Popups/SelectorForSeveralAddresses'
import { getTokenName } from '@sb/dexUtils/markets'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { notEmpty } from '@sb/dexUtils/utils'

import Loop from '@icons/loop.svg'

import {
  SearchInput,
  Container,
  SwapsList,
  SwapItem,
  TokenName,
  NoData,
} from './styles'
import { SearchItem, SwapSearchProps } from './types'

export const SwapSearch: React.FC<SwapSearchProps> = (props) => {
  const {
    tokens,
    topTradingPairs,
    topTradingMints,
    setInputTokenAddressFromSeveral,
    setOutputTokenAddressFromSeveral,
    onSelect,
  } = props

  const [searchValue, setSearchValue] = useState('')
  const [listOpened, setListOpened] = useState(false)
  const [selectedRow, setSelectedRow] = useState<SearchItem | null>(null)
  const [searchItems, setSearchItems] = useState<SearchItem[]>([])
  const [selectedKeyboardSwapOptionIndex, selectKeyboardSwapOptionIndex] =
    useState<number>(0)

  const [
    isSeveralTokenAccountsForInputMint,
    setIsSeveralTokenAccountsForInputMint,
  ] = useState(false)

  const [
    isSeveralTokenAccountsForOutputMint,
    setIsSeveralTokenAccountsForOutputMint,
  ] = useState(false)

  const wrapperRef = useRef(null)
  const tokensMap = useTokenInfos()
  const [userTokensData] = useUserTokenAccounts()

  const onInput = (searchText: string) => {
    setSearchItems(() => {
      const searchTextItems = searchText
        .split(' ')
        .filter((textItem) => !!textItem && textItem.toLowerCase() !== 'to')

      if (searchTextItems.length === 0) {
        return []
      }

      const [firstSearchTextItem] = searchTextItems

      const amountFrom = parseFloat(firstSearchTextItem)

      const symbolsSearchTextItems = searchTextItems.filter(
        (item) => Number.isNaN(parseFloat(item)) // parseFloat return NaN if no number
      )

      let [tokenFromSearch] = symbolsSearchTextItems
      const [_, tokenToSearch] = symbolsSearchTextItems

      if (!tokenFromSearch) {
        const topTradingMint = topTradingMints[0]
        tokenFromSearch = tokensMap.get(topTradingMint)?.symbol || ''
      }

      const tokensWithSymbol = tokens.map((t) => {
        const symbol = getTokenName({
          address: t.mint,
          tokensInfoMap: tokensMap,
        })
        return { ...t, symbol }
      })

      const tokenFromSearchLowerCase =
        tokenFromSearch && tokenFromSearch.toLowerCase()

      const tokensFrom = tokensWithSymbol
        .filter((t) => {
          const symbol = t.symbol.toLowerCase()

          return symbol.includes(tokenFromSearchLowerCase)
        })
        .sort((a, b) => {
          const isBFullMatch =
            b.symbol.toLowerCase() === tokenFromSearchLowerCase

          const isAFullMatch =
            a.symbol.toLowerCase() === tokenFromSearchLowerCase

          if (isBFullMatch) {
            return 1
          }

          if (isAFullMatch) {
            return -1
          }

          return 0
        })

      const tokenFrom = tokensFrom[0]

      if (!tokenFrom) {
        return []
      }

      const tokenToSearchLowerCase =
        tokenToSearch && tokenToSearch.toLowerCase()

      const topSymbolsForSwap = topTradingMints
        .slice(0, 20)
        .map((mint) => tokensMap.get(mint)?.symbol.toLowerCase() || null)
        .filter(notEmpty)
        .filter((topSymbol) => !topSymbol.includes(tokenFromSearchLowerCase))

      const tokensTo = tokensWithSymbol
        .filter((t) => t.mint !== tokenFrom.mint)
        .filter((t) => {
          const symbol = t.symbol.toLowerCase()

          if (tokenToSearchLowerCase) {
            return symbol.includes(tokenToSearchLowerCase)
          }

          return topSymbolsForSwap.includes(symbol)
        })
        .slice(0, 5)

      const swapOptions = tokensTo.map((tokenTo) => ({
        tokenTo,
        tokenFrom,
        amountFrom: Number.isNaN(amountFrom) ? null : amountFrom.toString(),
      }))

      return swapOptions
    })

    setSearchValue(searchText)
    setListOpened(!!searchText)
  }

  const selectRow = (selected: SearchItem) => {
    const { tokenFrom, tokenTo } = selected
    const isSeveralTokenAccountsForSelectedInputMint =
      userTokensData.filter((token) => token.mint === tokenFrom.mint).length > 1

    const isSeveralTokenAccountsForSelectedOutputMint =
      userTokensData.filter((token) => token.mint === tokenTo.mint).length > 1

    onSelect(selected)
    setSelectedRow(selected)

    setIsSeveralTokenAccountsForInputMint(
      isSeveralTokenAccountsForSelectedInputMint
    )
    setIsSeveralTokenAccountsForOutputMint(
      isSeveralTokenAccountsForSelectedOutputMint
    )

    setListOpened(false)
  }

  const swapOptions =
    searchValue !== ''
      ? searchItems
      : topTradingPairs.slice(0, 5).map((pair) => ({
          amountFrom: null,
          tokenFrom: {
            symbol: pair.baseSymbol,
            mint: pair.baseMint,
          },
          tokenTo: {
            symbol: pair.quoteSymbol,
            mint: pair.quoteMint,
          },
        }))

  useOutsideRef({
    ref: wrapperRef,
    callback: () => {
      setListOpened(false)
    },
  })

  useEffect(() => {
    const onKeyDown = (event: any) => {
      switch (event.key) {
        case 'ArrowUp': {
          const newIndex =
            selectedKeyboardSwapOptionIndex - 1 < 0
              ? swapOptions.length - 1
              : selectedKeyboardSwapOptionIndex - 1

          selectKeyboardSwapOptionIndex(newIndex)
          break
        }
        case 'ArrowDown': {
          const newIndex =
            selectedKeyboardSwapOptionIndex + 1 > swapOptions.length - 1
              ? 0
              : selectedKeyboardSwapOptionIndex + 1

          selectKeyboardSwapOptionIndex(newIndex)
          break
        }
        case 'Enter':
          selectRow(swapOptions[selectedKeyboardSwapOptionIndex])
          break
        default:
          break
      }
    }

    if (listOpened) {
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }

    return () => {}
  }, [selectedKeyboardSwapOptionIndex, listOpened])

  return (
    <Container listOpened={listOpened} ref={wrapperRef}>
      <SearchInput
        name="search"
        placeholder={'Try: "10 SOL to RIN"'}
        value={searchValue}
        onChange={onInput}
        onFocus={() => {
          setListOpened(true)
        }}
        append={<SvgIcon src={Loop} height="1.6rem" width="1.6rem" />}
        borderRadius="md"
        className="inputWrapper"
      />

      {listOpened && (
        <SwapsList>
          {swapOptions.map((option, index) => {
            const { tokenFrom, tokenTo, amountFrom } = option

            const { name: baseTokenName, symbol: baseTokenSymbol } =
              tokensMap.get(tokenFrom.mint) || {
                name: '',
                symbol: '',
              }

            const { name: quoteTokenName, symbol: quoteTokenSymbol } =
              tokensMap.get(tokenTo.mint) || {
                name: '',
                symbol: '',
              }

            const isOptionSelectedFromKeyboard =
              index === selectedKeyboardSwapOptionIndex

            return (
              <SwapItem
                className={isOptionSelectedFromKeyboard ? 'focused' : ''}
                onClick={() => selectRow(option)}
                key={`search_item_${tokenFrom.mint}_${tokenTo.mint}`}
              >
                <Row>
                  <TokenIcon mint={tokenFrom.mint} size={24} />{' '}
                  <TokenIcon mint={tokenTo.mint} size={24} />{' '}
                </Row>
                <Row direction="column" align="flex-start" margin="0 0 0 1em">
                  <InlineText weight={600}>
                    {amountFrom !== null && `${amountFrom} `}
                    <TokenName color="white">{baseTokenSymbol}</TokenName>{' '}
                    {`- `}
                    <TokenName color="white">{quoteTokenSymbol}</TokenName>
                  </InlineText>
                  <InlineText size="sm" weight={400}>
                    <TokenName color="white1">{baseTokenName}</TokenName> {`- `}
                    <TokenName color="white1">{quoteTokenName}</TokenName>
                  </InlineText>
                </Row>
              </SwapItem>
            )
          })}
          {swapOptions.length === 0 && (
            <NoData>
              <InlineText>
                That doesn&apos;t look like a supported swap!
              </InlineText>
            </NoData>
          )}
        </SwapsList>
      )}
      <SelectSeveralAddressesPopup
        tokens={userTokensData.filter(
          (el) => el.mint === selectedRow?.tokenFrom.mint
        )}
        open={isSeveralTokenAccountsForInputMint}
        close={() => setIsSeveralTokenAccountsForInputMint(false)}
        selectTokenMintAddress={() => {}}
        selectTokenAddressFromSeveral={setInputTokenAddressFromSeveral}
      />
      <SelectSeveralAddressesPopup
        tokens={userTokensData.filter(
          (el) => el.mint === selectedRow?.tokenTo.mint
        )}
        open={isSeveralTokenAccountsForOutputMint}
        close={() => setIsSeveralTokenAccountsForOutputMint(false)}
        selectTokenMintAddress={() => {}}
        selectTokenAddressFromSeveral={setOutputTokenAddressFromSeveral}
      />
    </Container>
  )
}
