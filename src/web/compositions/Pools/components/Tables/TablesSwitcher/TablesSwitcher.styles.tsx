import styled from 'styled-components'
import { Theme } from '@material-ui/core'
import { COLORS, BREAKPOINTS, BORDER_RADIUS } from '@variables/variables'
import { Input } from '@sb/components/Input'

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
  font-size: 0.9em;
  font-family: Avenir Next Demi;
  text-transform: capitalize;
  cursor: pointer;
`

export const TabContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;

    @media(min-width: ${BREAKPOINTS.md}) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
`

export const InputWrap = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px;

    @media(min-width: ${BREAKPOINTS.md}) {
      margin-top: 0;
    }
`

export const SearchInput = styled(Input)`
    margin-right: 10px;
    flex: 1;
    border-radius: ${BORDER_RADIUS.lg};

    @media(min-width: ${BREAKPOINTS.md}) {
      min-width: 250px;
    }
`

export const TableContainer = styled.div`
    min-width: 600px;
`