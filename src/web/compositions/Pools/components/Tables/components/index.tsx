import React from 'react'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import {
  SearchInput,
  IconsContainer,
  TokenIconContainer,
} from '../index.styles'

import Loop from '@icons/loop.svg'
import { TokenIcon } from '@sb/components/TokenIcon'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

export const SearchInputWithLoop = ({
  placeholder,
  onChangeSearch,
  searchValue,
}: {
  placeholder: string
  onChangeSearch: (value: string) => void
  searchValue: string
}) => {
  return (
    <Row style={{ position: 'relative' }} width={'40rem'}>
      <SearchInput
        onChange={(e) => {
          onChangeSearch(e.target.value)
        }}
        placeholder={placeholder}
      />
      <SvgIcon
        src={Loop}
        style={{ position: 'absolute', right: '2rem', cursor: 'pointer' }}
      />
    </Row>
  )
}

export const TokenIconsContainer = ({
  tokenA,
  tokenB,
}: {
  tokenA: string
  tokenB: string
}) => {
  return (
    <Row justify={'end'}>
      <IconsContainer>
        <TokenIconContainer zIndex={'1'} left={'0'}>
          <TokenIcon width={'3rem'} height={'3rem'} mint={tokenA} />
        </TokenIconContainer>
        <TokenIconContainer
          left={'0'}
          zIndex={'0'}
          style={{ transform: 'translateX(70%)' }}
        >
          <TokenIcon width={'3rem'} height={'3rem'} mint={tokenB} />
        </TokenIconContainer>
      </IconsContainer>
      <Text style={{ marginLeft: '2rem' }} fontFamily={'Avenir Next Demi'}>
        {getTokenNameByMintAddress(tokenA)}/{getTokenNameByMintAddress(tokenB)}
      </Text>
    </Row>
  )
}
