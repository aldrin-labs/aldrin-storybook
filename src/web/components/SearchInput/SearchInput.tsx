import React from 'react'
import { InputBaseCustom, SearchIconCustom } from './SearchInput.styles'

export default function SearchInput(props) {
  const { height, width, placeholder, fontSize } = props
  return (
    <>
      {/* <SearchIconCustom /> */}
      <InputBaseCustom
        height={height}
        width={width}
        placeholder={`Search by ticker`}
        fontSize={fontSize}
      />
    </>
  )
}
