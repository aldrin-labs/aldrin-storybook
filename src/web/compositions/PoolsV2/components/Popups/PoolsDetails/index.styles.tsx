import { BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

export const GrayBox = styled.div`
  width: 100%;
  height: 4em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.colors.gray8};
  border-radius: ${BORDER_RADIUS.rg};
  padding: 0.5em 1em;
`
