import React from 'react'
import styled from 'styled-components'

export const TitleTab = styled(({ active, ...rest }) => {
  return <button {...rest} />
})`
  &&& {
    color: ${(props) =>
      props.active ? props.theme.colors.white : props.theme.colors.gray1};
    background-color: ${(props) => props.theme.colors.gray10};
    font-size: 1.3rem;
    font-weight: normal;
    width: 25%;
    border-radius: 0;
    font-family: ${(props) =>
      props.active ? 'Avenir Next Demi' : 'Avenir Next Medium'};
    letter-spacing: 0.01rem;
    border: none;
    border-bottom: ${(props) =>
      !props.active ? 'none' : `0.2rem solid ${props.theme.colors.gray1}`};
    height: auto;
    text-transform: capitalize;
    white-space: nowrap;
    line-height: 1.5rem;
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
      color: ${(props) =>
        props.active ? props.theme.colors.gray0 : props.theme.colors.gray1};
      border-bottom: ${(props) =>
        props.active
          ? `0.4rem solid ${props.theme.colors.gray0}`
          : `0.1rem solid ${props.theme.colors.gray1}`};
      font-size: 2rem;
      background-color: ${(props) => props.theme.colors.gray6};
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
    background-color: ${(props) => props.theme.colors.gray6};
    @media (max-width: 600px) {
      background-color: #222429;
    }
  }
`
export const ExpandTableButton = styled.div`
  width: 18%;
  display: flex;
  border-bottom: ${(props) => `0.1rem solid ${props.theme.colors.gray5}`};
  justify-content: center;
  background-color: ${(props) => props.theme.colors.gray6};

  @media (min-width: 600px) {
    display: none;
  }

  svg {
    width: 25%;
    height: auto;
    path {
      fill: ${(props) => props.theme.colors.gray1};
    }
  }
`
