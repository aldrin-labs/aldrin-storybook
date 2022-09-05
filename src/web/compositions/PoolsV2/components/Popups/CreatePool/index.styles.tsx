import { FONTS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

import { Container } from '../../TableRow/index.styles'

type TierProps = {
  width?: string
}

type InputProps = {
  placeholderColor?: string
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
export const InvisibleInput = styled.input<InputProps>`
  background: transparent;
  border: none;
  outline: none;
  width: 90%;
  color: ${(props) => props.theme.colors.white1};
  font-size: ${FONT_SIZES.md};
  font-family: ${FONTS.main};
  font-weight: 600;

  &::placeholder {
    color: ${(props) => props.theme.colors[props.placeholderColor || 'white4']};
    font-weight: 600;
    font-size: ${FONT_SIZES.md};
  }
`
export const DurationContainer = styled.div`
  width: 24%;
  border-radius: 13px;
  padding: 0.3em 1.3em;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.white3};
  font-weight: 600;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.white3};
`
export const GradientBar = styled.div`
  background: linear-gradient(90deg, #00ff84 0%, #8c33ff 100%);
  border-radius: 2px;
  height: 4px;
  width: 70%;
  margin: 0 1em;
`
export const CustomDuration = styled(TierContainer)`
  height: 100%;
  background: ${(props) => props.theme.colors.white4};
  border: none;
`
export const TokenSelectorContainer = styled.div`
  background: ${(props) => props.theme.colors.white5};
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.6em;
  padding: 0.5em;
`
export const SContainer = styled(Container)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
