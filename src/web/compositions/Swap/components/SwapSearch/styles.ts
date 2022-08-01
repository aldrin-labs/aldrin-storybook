import { BORDER_RADIUS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

import { Input } from '@sb/components/Input'
import { InlineText } from '@sb/components/Typography'

export const Container = styled.div`
  width: 100%;
  position: relative;
  height: 4em;

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
  height: 100%;
  border: 0.1rem solid ${(props) => props.theme.colors.white6};
  background: ${(props) => props.theme.colors.white6};

  div {
    width: 100%;
  }

  input {
    font-size: ${FONT_SIZES.sm};
    font-weight: normal;
    width: 100%;
    height: 100%;

    &::placeholder {
      color: ${(props) => props.theme.colors.white3};
    }
  }
`

export const SwapsList = styled.div`
  position: absolute;
  width: 100%;
  border-bottom-left-radius: ${BORDER_RADIUS.lg};
  border-bottom-right-radius: ${BORDER_RADIUS.lg};
  background: ${(props) => props.theme.colors.white6};
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
  color: ${(props) => props.theme.colors.white1};
  background: ${(props) => props.theme.colors.white6};

  &:hover,
  &.focused {
    background: ${(props) => props.theme.colors.white5};
    transition: all 0.4s ease-out;
  }
`

export const TokenName = styled(InlineText)``

export const NoData = styled.div`
  padding: 20px 0;
  text-align: center;
`
