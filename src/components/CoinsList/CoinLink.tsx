import React, { SFC } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'


import * as T from '@components/CoinsList/types'

const SCoinLink = styled(Link)`
  color: inherit;
  margin: 3px;
  padding: 0px;
  text-decoration: none;

  &.selected {
    border-color: rgba(66, 66, 66, 0.2);
  }

  &:hover {
    color: palevioletred;
  }
`


const ShowMoreLinkContainer = styled.div`
  display:flex;
  justify-content:flex-end;
  padding:10px 80px 10px 0px;
 

`

const ShowMoreLinkStyle = styled(Link)`
  color: #fff;
  margin: 16px;
  padding: 0px;
  text-decoration: none;

  &.selected {
    border-color: rgba(66, 66, 66, 0.2);
  }

  &:hover {
    color: palevioletred;
  }
`



export const CoinLink: SFC<T.CoinLink> = ({ assetId, name, children }) => (
  <SCoinLink
    to={{
      pathname: `/profile/${assetId}`,
      state: { assetId },
    }}
  >
    {name}
  </SCoinLink>
)



export const ShowMoreLink: SFC<T.CoinLink> = ({name, children }) => (
  <ShowMoreLinkContainer>
  <ShowMoreLinkStyle
    to={{
      pathname: `/screener`,
     
    }}
  >
    {name}
  </ShowMoreLinkStyle>
  </ShowMoreLinkContainer>
)
