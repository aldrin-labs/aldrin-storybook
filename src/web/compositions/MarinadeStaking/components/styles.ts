import { COLORS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

type StyledSwitcher = {
  isActive?: boolean
  radius?: string
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
  font-size: ${FONT_SIZES.sm};
  outline: none;
  border: none;
  padding: 0.5rem;
  border-radius: none;
  cursor: pointer;
  display: flex;
  flex-wrap: nowrap;
  margin: 0 0 2rem 0;
  background: ${(props) => props.theme.colors.white4};
  justify-content: space-between;
`
export const Button = styled.button<StyledSwitcher>`
  width: 49.5%;
  background: ${(props) =>
    props.isActive ? props.theme.colors.white6 : props.theme.colors.white4};
  padding: 0.5rem;
  color: ${(props) =>
    props.isActive ? props.theme.colors.white1 : props.theme.colors.white1};
  font-size: ${FONT_SIZES.sm};
  outline: none;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  height: 5rem;
  transition: 0.5s;
`

export const BlockWithRadio = styled.div<RadioContainer>`
  position: relative;
  width: ${(props) => props.width || '48%'};
  background-color: ${(props) => props.theme.colors.white6 || 'transparent'};
  display: flex;
  padding: 1.5rem;
  flex-direction: column;
  justify-content: space-between;
  border: ${(props) =>
    props.checked
      ? `0.1rem solid ${props.theme.colors.green2}`
      : `0.1rem solid ${props.theme.colors.white5}`};
  border-radius: 8px;
  height: ${(props) => props.height || '10rem'};
  margin: ${(props) => props.margin || '0'};
`
