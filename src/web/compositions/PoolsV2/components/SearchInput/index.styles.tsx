import { BREAKPOINTS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

export const SearchInput = styled.input`
  position: absolute;
  font-family: Avenir Next;
  border: none;
  background-color: ${(props) => props.theme.colors.gray7};
  border-radius: 0.6em;
  width: 100%;
  height: 100%;
  padding: 0 1.5em;
  color: ${(props) => props.theme.colors.gray0};
  outline: none;
  font-size: ${FONT_SIZES.sm};
  &::placeholder {
    color: ${(props) => props.theme.colors.gray13};
  }
`
export const SearchInputContainer = styled.div`
  width: 65%;
  position: relative;
  height: 2.3em;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: 25%;
  }
`
