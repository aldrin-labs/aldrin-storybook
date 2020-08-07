import styled from 'styled-components'
import { ChartSelectStyles } from '@sb/styles/cssUtils'
import ReactSelectComponent from '@sb/components/ReactSelectComponent'

export const SelectR = styled(ReactSelectComponent)`
  width: 14.4rem;
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

export const SelectContainer = styled.div`
  ${ChartSelectStyles}
  ${(props) => props.selectStyles}
  border-radius: 0;
  box-shadow: none;
  /* min-width: ${(props) =>
    props.isAccountSelect ? '22.8rem' : '14.4rem'}; */

  & > div {
    display: flex;
    width: 100%;
    font-size: 1.28rem;
  }

  @media (max-width: 1440px) {
    & > div {
      font-size: .9rem;
    }

    & svg {
      height: 12px;
    }
  }
`
