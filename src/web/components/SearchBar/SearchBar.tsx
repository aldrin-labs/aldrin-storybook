import React, { Component } from 'react'
//import { withStyles } from '@material-ui/core/styles';
// import { IProps, IState } from './RebalanceDialogAdd.types'

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
