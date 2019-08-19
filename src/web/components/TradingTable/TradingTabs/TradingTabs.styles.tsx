import React from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const TitleTab = styled(Button)`
  &&& {
    color: #16253d;
    background-color: #f2f4f6;
    font-family: Trebuchet MS;
    font-size: 1.2rem;
    padding: 0.7rem 1.2rem 0.3rem 1.2rem;
    margin-right: 1rem;
    border-bottom: 0.4rem solid
      ${(props) => (props.active ? '#165BE0' : '#f2f4f6')};
    border-radius: 0;
  }
`

export const TitleTabsGroup = styled(({ ...rest }) => <div {...rest} />)`
  &&& {
    background-color: #f2f4f6;
    border-bottom: 1px solid #e0e5ec;
  }
`
