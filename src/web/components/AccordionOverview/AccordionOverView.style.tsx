import React from 'react'
import styled from 'styled-components'
import {
  Grid,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  withStyles,
} from '@material-ui/core'

export const GridColumn = styled(Grid)`
padding: ${props => props.paddingCell};
  flex-basis: 16.66%;
  display: flex;
  padding: 0.76rem 0;
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
  border-left: 0.3rem solid #165be0;
  border-radius: 0.4rem 0px 0px 0.4rem;
  padding: 0.5rem 0 0.5rem 1rem;

  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
`

export const TypographySubHeading = styled(Typography)`
  padding-left: 1rem;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  line-height: 31px;
  color: #7284a0;
`

export const TypographyTitleCell = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 1rem;
  line-height: 2.4rem;
  margin-bottom: -0.528rem;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
  padding: ${props => props.paddingCell};

  @media only screen and (min-width: 2560px) {
    margin-bottom: 0;
  }
`
export const TypographyValueCell = styled(({ fontWeight, ...rest }) => (
  <Typography {...rest} />
))`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 600;
  letter-spacing: 0.1rem;
  font-size: 1.52rem;
  line-height: 39px;
  text-align: center;
  text-transform: uppercase;
  background: transparent;
  color: ${(props) => props.textColor || `#16253d`};
`

export const ExpansionPanelSummaryCustom = withStyles({
  root: {
    background: '#F9FBFD',
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid #E0E5EC',
  },

  content: {
    margin: '12px 0 0 0',
  },
})(ExpansionPanelSummary)

export const ExpansionPanelDetailsCustom = withStyles({
  root: {
    background: '#F9FBFD',
  },
})(ExpansionPanelDetails)

export const Title = styled('div')`
  padding-left: 15px;
`
