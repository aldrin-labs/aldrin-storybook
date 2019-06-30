import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const BtnCustom = styled(Button)`
  width: ${(props) => props.btnWidth || '215px'};
  border: 1px solid ${(props) => props.btnColor || props.color || '#333'};
  border-radius: ${(props) => props.borderRadius || `18px`};
  color: ${(props) => props.btnColor || props.color || '#333'};
  font-size: 10px;
  font-weight: bold;
  margin: ${(props) => props.margin || '0px'};
  padding: ${(props) => props.padding || '3px 0px'};
`
