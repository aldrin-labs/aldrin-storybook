import styled from 'styled-components'
import { Grid } from '@material-ui/core'
import { HeaderProperties, BlockProperties } from './types'

export const TerminalBlocksContainer = styled(Grid)`
  padding-top: 1rem;
`

export const TerminalHeaders = styled.div`
  display: flex;
  position: relative;
`

export const TerminalHeader = styled.div`
  width: ${(props: HeaderProperties) => props.width};
  padding: ${(props: HeaderProperties) => props.padding || '.8rem 1.5rem'};
  margin: ${(props: HeaderProperties) => props.margin || '0'};

  background: #f2f4f6;
  border: 0.1rem solid #e0e5ec;
  border-radius: 0.2rem;

  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #16253d;

  & span {
    border-bottom: 0.1rem dashed #5c8cea;
  }
`

export const CloseHeader = styled(TerminalHeader)`
  position: absolute;
  right: 0;
  cursor: pointer;
`

export const TerminalBlock = styled(Grid)`
  width: ${(props: BlockProperties) => props.width};
  position: relative;
  border-right: 0.1rem solid #abbad1;
`
