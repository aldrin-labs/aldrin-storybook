import styled from 'styled-components'
import { ChartSelectStyles } from '@sb/styles/cssUtils'
import ReactSelectComponent from '@sb/components/ReactSelectComponent'

export const SelectR = styled(ReactSelectComponent)`
  width: 9rem;
  font-size: 0.8rem;
  display: flex;
`


export const SelectContainer = styled.div`
  ${ChartSelectStyles}

  & > div {
    display: flex;
    width: 100%;
    font-size: 0.8rem;
  }
`

