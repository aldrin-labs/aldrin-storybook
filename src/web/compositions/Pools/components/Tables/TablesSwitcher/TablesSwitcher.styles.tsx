import styled from 'styled-components'
import { Theme } from '@material-ui/core'

type TableModeButtonProps = {
  isActive: boolean
  theme: Theme
}

export const TableModeButton = styled.button`
  border: none;
  border-bottom: ${(props: TableModeButtonProps) =>
    props.isActive
      ? `.3rem solid ${props.theme.palette.white.primary}`
      : `.3rem solid ${props.theme.palette.dark.background}`};

  background: inherit;
  color: ${(props: TableModeButtonProps) =>
    props.isActive ? '#f5f5f5' : '#93A0B2'};
  padding: 0.4rem 0;
  margin: 0 1.6rem 0 0;

  font-size: 1.4rem;
  font-family: Avenir Next Demi;
  text-transform: capitalize;
  cursor: pointer;
`
