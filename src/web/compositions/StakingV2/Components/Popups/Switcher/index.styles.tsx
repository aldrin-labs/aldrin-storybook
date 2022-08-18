import { COLORS, FONTS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

type StyledSwitcher = {
  isActive?: boolean
  radius?: string
}

export const Container = styled.div`
  width: 100%;
  color: ${COLORS.lightGray};
  font-size: ${FONT_SIZES.sm};
  outline: none;
  border: none;
  padding: 0.5rem;
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  flex-wrap: nowrap;
  margin: 0 0 2rem 0;
  background: ${(props) => props.theme.colors.white5};
  border: 1px solid ${(props) => props.theme.colors.white4};
  justify-content: space-between;
`
export const Button = styled.button<StyledSwitcher>`
  width: 49.5%;
  background: ${(props) =>
    props.isActive ? props.theme.colors.white4 : props.theme.colors.white5};
  padding: 0.5rem;
  color: ${(props) =>
    props.isActive ? props.theme.colors.white1 : props.theme.colors.white3};
  font-size: ${FONT_SIZES.md};
  outline: none;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  height: 5rem;
  transition: 0.5s;
  font-family: ${FONTS.main};
`
