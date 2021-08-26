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
      props.active
        ? `0.2rem solid ${props.theme.palette.blue.serum}`
        : `0.2rem solid ${props.theme.palette.grey.border}`};
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
    @media (max-width: 600px) {
      padding: 3rem 0;
      color: ${(props: { active: boolean; theme: Theme }) =>
        props.active ? '#fbf2f2' : props.theme.palette.dark.main};
      border-bottom: ${(props: { active: boolean; theme: Theme }) =>
        props.active
          ? `0.4rem solid #fbf2f2`
          : `0.1rem solid ${props.theme.palette.grey.border}`};
      font-size: 2rem;
      background-color: #222429;
      width: 31%;
      border-right: none;
    }
  }
`

export const StyledTitleTab = styled(TitleTab)`
  @media (max-width: 600px) {
    display: none;
  }
`
export const StyledTitleTabForMobile = styled(TitleTab)`
  @media (min-width: 600px) {
    display: none;
  }
`

export const TitleTabsGroup = styled(({ ...rest }) => <div {...rest} />)`
  &&& {
    display: flex;
    background-color: ${(props) => props.theme.palette.grey.main};
    @media (max-width: 600px) {
      background-color: #222429;
    }
  }
`
export const ExpandTableButton = styled.div`
  width: 18%;
  display: flex;
  border-bottom: ${(props) =>
    `0.1rem solid ${props.theme.palette.grey.border}`};
  justify-content: center;

  @media (min-width: 600px) {
    display: none;
  }
`
