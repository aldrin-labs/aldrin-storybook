import React, { Component } from 'react'
import { InputBaseCustom, SearchIconCustom } from './SearchInput.styles'

export default class SearchInput extends Component {
  state = { placeholder: 'Search by ticker' }

  render() {
    const {
      height,
      width,
      placeholder,
      fontSize,
      searchCoinInTable,
    } = this.props

    return (
      <>
        <InputBaseCustom
          height={height}
          width={width}
          placeholder={this.state.placeholder}
          fontSize={fontSize}
          onChange={searchCoinInTable}
        />
      </>
    )
  }
}
