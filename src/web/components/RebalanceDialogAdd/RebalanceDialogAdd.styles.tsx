import React from 'react'
import styled from 'styled-components'
import {
  Grid,
  Dialog,
  DialogTitle,
  Typography,
  Link,
  InputBase,

  withStyles
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

export const TypographyCustomHeading = styled(
  ({ color, fontWeight, ...rest }) => <Typography {...rest} />
)`
  color: ${(props) => props.color || '#000'};
  font-weight: ${(props) => props.fontWeight || `400`};
`

export const GridCustom = styled(Grid)`
  padding: 15px;
`
export const GridSearchPanel = styled(Grid)`
  padding: 0 0 20px 0;
  border-bottom: 1px solid #e7ecf3;
`
export const DialogTitleCustom = styled(DialogTitle)`
  text-align: center;
  color: #16253d;
  background: #f2f4f6;
  border-radius: 32px 32px 0px 0px;
`

export const DialogSubTitle = styled(DialogTitle)`
  color: #fff;
  margin: auto;
  text-align: center;
  text-transform: uppercase;
  padding: 15px 0 0 0;
  border-top: 1px solid #e7ecf3;
  border-bottom: 5px solid #cacaca;
  padding-bottom: 15px;
`

export const InputBaseCustom = styled(InputBase)`
  width: 100%;
  background: #f2f4f6;
  border-radius: 50px;
  padding: 4px 15px;
`

export const DialogWrapper = withStyles({
  root: {
    borderRadius: '100px'
  },
  paper: {
    minWidth: '600px'
  }
})(Dialog)

export const TypographyTopDescription = styled(Typography)`
  margin: auto;
  width: 90%;
  text-align: center;
`

export const LinkCustom = styled((background, color, ...rest) => (
  <Link {...rest} />
))`
  cursor: pointer;
  background: ${(props) => props.background || 'none'};
  color: ${(props) => props.color || 'none'};
`
export const SearchIconCustom = styled(SearchIcon)`
  position: absolute;
  margin-top: 7px;
  right: 36px;
  color: #c4c4c4;
  width: 18px;
`
