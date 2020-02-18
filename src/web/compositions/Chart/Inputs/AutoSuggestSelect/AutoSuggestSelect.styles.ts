import styled from 'styled-components'
import ReactSelectComponent from '@sb/components/ReactSelectComponent'
import { ChartSelectStyles } from '@sb/styles/cssUtils'

export const SelectR = styled(ReactSelectComponent)`
  width: 100%;
  font-size: 1.28rem;
  display: flex;

  @media (max-width: 1440px) {
    & > div {
      font-size: 0.9rem;
    }

    & svg {
      height: 12px;
    }
  }
`

export const ExchangePair = styled.div`
  ${ChartSelectStyles}
  ${(props) => props.selectStyles}
`
