import { BORDER_RADIUS, COLORS } from '@variables/variables'
import styled from 'styled-components'

import { Input } from '@sb/components/Input'
import { InlineText } from '@sb/components/Typography'

export const Container = styled.div`
  width: 100%;
  margin: 10px 0;
  position: relative;
`

export const SearchInput = styled(Input)`
  background: none;
  margin: 0;

  div {
    width: 100%;
  }

  input {
    font-weight: normal;
    width: 100%;
  }
`

export const SwapsList = styled.div`
  position: absolute;
  width: 100%;
  background: ${COLORS.blockBackground};
  border-radius-bottom-left: ${BORDER_RADIUS.md};
  border-radius-bottom-right: ${BORDER_RADIUS.md};
  z-index: 20;
  padding: 10px 0;
  box-shadow: 0px 0px 48px rgba(0, 0, 0, 0.55);
`

export const SwapItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 24px;
  cursor: pointer;
  color: ${(props) => COLORS[props.color]};
`

export const TokenName = styled(InlineText)``

export const NoData = styled.div`
  padding: 20px 0;
  text-align: center;
`
