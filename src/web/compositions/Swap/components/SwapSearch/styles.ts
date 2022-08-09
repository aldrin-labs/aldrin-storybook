import { BORDER_RADIUS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

import { Input } from '@sb/components/Input'
import { InlineText } from '@sb/components/Typography'
import { Append, InputContainer } from "@sb/components/Input/styles"

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
  border: 0.1rem solid ${(props) => props.theme.colors.white6};
  background: ${(props) => props.theme.colors.white6};
  height: 4.6em;
  padding: 0 1.8em;

  ${InputContainer} {
    display: flex;
    width: 100%;
  }

  ${Append} {
    padding: 0;
  }

  input {
    font-size: ${FONT_SIZES.xsm};
    font-weight: normal;
    width: 100%;
    height: 100%;
    padding: 0;
    margin-left: 1.8em;

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

export const SwapRow = styled.div`
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

export const CloseButton = styled.button`
  cursor: pointer;
  border: none;
  height: 2.25em;
  width: 3.4em;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.white3};
  background-color: ${(props) => props.theme.colors.white5};
  border-radius: 8px;
  font-weight: bold;
  margin-left: 1.8em;
`
