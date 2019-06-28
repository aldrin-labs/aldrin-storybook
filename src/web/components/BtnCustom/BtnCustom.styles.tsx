import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const BtnCustom = styled(Button)`
  width: ${props => props.btnWidth || "250px"};
  border: 1px solid ${props => props.btnColor || '#333'};
  border-radius: ${props => props.borderRadius || `18px`};
  color: ${props => props.btnColor || '#333'}; 
  font-size: 11px;
  font-weight: bold;
  margin: ${props => props.margin || '5px 10px'};
`