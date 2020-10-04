import React from 'react'
import styled from 'styled-components'
import { Button, Theme } from '@material-ui/core'

export const TitleTab = styled(({ active, theme, ...rest }) => {
  return <button {...rest} />
})`
  &&& {
    color: ${(props: { active: boolean; theme: Theme }) =>
      props.active
        ? props.theme.palette.white.main
        : props.theme.palette.dark.main};
    background-color: ${(props: { active: boolean; theme: Theme }) =>
      props.active
        ? props.theme.palette.blue.tab
        : props.theme.palette.grey.main};
    font-size: 1.4rem;
    font-weight: normal;
    font-family: DM Sans;
    font-style: normal;
    width: 20%;
    // padding: 0.6rem 4rem;
    border-radius: 0;
    letter-spacing: 0.05rem;
    border: none;
    border-right: ${(props) => props.theme.palette.border.main};
    height: auto;
    text-transform: capitalize;
    white-space: nowrap;
    line-height: 1rem;
    padding: 1rem 0;

    &:hover {
      cursor: pointer;
    }

    &:focus {
      outline: none;
    }

    &:last-child {
      border-right: 0;
    }
  }

  @media (max-width: 1600px) {
    &&& {
      // padding: .6rem 2rem;
    }
  }
`

export const TitleTabsGroup = styled(({ ...rest }) => <div {...rest} />)`
  &&& {
    display: flex;
    background-color: ${(props) => props.theme.palette.grey.main};
    border-bottom: ${(props) => props.theme.palette.border.main};
  }
`
export const SmartTradeButton = styled.button`
  width: 35rem;
  outline:none;
  height: 3.5rem;
  margin: 0.5rem 0.5rem;
  //background-color: ${(props) => props.theme.palette.blue.main};
  border: none;
  border-radius: 12px;
  color: #f5f5fb;
  font-style: normal;
  font-weight: bold;
  line-height: 100%;
  display: flex;
  padding: auto 1rem;
  font-size: 1.5rem;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.05rem;
  font-family: Avenir Next Demi;
  cursor: pointer;
`
