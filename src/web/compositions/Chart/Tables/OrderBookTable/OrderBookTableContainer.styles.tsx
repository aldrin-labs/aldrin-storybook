import React from 'react'
import styled from 'styled-components'
import SvgIcon from '@sb/components/SvgIcon'

import { OrderbookMode } from './OrderBookTableContainer.types'

export const TableWrapper = styled.div`
  ${({ mode, isFullHeight }: { mode: OrderbookMode; isFullHeight: boolean }) =>
    mode === 'both'
      ? 'height: calc(50% - 3.5rem)'
      : isFullHeight
      ? 'height: calc(100% - 2.75rem)'
      : 'display: none'};
`

export const BidsWrapper = styled.div`
  top: 0.2rem;
  ${({ mode, isFullHeight }: { mode: OrderbookMode; isFullHeight: boolean }) =>
    mode === 'both'
      ? 'height: calc(50% - 4.5rem)'
      : isFullHeight
      ? 'height: calc(100% - 6rem)'
      : 'display: none'};

  & .ReactVirtualized__Grid {
    /* overflow: ${props => props.mode === 'bids' ? "hidden auto" : "hidden !important"}; */
    overflow: hidden !important;
  }
`

export const AsksWrapper = styled.div`
  bottom: 0.2rem;
  ${({ mode, isFullHeight }: { mode: OrderbookMode; isFullHeight: boolean }) =>
    mode === 'both'
      ? 'height: calc(50% - 2rem)'
      : isFullHeight
      ? 'height: calc(100% - 6rem)'
      : 'display: none'};

  & .ReactVirtualized__Grid {
    /* overflow: ${props => props.mode === 'asks' ? "hidden auto" : "hidden !important"}; */
    overflow: hidden !important;
  }
`

export const SvgMode = styled(({ isActive, ...rest }) => (
  <SvgIcon
    {...rest}
    width="2rem"
    height="2rem"
    styledComponentsAdditionalStyle={{
      padding: '0.2rem',
      marginRight: '0.5rem',
      borderRadius: '.2rem',
      border: `${isActive && '.1rem solid rgb(22, 91, 224);'}`,
    }}
  />
))``

export const ModesContainer = styled.div`
  position: absolute;
  width: 60%;
  right: 0;
  justify-content: center;

  display: flex;
  align-items: center;
`
