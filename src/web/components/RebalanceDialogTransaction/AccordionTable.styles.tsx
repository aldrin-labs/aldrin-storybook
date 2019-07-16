import React from 'react'
import styled from 'styled-components'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
} from '@material-ui/core'

export const ExpansionPanelCustom = styled(ExpansionPanel)`
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
`

// export const ExpansionPanelSummaryCustom = styled((border, ...rest) => (
//   <ExpansionPanelSummary {...rest} />
// ))`
export const ExpansionPanelSummaryCustom = styled(ExpansionPanelSummary)`
  border-top: ${(props) => props.border};
`

export const TypographyCustom = styled(Typography)`
  margin: auto;
  padding: 0;
`
