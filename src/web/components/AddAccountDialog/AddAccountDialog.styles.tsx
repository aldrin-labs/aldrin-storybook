import {
  Grid,
  Dialog,
  DialogTitle,
  Typography,
  Link,
  InputBase,
  withTheme,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import React from 'react'
import styled from 'styled-components'

export const TypographyCustomHeading = styled(
  ({ color, fontWeight, ...rest }) => <Typography {...rest} />
)`
  color: ${(props) => props.color || '#7284A0'};
  font-weight: ${(props) => props.fontWeight || `500`};
  font-family: 'DM Sans';
  font-size: 1.3rem;
  line-height: 114.5%;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-align: left;
`

export const GridCustom = styled(Grid)`
  margin: 2rem 0;
`
export const GridSearchPanel = styled(Grid)`
  padding: 0 0 20px 0;
  border-bottom: 1px solid #e7ecf3;
`
export const DialogTitleCustom = styled(DialogTitle)`
  text-align: center;
  color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.dark &&
      props.theme.palette.dark.main) ||
    '#16253d'};
  background: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.grey &&
      props.theme.palette.grey.main) ||
    '#f2f4f6'};
  border: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.border &&
      props.theme.palette.border.main) ||
    '.1rem solid #e0e5ec'};
  border-radius: 20px 20px 0px 0px;
  padding: 2.4rem 3rem 2.4rem;
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
  background: #fff;
  padding: 1rem 1.25rem;
  margin-bottom: 0;
  border: 1px solid #e0e5ec;
  box-sizing: border-box;
  border-radius: 1rem;
  box-shadow: inset 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.15);

  input {
    color: #16253d;
    font-size: 1.3rem;
    line-height: 114.5%;
    padding: 0;

    &::placeholder {
      text-transform: capitalize;
    }
  }
`

const DialogWrapper1 = styled(({ ...props }) => <Dialog {...props} />)`
  border-radius: 100px;
`

export const DialogWrapper = withTheme()(DialogWrapper1)

export const TypographyTopDescription = styled(Typography)`
  margin: auto;
  width: 90%;
  text-align: center;
`

export const LinkCustom = styled(Link)`
  cursor: pointer;
  font-family: 'DM Sans';
  font-weight: 700;
  font-size: 1rem;
  line-height: 114.5%;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #0e02ec;
`
export const SearchIconCustom = styled(SearchIcon)`
  position: absolute;
  margin-top: 7px;
  right: 36px;
  color: #c4c4c4;
  width: 18px;
`

export const Legend = styled(Typography)`
  font-family: 'DM Sans';
  font-weight: 700;
  font-size: 1rem;
  line-height: 114.5%;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #16253d;

  display: flex;
  align-items: center;
  white-space: nowrap;

  margin-bottom: 1.25rem;

  &:after {
    content: '';
    background-color: #e0e5ec;
    height: 1px;
    width: 100%;
    display: block;
    position: relative;
    margin-left: 1rem;
  }
`
