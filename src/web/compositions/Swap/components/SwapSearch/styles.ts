import { BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

import { Input } from '@sb/components/Input'
import { InlineText } from '@sb/components/Typography'

export const Container = styled.div`
  width: 100%;
  margin: 10px 0;
  position: relative;

  ${(props: { listOpened: boolean }) =>
    props.listOpened &&
    `
    .inputWrapper { 
      border-bottom-left-radius: 0; 
      border-bottom-right-radius: 0; 
      box-shadow: 0px 8px 8px -2px ${props.theme.colors.shadowColor};
    }

  `}
`

export const SearchInput = styled(Input)`
  background: none;
  margin: 0;
  border: 0.1rem solid ${(props) => props.theme.colors.gray5};
  background: ${(props) => props.theme.colors.gray5};

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
  background: ${(props) => props.theme.colors.gray5};
  border-bottom-left-radius: ${BORDER_RADIUS.md};
  border-bottom-right-radius: ${BORDER_RADIUS.md};
  z-index: 20;
  padding: 10px 0;
  box-shadow: 0px 8px 8px -2px ${(props) => props.theme.colors.shadowColor};
`

export const SwapItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 15px 24px;
  cursor: pointer;
  color: ${(props) => props.theme.colors[props.$color]};
  background: ${(props) => props.theme.colors.gray5};

  &:hover,
  &.focused {
    background: ${(props) => props.theme.colors.gray6};
    transition: all 0.4s ease-out;
  }
`

export const TokenName = styled(InlineText)``

export const NoData = styled.div`
  padding: 20px 0;
  text-align: center;
`
