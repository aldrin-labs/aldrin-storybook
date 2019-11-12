import React from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const TitleTab = styled(Button)`
  &&& {
    color: ${props => props.active ? '#fff' : '#7284A0;'};
    background-color: ${props => props.active ? '#5C8CEA' : '#f2f4f6'};
    font-size: 1rem;
    font-weight: bold;
    padding: .6rem 4rem;
    border-radius: 0;
    letter-spacing: .05rem;
    border-right: .1rem solid #e0e5ec;
  }
`

export const TitleTabsGroup = styled(({ ...rest }) => <div {...rest} />)`
  &&& {
    display: flex;
    background-color: #f2f4f6;
    border-bottom: 1px solid #e0e5ec;
  }
`
