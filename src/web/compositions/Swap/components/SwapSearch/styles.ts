import { BORDER_RADIUS, COLORS } from '@variables/variables'
import styled from 'styled-components'

import { Input } from '@sb/components/Input'
import { InlineText } from '@sb/components/Typography'

export const Container = styled.div`
  margin: 10px 8px;
  position: relative;
`

export const SearchInput = styled(Input)`
  background: none;
  margin: 0;

  input {
    font-weight: normal;
  }
`

export const SwapsList = styled.div`
  position: absolute;
  width: 100%;
  top: 60px;
  background: ${COLORS.blockBackground};
  border-radius: ${BORDER_RADIUS.md};
  z-index: 2;
  padding: 10px 0;
  box-shadow: 0px 0px 48px rgba(0, 0, 0, 0.55);
`

export const SwapItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px 24px;
  cursor: pointer;
`

export const TokenName = styled(InlineText)`
  text-transform: uppercase;
`

export const NoData = styled.div`
  padding: 20px 0;
  text-align: center;
`
