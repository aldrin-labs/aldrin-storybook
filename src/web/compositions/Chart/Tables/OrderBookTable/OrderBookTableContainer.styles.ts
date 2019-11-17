import styled from 'styled-components'

import { OrderbookMode } from './OrderBookTableContainer.types'

export const TableWrapper = styled.div`
  height: ${({
    mode,
    isFullHeight,
  }: {
    mode: OrderbookMode
    isFullHeight: boolean
  }) =>
    mode === 'both'
      ? 'calc(50% - 3.5rem)'
      : isFullHeight
      ? 'calc(100% - 2rem)'
      : '0'};
`
