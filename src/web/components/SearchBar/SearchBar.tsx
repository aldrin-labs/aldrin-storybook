import React, { Component } from 'react'

import { SearchBarPanel, SearchBarIcon, SearchInputBase  } from "./SearchBar.styles";

export default class SerachBar extends Component {
  render() {
    return (
    <>
        <SearchBarIcon />
        <SearchInputBase placeholder="Search…" />
    </>
    )
  }
}
