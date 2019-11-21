import React from 'react'
import styled from 'styled-components'
import SvgIcon from '@sb/components/SvgIcon'

import { OrderbookMode } from './OrderBookTableContainer.types'

export const TableWrapper = styled.div`
  ${({
    mode,
    isFullHeight,
  }: {
    mode: OrderbookMode
    isFullHeight: boolean
  }) =>
    mode === 'both'
      ? 'height: calc(50% - 3.5rem)'
      : isFullHeight
      ? 'height: calc(100% - 2rem)'
      : 'display: none'};
`

export const SvgMode = styled(({ isActive, ...rest }) => (
  <SvgIcon
    {...rest}
    width='2rem'
    height='2rem'
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
  right: 1rem;

  display: flex;
  align-items: center;
`
