import React from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
// import { Text } from '@sb/compositions/Addressƒbook/index'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { getTokenName } from '@sb/dexUtils/markets'
import { TokenInfo } from '@sb/dexUtils/types'

import Loop from '@icons/loop.svg'

import {
  IconsContainer,
  PoolName,
  SearchInput,
  TokenIconContainer,
} from '../index.styles'

export const SearchInputWithLoop = ({
  placeholder,
  onChangeSearch,
  searchValue,
  width = '40rem',
  onFocus,
  onBlur,
}: {
  placeholder: string
  onChangeSearch: (value: string) => void
  searchValue: string
  width?: string
  onFocus?: () => {}
  onBlur?: () => {}
}) => {
  return (
    <Row style={{ position: 'relative' }} height="3em" width={width}>
      <SearchInput
        value={searchValue}
        onChange={(e) => {
          onChangeSearch(e.target.value)
        }}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus
      />
      <SvgIcon
        src={Loop}
        height="1em"
        width="1em"
        style={{ position: 'absolute', right: '2rem', cursor: 'pointer' }}
      />
    </Row>
  )
}

interface TokenIconContainerProps {
  tokenA: string
  tokenB: string
  tokenMap: Map<string, TokenInfo>
}

export const TokenIconsContainer: React.FC<TokenIconContainerProps> = (
  props
) => {
  const { tokenA, tokenB, children, tokenMap } = props

  const base = getTokenName({ address: tokenA, tokensInfoMap: tokenMap })
  const quote = getTokenName({ address: tokenB, tokensInfoMap: tokenMap })

  return (
    <Row wrap="nowrap" justify="end">
      <IconsContainer>
        <TokenIconContainer zIndex="1" left="0">
          <TokenIcon mint={tokenA} />
        </TokenIconContainer>
        <TokenIconContainer
          left="0"
          zIndex="0"
          style={{ transform: 'translateX(70%)' }}
        >
          <TokenIcon mint={tokenB} />
        </TokenIconContainer>
      </IconsContainer>
      <div style={{ marginLeft: '2rem' }}>
        <PoolName size="sm">
          {base} / {quote}
        </PoolName>
        {children}
      </div>
    </Row>
  )
}
