import { Theme } from '@material-ui/core'
import { Button } from '@sb/components/Button'
import { Input } from '@sb/components/Input'
import {
  BORDER_RADIUS,
  BREAKPOINTS,
  COLORS,
  FONT_SIZES,
} from '@variables/variables'
import styled from 'styled-components'

type TableModeButtonProps = {
  isActive: boolean
  theme: Theme
  fontSize?: string
}

export const TableModeButton = styled.button`
  border: none;
  border-bottom: ${(props: TableModeButtonProps) =>
    props.isActive ? `.3rem solid ${COLORS.white}` : `.3rem solid transparent`};

  background: inherit;
  color: ${(props: TableModeButtonProps) =>
    props.isActive ? COLORS.white : COLORS.hint};
  padding: 0.4rem 0;
  margin: 0 1.6rem 0 0;
  outline: none;
  font-size: ${(props: TableModeButtonProps) => props.fontSize || '0.9em'};
  font-family: Avenir Next Demi;
  text-transform: capitalize;
  cursor: pointer;
`

export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;

  @media (min-width: ${BREAKPOINTS.lg}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

export const AuditInfo = styled.div`
  margin-top: 20px;
  cursor: pointer;
  @media (min-width: ${BREAKPOINTS.md}) {
    margin-top: 0;
  }
`

export const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  @media (min-width: ${BREAKPOINTS.md}) {
    margin-top: 0;
    align-items: center;
    flex-direction: row;
  }
`

export const SearchInput = styled(Input)`
  margin-right: 10px;
  flex: 1;
  border-radius: ${BORDER_RADIUS.lg};

  @media (min-width: ${BREAKPOINTS.md}) {
    min-width: 250px;
    height: 2.5em;
  }
`

export const TableContainer = styled.div`
  overflow: auto;
`

export const AddPoolButton = styled(Button)`
  height: 42px;
  text-align: center;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: ${FONT_SIZES.md};

  @media (min-width: ${BREAKPOINTS.md}) {
    margin-right: 20px;
  }
`
