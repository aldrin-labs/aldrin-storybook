import React from 'react'
// import { Text } from '@sb/compositions/Addressƒbook/index'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Loop from '@icons/loop.svg'
import { TokenIcon } from '@sb/components/TokenIcon'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import {
  SearchInput,
  IconsContainer,
  TokenIconContainer,
  PoolName,
} from '../index.styles'

export const SearchInputWithLoop = ({
  placeholder,
  onChangeSearch,
  searchValue,
  width = '40rem',
}: {
  placeholder: string
  onChangeSearch: (value: string) => void
  searchValue: string
  width?: string
}) => {
  return (
    <Row style={{ position: 'relative' }} width={width}>
      <SearchInput
        value={searchValue}
        onChange={(e) => {
          onChangeSearch(e.target.value)
        }}
        placeholder={placeholder}
      />
      <SvgIcon
        src={Loop}
        height="1.6rem"
        width="1.6rem"
        style={{ position: 'absolute', right: '2rem', cursor: 'pointer' }}
      />
    </Row>
  )
}

interface TokenIconContainerProps {
  tokenA: string
  tokenB: string
}

export const TokenIconsContainer: React.FC<TokenIconContainerProps> = (
  props
) => {
  const { tokenA, tokenB, children } = props
  return (
    <Row wrap="nowrap" justify="end">
      <IconsContainer>
        <TokenIconContainer zIndex="1" left="0">
          <TokenIcon width="3rem" height="3rem" mint={tokenA} />
        </TokenIconContainer>
        <TokenIconContainer
          left="0"
          zIndex="0"
          style={{ transform: 'translateX(70%)' }}
        >
          <TokenIcon width="3rem" height="3rem" mint={tokenB} />
        </TokenIconContainer>
      </IconsContainer>
      <div style={{ marginLeft: '2rem' }}>
        <PoolName size="sm" color="white">
          {getTokenNameByMintAddress(tokenA)}/
          {getTokenNameByMintAddress(tokenB)}
        </PoolName>
        {children}
      </div>
    </Row>
  )
}
