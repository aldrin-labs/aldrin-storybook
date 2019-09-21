import styled from 'styled-components'
import ReactSelectComponent from '@sb/components/ReactSelectComponent'
import { ChartSelectStyles } from '@sb/styles/cssUtils'

export const SelectR = styled(ReactSelectComponent)`
  width: 100%;
  font-size: 1.28rem;
  display: flex;
`

export const ExchangePair = styled.div`
  ${ChartSelectStyles}
  ${(props) => props.selectStyles}
`
