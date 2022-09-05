import { BREAKPOINTS, FONTS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

import { Row } from '@sb/components/Layout'
import { InlineText } from '@sb/components/Typography'

type InputProps = {
  needPadding?: boolean
}

export const InvisibleInput = styled.input`
  width: 100%;
  background: inherit;
  color: ${(props) => props.theme.colors.gray0};
  outline: none;
  border: none;

  font-family: ${FONTS.main};
  font-size: ${FONT_SIZES.md};
  line-height: ${FONT_SIZES.xlmd};
  font-weight: 600;

  &::placeholder {
    color: ${(props) => props.theme.colors.gray3};
  }
`
export const Input = styled.div<InputProps>`
  background: ${(props) => props.theme.colors.white6};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  position: relative;
  border: none;
  border-radius: 0;
  flex-wrap: nowrap;
  padding: ${(props) => (props.needPadding ? '0em 1em' : '0')};
`

export const AmountInputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;

  @media (min-width: ${BREAKPOINTS.xs}) {
    width: 50%;
  }
`
export const StyledInlineText = styled(InlineText)`
  padding: 0 0 0 0.2em;
`
export const CenteredRow = styled(Row)`
  align-items: center;
`
export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 0.8em;
  border-radius: 1em;
  border: 1px solid ${(props) => props.theme.colors.white5};
  background: ${(props) => props.theme.colors.white6};
`
