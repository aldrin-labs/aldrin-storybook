import React, { useState } from 'react'

import SvgIcon from '@sb/components/SvgIcon'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import Loop from '@icons/loop.svg'

import { getTokenNameByMintAddress } from '../../dexUtils/markets'
import { BlockContent } from '../Block'
import { Modal } from '../Modal'
import { TokenIconWithName } from '../TokenIcon'
import { Balance, SearchInput, TokenModalRow, IconContainer } from './styles'

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

  const tokensWithName = tokens
    .map((t) => ({ ...t, name: getTokenNameByMintAddress(t.mint) }))
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Modal backdrop="dark" onClose={onClose} open title="Select Token">
      <BlockContent>
        <SearchInput
          name="token_search"
          append={
            <IconContainer>
              <SvgIcon src={Loop} height="1.6rem" width="1.6rem" />
            </IconContainer>
          }
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
            <TokenIconWithName mint={t.mint} />
            {t.balance !== undefined && (
              <Balance>{stripByAmountAndFormat(t.balance)}</Balance>
            )}
          </TokenModalRow>
        ))}
        {tokensWithName.length === 0 && <TokenModalRow>No data</TokenModalRow>}
      </BlockContent>
    </Modal>
  )
}
