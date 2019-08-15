import styled from 'styled-components'
import { ChartSelectStyles } from '@sb/styles/cssUtils'

export const ExchangeListContainer = styled.div`
  ${ChartSelectStyles}
  ${(props) => props.selectStyles}

  & > div {
    display: flex;
    width: 100%;
    font-size: 1.28rem;
  }
`
