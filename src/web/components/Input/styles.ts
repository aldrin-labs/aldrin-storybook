import { BORDER_RADIUS, COLORS } from '@variables/variables'
import styled, { css } from 'styled-components'

import { WrapProps, AppendProps } from './types'

export const VARIANTS = {
  default: css`
    background: ${(props) => props.theme.colors.white4};
    border: 1px solid ${(props) => props.theme.colors.white1};
  `,
  'outline-white': css`
    border: 1px solid ${(props) => props.theme.colors.white4};
  `,
  outline: css`
    border: 1px solid ${(props) => props.theme.colors.white4};
  `,
}

export const InputEl = styled.input`
  background: none;
  border: 0;
  outline: none;
  flex: 1;
  height: 3em;
  font-size: 1em;
  line-height: 1.7;
  font-weight: 600;
  padding: 0.6em 0 0.6em 1.5em;
  color: ${(props) => props.theme.colors.white1};
  width: auto;

  &::placeholder {
    font-weight: 500;
  }

  &:disabled {
    color: ${COLORS.hint};
  }
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill {
    -webkit-text-fill-color: ${(props) => props.theme.colors.white1};
    transition: background-color 5000s ease-in-out 0s;
  }
`

export const InputWrap = styled.div<WrapProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  flex: 1;
  border-radius: ${(props: WrapProps) => BORDER_RADIUS[props.$borderRadius]};

  ${(props: WrapProps) => VARIANTS[props.$variant]}
  ${(props: WrapProps) => (props.$disabled ? 'opacity: 0.6;' : '')}
  ${(props: WrapProps) =>
    props.$withLabel
      ? `${InputEl} {
    margin-top: 1.5em;
  }`
      : ''}
`

export const InputContainer = styled.div`
  // flex: 1;
`

export const Append = styled.span<AppendProps>`
  padding: 0 1.5em 0 0;
  color: ${COLORS.hint};
  font-size: 1em;
  display: flex;
  flex: 1;
`

export const Label = styled.div`
  position: absolute;
  left: 1em;
  top: 20%;
`
