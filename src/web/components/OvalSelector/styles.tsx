import styled from 'styled-components'
import { ChartSelectStyles } from '@sb/styles/cssUtils'
import ReactSelectComponent from '@sb/components/ReactSelectComponent'

export const SelectR = styled(ReactSelectComponent)`
  width: 14.4rem;
  font-size: 1.28rem;
  display: flex;
`

export const SelectContainer = styled.div`
  ${ChartSelectStyles}
  ${(props) => props.selectStyles}
  /* min-width: ${(props) => (props.isAccountSelect ? '22.8rem' : '14.4rem')}; */

  & > div {
    display: flex;
    width: 100%;
    font-size: 1.28rem;
  }
`
