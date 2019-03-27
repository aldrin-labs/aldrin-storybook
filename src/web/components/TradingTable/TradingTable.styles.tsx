import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const TitleSecondRowContainer = styled.div`
  align-items: center;
  display: flex;
`

export const TitleButton = styled(Button)`
  && {
    border: ${(props: { isActive: boolean, secondary: string }) => props.isActive ? `2px solid ${props.secondary}` : ''};
    margin: 7px;
    max-height: 30px;
  }
`
