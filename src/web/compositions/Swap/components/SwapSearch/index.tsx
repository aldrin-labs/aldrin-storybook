import React, { useState } from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import Loop from '@icons/loop.svg'

import {
  SearchInput,
  Container,
  SwapsList,
  NoData,
  SwapItem,
  TokenName,
} from './styles'
import { SearchItem, SwapSearchProps } from './types'

const NUM_PATTERN = /\d{0,}\.?\d{0,}$/

export const SwapSearch: React.FC<SwapSearchProps> = (props) => {
  const { tokens, onSelect } = props
  const [searchValue, setSearchValue] = useState('')
  const [listOpened, setListOpened] = useState(false)
  const [searchItems, setSearchItems] = useState<SearchItem[]>([])
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

      const [tokenFromSearch, tokenToSearch] = symbolsSearchTextItems

      if (!tokenFromSearch) {
        return []
      }

      const tokensWithSymbol = tokens.map((t) => {
        const symbol =
          tokensMap.get(t.mint)?.symbol || getTokenNameByMintAddress(t.mint)
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

      const topSymbolsForSwap = ['sol', 'usdc', 'usdt'].filter(
        (topSymbol) => !topSymbol.includes(tokenFromSearchLowerCase)
      )

      const tokensTo = tokensWithSymbol
        .filter((t) => t.mint !== tokenFrom.mint)
        .filter((t) => {
          const symbol = t.symbol.toLowerCase()
          if (tokenToSearchLowerCase) {
            return symbol.includes(tokenToSearchLowerCase)
          }

          return topSymbolsForSwap.includes(symbol)
        })
        .slice(0, 2)

      const searchItems = tokensTo.map((tokenTo) => ({
        tokenTo,
        tokenFrom,
        amountFrom: Number.isNaN(amountFrom)
          ? undefined
          : amountFrom.toString(),
      }))

      return searchItems
    })

    setSearchValue(searchText)
    setListOpened(!!searchText)
  }
  const selectRow = (selected: SearchItem) => {
    onSelect(selected)
    setListOpened(false)
    setSearchValue(
      [
        selected.amountFrom || '',
        selected.tokenFrom.symbol.toUpperCase(),
        'to',
        selected.amountTo || '',
        selected.tokenTo.symbol.toUpperCase(),
      ]
        .filter((_) => !!_)
        .join(' ')
    )
  }

  return (
    <Container>
      <SearchInput
        name="search"
        placeholder={'Try: "10 SOL to RIN"'}
        value={searchValue}
        onChange={onInput}
        append={<SvgIcon src={Loop} height="1.6rem" width="1.6rem" />}
        borderRadius="md"
      />

      {listOpened && (
        <SwapsList>
          {searchItems.map(({ tokenFrom, tokenTo, amountFrom, amountTo }) => (
            <SwapItem
              color="gray0"
              onClick={() =>
                selectRow({ tokenFrom, tokenTo, amountFrom, amountTo })
              }
              key={`search_item_${tokenFrom.mint}_${tokenTo.mint}_${tokenFrom.account}_${tokenTo.account}`}
            >
              <Row>
                <TokenIcon mint={tokenFrom.mint} height="1.5em" />{' '}
                <TokenIcon mint={tokenTo.mint} height="1.5em" />{' '}
              </Row>
              <InlineText weight={600} color="gray0">
                {amountFrom}{' '}
                <TokenName color="gray1">{tokenFrom.symbol}</TokenName> to{' '}
                {amountTo} <TokenName color="gray1">{tokenTo.symbol}</TokenName>
              </InlineText>
            </SwapItem>
          ))}
          {searchItems.length === 0 && (
            <NoData>
              <InlineText color="gray0">No swaps found :(</InlineText>
            </NoData>
          )}
        </SwapsList>
      )}
    </Container>
  )
}
