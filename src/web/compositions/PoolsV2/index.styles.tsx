import { BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

export const RootRow = styled.div`
  height: ${(props) => props.height || '100%'};
  display: flex;
  justify-content: space-betwenen;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;

  @media (min-width: ${BREAKPOINTS.sm}) {
    flex-direction: row;
  }
`
