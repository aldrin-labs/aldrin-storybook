import { COLORS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

interface StyledSwitcher {
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
  border-radius: none;
  cursor: pointer;
  display: flex;
  flex-wrap: nowrap;
  margin: 0 0 2rem 0;
  background: ${COLORS.cardsBack};
  justify-content: space-between;
`
export const Button = styled.button<StyledSwitcher>`
  width: 49.5%;
  background: ${(props) =>
    props.isActive ? COLORS.mainBlack : COLORS.cardsBack}};
  padding: 0.5rem;
  color: ${(props) => (props.isActive ? COLORS.white : COLORS.lightGray)};
  font-size: ${FONT_SIZES.sm};
  outline: none;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  height: 5rem;
  transition: 0.5s;
`
export const BlockWithRadio = styled.div`
  width: 50%;
  display: flex;
  padding: 1rem;
  flex-direction: column;
  justify-content: space-between;
`
