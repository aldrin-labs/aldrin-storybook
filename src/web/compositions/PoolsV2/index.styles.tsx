import { BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { StretchedBlock, WideContent } from '@sb/components/Layout'

export const RootRow = styled.div`
  height: ${(props) => props.height || 'auto'};
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;

  @media (min-width: ${BREAKPOINTS.sm}) {
    flex-direction: row;
  }
`
export const StyledWideContent = styled(WideContent)`
  @media (min-width: ${BREAKPOINTS.xl}) {
    max-width: ${BREAKPOINTS.xl};
    margin: 0 auto;
  }
`
export const ButtonsContainer = styled(StretchedBlock)`
  width: 40%;
  @media (min-width: ${BREAKPOINTS.xl}) {
    min-width: 25%;
    width: auto;
  }
`
