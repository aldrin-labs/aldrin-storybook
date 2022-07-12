import React from 'react'

import { SearchIcon } from '../Icons'
import { SearchInputContainer, SearchInput as Input } from './index.styles'

export const SearchInput = () => {
  return (
    <SearchInputContainer>
      <Input placeholder="Filter 164 pools by symbol or mint" />
      <SearchIcon />
    </SearchInputContainer>
  )
}
