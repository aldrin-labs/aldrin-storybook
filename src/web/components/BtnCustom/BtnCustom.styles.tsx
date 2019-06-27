import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const BtnCustom = styled(Button)`
  width: ${props => props.btnWidth || "150px"};
  border: 2px solid ${props => props.btnColor || '#333'};
  border-radius: 23px;
  color: ${props => props.btnColor || '#333'}; 
  font-size: 11px;
  margin: ${props => props.margin || '5px 10px'};
`