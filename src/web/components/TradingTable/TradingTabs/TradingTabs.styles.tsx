import React from 'react'
import styled from 'styled-components'
import { Button, Theme } from '@material-ui/core'

export const TitleTab = styled(({ active, theme, ...rest }) => {
  return <button {...rest} />
})`
  &&& {
    color: ${(props: { active: boolean; theme: Theme }) =>
      props.active
        ? props.theme.palette.blue.serum
        : props.theme.palette.dark.main};
    background-color: ${(props) => props.theme.palette.grey.main};
    font-size: 1.3rem;
    font-weight: normal;
    width: 25%;
    border-radius: 0;
    font-family: ${(props: { active: boolean; theme: Theme }) =>
      props.active ? 'Avenir Next Demi' : 'Avenir Next Medium'};
    letter-spacing: 0.01rem;
    border: none;
    border-bottom: ${(props: { active: boolean; theme: Theme }) =>
      props.active ? `0.2rem solid ${props.theme.palette.blue.serum}` : 'none'};
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
