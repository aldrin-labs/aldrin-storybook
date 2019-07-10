import React from 'react'
import { InputBaseCustom, SearchIconCustom } from './SearchInput.styles'

export default function SearchInput(props) {
  const { height, width, placeholder, fontSize } = props
  return (
    <>
      
      <InputBaseCustom
        height={height}
        width={width}
        placeholder={<SearchIconCustom />}
        fontSize={fontSize}
      />
    </>
  )
}
