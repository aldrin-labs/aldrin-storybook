import React, { Component } from 'react'
import { InputBaseCustom, SearchIconCustom } from './SearchInput.styles'

export default class SearchInput extends Component {
  state = { placeholder: 'Search by ticker' }
  handleChange(e) {
    // console.log('VALUX: "', e.target.value)
    
  }
  render() {
    const { height, width, placeholder, fontSize } = this.props

    return (
      <>
        {/* <SearchIconCustom /> */}
        <InputBaseCustom
          height={height}
          width={width}
          placeholder={this.state.placeholder}
          fontSize={fontSize}
          onChange={this.handleChange.bind(this)}
        />
      </>
    )
  }
}