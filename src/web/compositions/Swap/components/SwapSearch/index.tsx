import { useOutsideRef } from '@webhooks/useOutsideRef'
import React, { useEffect, useRef, useState } from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
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
  const { tokens, topTradingPairs, topTradingMints, onSelect } = props

  const [searchValue, setSearchValue] = useState('')
  const [listOpened, setListOpened] = useState(false)
  const [searchItems, setSearchItems] = useState<SearchItem[]>([])
  const [selectedKeyboardSwapOptionIndex, selectKeyboardSwapOptionIndex] =
    useState(0)

  const wrapperRef = useRef(null)
  const tokensMap = useTokenInfos()

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
        (item) => !parseFloat(item)
      )

      let [tokenFromSearch, tokenToSearch] = symbolsSearchTextItems

      if (!tokenFromSearch) {
        const topTradingMint = topTradingMints[0]
        tokenFromSearch = tokensMap.get(topTradingMint).symbol
      }

      const tokensWithSymbol = tokens
        .map((t) => {
          const symbol = tokensMap.get(t.mint)?.symbol

          if (!symbol) return null

          return { ...t, symbol }
        })
        .filter(notEmpty)

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
        amountFrom: Number.isNaN(amountFrom)
          ? undefined
          : amountFrom.toString(),
      }))

      return swapOptions
    })

    setSearchValue(searchText)
    setListOpened(!!searchText)
  }

  const selectRow = (selected: SearchItem) => {
    onSelect(selected)
    setListOpened(false)
  }

  const swapOptions =
    searchValue !== ''
      ? searchItems
      : topTradingPairs.slice(0, 5).map((pair) => ({
          tokenFrom: {
            symbol: pair.baseSymbol,
            mint: pair.baseMint,
            amountFrom: 0,
          },
          tokenTo: {
            symbol: pair.quoteSymbol,
            mint: pair.quoteMint,
            amountFrom: 0,
          },
        }))

  useOutsideRef({ ref: wrapperRef, callback: () => setListOpened(false) })

  useEffect(() => {
    const onKeyDown = (event) => {
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

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [selectedKeyboardSwapOptionIndex])

  return (
    <Container listOpened={listOpened} ref={wrapperRef}>
      <SearchInput
        name="search"
        placeholder={'Try: "10 SOL to RIN"'}
        value={searchValue}
        onChange={onInput}
        onFocus={() => setListOpened(true)}
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
                $color="gray0"
                className={isOptionSelectedFromKeyboard ? 'focused' : ''}
                onClick={() => selectRow(option)}
                key={`search_item_${tokenFrom.mint}_${tokenTo.mint}`}
              >
                <Row>
                  <TokenIcon mint={tokenFrom.mint} height="1.5em" />{' '}
                  <TokenIcon mint={tokenTo.mint} height="1.5em" />{' '}
                </Row>
                <Row direction="column" align="flex-start" margin="0 0 0 1em">
                  <InlineText weight={600} color="gray0">
                    {amountFrom && `${amountFrom} `}
                    <TokenName color="gray1">{baseTokenSymbol}</TokenName>{' '}
                    {`- `}
                    <TokenName color="gray1">{quoteTokenSymbol}</TokenName>
                  </InlineText>
                  <InlineText size="sm" weight={400} color="gray0">
                    <TokenName color="gray1">{baseTokenName}</TokenName> {`- `}
                    <TokenName color="gray1">{quoteTokenName}</TokenName>
                  </InlineText>
                </Row>
              </SwapItem>
            )
          })}
          {swapOptions.length === 0 && (
            <NoData>
              <InlineText>That doesn't look like a supported swap!</InlineText>
            </NoData>
          )}
        </SwapsList>
      )}
    </Container>
  )
}
