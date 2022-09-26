import { BREAKPOINTS, FONTS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

import { Row } from '@sb/components/Layout'
import { InlineText } from '@sb/components/Typography'

export const InvisibleInput = styled.input`
  width: 100%;
  background: inherit;
  color: ${(props) => props.theme.colors.white1};
  outline: none;
  border: none;

  font-family: ${FONTS.main};
  font-size: ${FONT_SIZES.md};
  line-height: ${FONT_SIZES.xlmd};
  font-weight: 600;

  &::placeholder {
    color: ${(props) => props.theme.colors.white3};
  }
`
export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  position: relative;
  border: none;
  border-radius: 0;
  flex-wrap: nowrap;
  padding: 0em 1em;
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
  cursor: pointer;
`
export const CenteredRow = styled(Row)`
  align-items: center;
`
