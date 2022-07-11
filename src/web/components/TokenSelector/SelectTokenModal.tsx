import React, { useState } from 'react'

import SvgIcon from '@sb/components/SvgIcon'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import Loop from '@icons/loop.svg'

import { getTokenNameByMintAddress } from '../../dexUtils/markets'
import { BlockContent } from '../Block'
import { Modal } from '../Modal'
import { TokenIconWithName } from '../TokenIcon'
import { Balance, SearchInput, TokenModalRow, IconContainer } from './styles'
import { CloseIcon, ModalTitle, ModalTitleContainer } from '../Modal/styles'
import styled from 'styled-components'

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

export const Test = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px 0px;
`
const Test2 = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px;
  gap: 10px;
  top: 20px;
  position: sticky;
  background: ${(props) => props.theme.colors.gray6};
  overflow: hidden;
  z-index: 3;
`

export const SelectTokenModal: React.FC<SelectTokenModalProps> = (props) => {
  const { onClose, tokens, onSelect } = props

  const [search, setSearch] = useState('')

  const tokensWithName = tokens
    .map((t) => ({ ...t, name: getTokenNameByMintAddress(t.mint) }))
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Modal backdrop="dark" onClose={onClose} open>
      <Test2>
        <Test style={{ top: '5px', position: 'sticky' }}>
          <ModalTitle>Select Token</ModalTitle>
          <CloseIcon
            onClick={() => {
              props.onClose()
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 18L9.5 9.5M18 1L9.5 9.5M9.5 9.5L18 18L1 1"
                stroke="#F5F5FB"
                strokeWidth="2"
              />
            </svg>
          </CloseIcon>
        </Test>
        <SearchInput
          name="token_search"
          append={
            <IconContainer>
              <SvgIcon src={Loop} height="1.6rem" width="1.6rem" />
            </IconContainer>
          }
          value={search}
          onChange={setSearch}
          placeholder="Search..."
        />
      </Test2>

      <BlockContent>
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
