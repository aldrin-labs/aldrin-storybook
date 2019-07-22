import React from 'react'
import styled from 'styled-components'
import { Grid, ExpansionPanel, Typography } from '@material-ui/core'

export const GridFlex = styled(Grid)`
  display: flex;
`

export const TypographyCustom = styled(({ fontWeight, ...rest }) => (
  <Typography {...rest} />
))`
  font-weight: ${(props) => props.fontWeight || '500'};
  text-transform: uppercase;
`

export const ExpansionPanelWrapper = styled(ExpansionPanel)`
  margin-bottom: 20px;
  padding: 7px 0;
  border-radius: 50%;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.29);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.29);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.29);

  &&:first-child {
    border-radius: 16px;
  }
  &&:last-child {
    border-radius: 16px;
  }
`

export const GridItemHeadingCustom = styled(
  ({ fontSize, borderColor, ...rest }) => <Grid {...rest} />
)`
  font-size: ${(props) => props.fontSize || `12px`};
  border-left: 3px solid ${(props) => props.borderColor || '#fff'};
  align-self: center;
  padding: 5px 0 5px 20px;
`

export const StyledTypography = styled(
  ({
    fontSize,
    fontWeight,
    primaryColor,
    color,
    position,
    marginLeft,
    ...rest
  }) => <Typography {...rest} />
)`
  font-family: 'DM Sans';
  text-align: center;
  font-size: ${(props) => props.fontSize || `10px`};
  font-weight: ${(props) => props.fontWeight || `500`};
  line-height: 25px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.primaryColor || props.color || '#7284A0'};
  text-align: ${(props) => props.position || 'none'};
  margin-left: ${(props) => props.marginLeft};
`

export const StyledTypographyAccordionHeader = styled(
  ({ fontWeight, primaryColor, color, marginLeft, ...rest }) => (
    <Typography {...rest} />
  )
)`
  text-align: center;
  font-weight: ${(props) => props.fontWeight || `500`};
  line-height: 25px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.primaryColor || props.color || '#7284A0'};
  margin-left: ${(props) => props.marginLeft};
  text-align: left;
  font-size: 14px;
  border-left: 5px solid orange;
  border-radius: 3px 0 3px 0;
  padding-left: 24px;
`

export const StyledSubTypography = styled(
  ({ color, primaryColor, position, ...rest }) => <Typography {...rest} />
)`
  font-family: 'DM Sans';
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.primaryColor || props.color || '#97c15c'};
  text-align: ${(props) => props.position || 'none'};
`
