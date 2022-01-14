import React, { useState } from 'react'

import SvgIcon from '@sb/components/SvgIcon'

import { useTokenPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import Loop from '@icons/loop.svg'

import { getTokenNameByMintAddress } from '../../dexUtils/markets'
import { useTokenInfos } from '../../dexUtils/tokenRegistry'
import { Modal } from '../Modal'
import { TokenIconWithName } from '../TokenIcon'
import { InlineText } from '../Typography'
import {
  BalanceBlock,
  SearchInput,
  TokenModalRow,
  TokenModalContent,
} from './styles'

export interface Token {
  mint: string
  account?: string
  balance?: number
}

interface SelectTokenModalProps {
  tokens: Token[]
  onClose: () => void
  onSelect: (token: Token) => void
}
export const SelectTokenModal: React.FC<SelectTokenModalProps> = (props) => {
  const { onClose, tokens, onSelect } = props

  const [search, setSearch] = useState('')

  const tokenMap = useTokenInfos()
  const { data: tokenPrices } = useTokenPrices()

  const tokensWithName = tokens
    .map((t) => {
      const symbol =
        tokenMap.get(t.mint)?.symbol || getTokenNameByMintAddress(t.mint)

      const price = tokenPrices?.get(symbol.toLowerCase())
      const usdValue = (price?.price || 0) * (t.balance || 0)
      return {
        ...t,
        symbol,
        price,
        usdValue,
      }
    })
    .filter((t) => t.symbol.toLowerCase().includes(search.toLowerCase()))
    .sort((t1, t2) => t2.usdValue - t1.usdValue)

  return (
    <Modal onClose={onClose} open title="Select Token">
      <TokenModalContent>
        <SearchInput
          name="token_search"
          append={<SvgIcon src={Loop} height="1.6rem" width="1.6rem" />}
          value={search}
          onChange={setSearch}
          placeholder="Search"
        />
        {tokensWithName.map((t, idx) => (
          <TokenModalRow
            key={`token_selector_${t.mint}_${t.account || idx}`}
            onClick={() => {
              onSelect(t)
              onClose()
            }}
          >
            <TokenIconWithName size="32px" mint={t.mint}>
              {t.balance !== undefined && (
                <div>
                  <InlineText weight={300} color="success">
                    {stripByAmountAndFormat(t.balance)} {t.symbol}
                  </InlineText>
                </div>
              )}
            </TokenIconWithName>
            <BalanceBlock>
              {t.usdValue > 0 && (
                <div>${stripByAmountAndFormat(t.usdValue)}</div>
              )}
            </BalanceBlock>
          </TokenModalRow>
        ))}
        {tokensWithName.length === 0 && <TokenModalRow>No data</TokenModalRow>}
      </TokenModalContent>
    </Modal>
  )
}
