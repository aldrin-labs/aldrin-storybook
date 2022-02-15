import React, { useState } from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
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

  const onInput = (value: string) => {
    setSearchItems(() => {
      const groups = value.split(' ').filter((_) => !!_ && _ !== 'to')

      if (groups.length === 0) {
        return []
      }

      const amountFrom = parseFloat(groups[0])
      const groupWithoutAmount = groups[0].replace(`${amountFrom}`, '')
      const match1 = groups[0].match(NUM_PATTERN)

      if (!match1) {
        return []
      }

      const tokenFromSearch = (match1[0] ? groups[1] : groupWithoutAmount) || ''
      const match2Idx = match1[0] ? 2 : 1

      const amountTo = parseFloat(groups[match2Idx])
      const groupWithoutAmount2 = (groups[match2Idx] || '').replace(
        `${amountTo}`,
        ''
      )
      const match2 = (groups[match2Idx] || '').match(NUM_PATTERN)

      if (!match2) {
        return []
      }
      const tokenToSearch =
        (match2[0] ? groups[match2Idx + 1] : groupWithoutAmount2) || ''

      // console.log(
      //   'matches: ',
      //   groups,
      //   match2Idx,
      //   amountFrom,
      //   tokenFromSearch,
      //   amountTo,
      //   tokenToSearch
      // )
      // return []

      if ((amountFrom && amountTo) || !tokenFromSearch) {
        return []
      }

      const tokensWithSymbol = tokens.map((t) => {
        const symbol = (
          tokensMap.get(t.mint)?.symbol || getTokenNameByMintAddress(t.mint)
        ).toLowerCase()
        return { ...t, symbol }
      })

      const tokenFrom = tokensWithSymbol.find((t) =>
        t.symbol.includes(tokenFromSearch.toLowerCase())
      )

      if (!tokenFrom) {
        return []
      }
      const tokensTo = tokensWithSymbol
        .filter((t) => t.mint !== tokenFrom.mint)
        .filter((t) =>
          tokenToSearch ? t.symbol.includes(tokenToSearch.toLowerCase()) : true
        )
        .slice(0, 2)

      const searchItems = tokensTo.map((tokenTo) => ({
        tokenTo,
        tokenFrom,
        amountFrom: Number.isNaN(amountFrom)
          ? undefined
          : amountFrom.toString(),
        amountTo: Number.isNaN(amountTo) ? undefined : amountTo.toString(),
      }))

      return searchItems
    })

    setSearchValue(value)
    setListOpened(!!value)
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
              color="primaryWhite"
              onClick={() =>
                selectRow({ tokenFrom, tokenTo, amountFrom, amountTo })
              }
              key={`search_item_${tokenFrom.mint}_${tokenTo.mint}_${tokenFrom.account}_${tokenTo.account}`}
            >
              <TokenIcon mint={tokenFrom.mint} height="24px" />
              &nbsp;
              <TokenIcon mint={tokenTo.mint} height="24px" />
              &nbsp;
              <InlineText color="primaryWhite">
                {amountFrom}&nbsp;
                <TokenName>{tokenFrom.symbol}</TokenName>
                &nbsp; to {amountTo}
                &nbsp;
                <TokenName>{tokenTo.symbol}</TokenName>
              </InlineText>
            </SwapItem>
          ))}
          {searchItems.length === 0 && (
            <NoData>
              <InlineText color="primaryWhite">No swaps found :(</InlineText>
            </NoData>
          )}
        </SwapsList>
      )}
    </Container>
  )
}
