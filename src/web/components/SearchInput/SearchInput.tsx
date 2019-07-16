import React, { Component } from 'react'
import { InputBaseCustom, SearchIconCustom } from './SearchInput.styles'

export default class SearchInput extends Component {
  state = { placeholder: 'Search by ticker', search: '' }
  // handleChange(e) {
  //   console.log('VALUX: "', e.target.value)
  //   // setState({filtered: e.target.value})
  // }
  render() {
    const {
      height,
      width,
      placeholder,
      fontSize,
      searchCoinInTable,
    } = this.props
    // this.handleChange = this.handleChange.bind(this)

    return (
      <>
        {/* <SearchIconCustom /> */}
        <InputBaseCustom
          height={height}
          width={width}
          placeholder={this.state.placeholder}
          fontSize={fontSize}
          //onChange={this.handleChange}
          onChange={searchCoinInTable}
        />
      </>
    )
  }
}
