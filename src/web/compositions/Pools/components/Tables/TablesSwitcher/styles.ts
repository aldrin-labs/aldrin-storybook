import { Theme } from '@material-ui/core'
import {
  BORDER_RADIUS,
  BREAKPOINTS,
  UCOLORS,
  FONT_SIZES,
} from '@variables/variables'
import styled from 'styled-components'

import { Button } from '@sb/components/Button'
import { Input } from '@sb/components/Input'

type TableModeButtonProps = {
  isActive: boolean
  theme: Theme
  fontSize?: string
}

export const TableModeButton = styled.button`
  border: none;
  border-bottom: ${(props: TableModeButtonProps) =>
    props.isActive
      ? `.2rem solid ${props.theme.colors.white1}`
      : `.3rem solid transparent`};

  background: inherit;
  color: ${(props: TableModeButtonProps) =>
    props.isActive ? props.theme.colors.white1 : props.theme.colors.white1};
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
  border: 0.1rem solid ${(props) => props.theme.colors.white4};
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
  background-color: ${(props) => props.theme.colors.persistent.blue1};
  border: none;
  color: white;
  transition: 0.3s;

  &:hover {
    background: ${UCOLORS.blue4};
  }

  @media (min-width: ${BREAKPOINTS.md}) {
    margin-right: 20px;
  }
`

export const IconWrap = styled.div`
  margin-left: auto;
  width: 1.8rem;
  height: 1.8rem;
  svg {
    path {
      fill: ${(props) => props.theme.colors.white1};
    }
  }
`
