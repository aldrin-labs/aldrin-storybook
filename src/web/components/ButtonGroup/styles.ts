import { COLORS, BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: ${COLORS.blockBackground};
  border-radius: ${BORDER_RADIUS.md};
`
