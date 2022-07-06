import { BREAKPOINTS, COLORS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

import { PADDINGS } from '@sb/components/Button'

type StyledSwitcher = {
  isActive?: boolean
  radius?: string
  size: number
}

export interface RadioContainer {
  checked: boolean
  width?: string
  margin?: string
  backgroundColor?: string
  height?: string
}

export const Container = styled.div`
  width: 100%;
  color: ${COLORS.lightGray};
  font-size: ${FONT_SIZES.md};
  outline: none;
  border: none;
  padding: 0.5rem;
  border-radius: none;
  cursor: pointer;
  display: flex;
  flex-wrap: nowrap;
  margin: 0 0 2rem 0;
  background: ${(props) => props.theme.colors.gray5};
  justify-content: center;
  @media (min-width: ${BREAKPOINTS.sm}) {
    width: auto;
    min-width: 20%;
    font-size: ${FONT_SIZES.sm};
  }
`
export const Button = styled.button<StyledSwitcher>`
  width: ${(props) => `calc(100% / ${props.size})`};
  padding: ${PADDINGS.lg};
  background: ${(props) =>
    props.isActive ? props.theme.colors.gray10 : props.theme.colors.gray5};
  padding: 0.5rem;
  color: ${(props) =>
    props.isActive ? props.theme.colors.gray0 : props.theme.colors.gray1};
  font-size: ${FONT_SIZES.sm};
  outline: none;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  height: 5rem;
  transition: 0.5s;
`
