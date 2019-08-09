import React from 'react'
import styled from 'styled-components'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,

  withStyles
} from '@material-ui/core'

export const ExpansionPanelCustom = styled(ExpansionPanel)`
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
`
// TODO : With distructering, Progressbar on transaction table will disappear
// export const ExpansionPanelSummaryCustom = styled(({border, ...rest}) => (<ExpansionPanelSummary {...rest} />))`
export const ExpansionPanelSummaryCustom = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.grey.light}`
  },
  content: {
    margin: '0 !important',
    flexGrow: 0
  },
  expandIcon: {
    position: 'static',
    marginTop: '2rem',
    padding: 0
  }
}))(ExpansionPanelSummary)

export const TypographyCustom = styled(Typography)`
  margin: auto;
  padding: 0;
  &:last-child {
    padding: 0;
  }
`
