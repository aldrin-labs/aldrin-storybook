import { FONTS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

type TierProps = {
  width?: string
}

export const TierContainer = styled.div<TierProps>`
  width: ${(props) => props.width || '20%'};
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.colors.white4};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.7em;
`
export const InvisibleInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  width: 90%;
  color: ${(props) => props.theme.colors.white1};
  font-size: ${FONT_SIZES.md};
  font-family: ${FONTS.main};
  font-weight: 600;

  &::placeholder {
    color: ${(props) => props.theme.colors.white4};
    font-weight: 600;
    font-size: ${FONT_SIZES.md};
  }
`
