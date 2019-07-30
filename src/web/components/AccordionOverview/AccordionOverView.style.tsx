import React from 'react'
import styled from 'styled-components'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { Grid, ExpansionPanel, Typography } from '@material-ui/core'

export const GridColumn = styled(Grid)`
  flex-basis: 16.66%;
  display: flex;
  align-items: center;
`
export const GridRow = styled(Grid)`
  min-width: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  &&:nth-child(2n-1) {
    background: ${(props) => props.hoverColor || '#e0e5ec'};
    border-radius: 20px;
  }
`

export const TypographyHeading = styled(Typography)`
  border-left: 3px solid #165be0;
  border-radius: 4px 0px 0px 4px;
  padding-left: 15px;

  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
`

export const TypographySubHeading = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  line-height: 31px;
  color: #7284a0;
`

export const TypographyTitleCell = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 0.5625rem;
  line-height: 23px;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
`
export const TypographyValueCell = styled(({ fontWeight, ...rest }) => (
  <Typography {...rest} />
))`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 0.9375rem;
  line-height: 39px;
  text-align: center;
  text-transform: uppercase;
  background: transparent;
  color: ${(props) => props.textColor || `#16253d`};
`
export const ExpansionPanelSummaryCustom = styled(ExpansionPanelSummary)`
  background: transparent;
  display: flex;
  align-items: center;
`

export const Title = styled('div')`
  padding-left: 15px;
`;
