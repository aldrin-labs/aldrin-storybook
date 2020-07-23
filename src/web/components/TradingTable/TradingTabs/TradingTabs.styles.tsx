import React from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const TitleTab = styled(({ active, ...rest }) => <button {...rest} />)`
  &&& {
    color: ${(props: { active: boolean }) =>
      props.active ? '#fff' : '#16253D;'};
    background-color: ${(props: { active: boolean }) =>
      props.active ? '#5C8CEA' : '#f2f4f6'};
    font-size: 1.3rem;
    font-weight: normal;
    width: 20%;
    // padding: 0.6rem 4rem;
    border-radius: 0;
    letter-spacing: 0.01rem;
    border: none;
    border-right: 0.1rem solid #e0e5ec;
    height: auto;
    text-transform: capitalize;
    white-space: nowrap;
    padding: 0.7rem 0 0.7rem 0;

    &:hover {
      cursor: pointer;
    }

    &:focus {
      outline: none;
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
    background-color: #f2f4f6;
    border-bottom: 1px solid #e0e5ec;
  }
`
