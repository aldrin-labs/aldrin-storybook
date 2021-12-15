import styled from 'styled-components'
import { SelectorRow } from '../SelectCoinPopup'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

const StyledSelectorRow = styled(SelectorRow)`
  cursor: pointer;
  justify-content: space-between;
  height: 6rem;
`
const SelectorRowsContainer = styled(RowContainer)`
  position: absolute;
  background: #222429;
  border: 0.1rem solid #383b45;
  z-index: 1000;
  padding: 0 2rem;
  border-radius: 1.5rem;
  top: 5rem;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.55);
  max-height: 65rem;
  overflow: scroll;
  div {
    &:last-child {
      border: none;
    }
  }
`

export {
    StyledSelectorRow,
    SelectorRowsContainer
}