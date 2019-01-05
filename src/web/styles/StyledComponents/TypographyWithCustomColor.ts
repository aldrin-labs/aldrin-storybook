import styled from 'styled-components'
import { Typography } from '@material-ui/core'

export const TypographyWithCustomColor = styled(Typography)`
  color: ${(props: { textColor?: string }) => props.textColor};
`
