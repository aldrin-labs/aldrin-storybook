import styled from 'styled-components'
import { Theme } from '@material-ui/core'
import {
  COLORS,
  BREAKPOINTS,
  BORDER_RADIUS,
  FONT_SIZES,
} from '@variables/variables'
import { Input } from '@sb/components/Input'
import { Button } from '@sb/components/Button'

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

  @media (min-width: ${BREAKPOINTS.md}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

export const InputWrap = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;

  @media (min-width: ${BREAKPOINTS.md}) {
    margin-top: 0;
    align-items: center;
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
  min-width: 600px;
`

export const AddPoolButton = styled(Button)`
  width: 42px;
  height: 42px;
  text-align: center;
  margin-right: 20px;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: ${FONT_SIZES.lg};
`
