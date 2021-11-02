import styled from 'styled-components'
import { Theme } from '@material-ui/core'
import { COLORS, BREAKPOINTS } from '@variables/variables'

type TableModeButtonProps = {
  isActive: boolean
  theme: Theme
}

export const TableModeButton = styled.button`
  border: none;
  border-bottom: ${(props: TableModeButtonProps) =>
    props.isActive
      ? `.3rem solid ${COLORS.white}`
      : `.3rem solid ${COLORS.hint}`};

  background: inherit;
  color: ${(props: TableModeButtonProps) =>
    props.isActive ? COLORS.white : COLORS.hint};
  padding: 0.4rem 0;
  margin: 0 1.6rem 0 0;
  outline: none;
  font-size: 1.4rem;
  font-family: Avenir Next Demi;
  text-transform: capitalize;
  cursor: pointer;
`

export const TabContainer = styled.div`
    @media(min-width: ${BREAKPOINTS.md}) {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
`

export const InputWrap = styled.div`
    display: flex;
    flex-direction: row;
`