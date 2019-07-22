import React from 'react'
import styled from 'styled-components'
import ReactSelect from '@sb/components/ReactSelectComponent'
import { Typography, Grid } from '@material-ui/core'

export const GridFlex = styled(Grid)`
  display: flex;
`

export const GridInfoPanelWrapper = styled(Grid)`
  position: sticky;
  top: 0;
  border-top: 2px solid #e7ecf3;
  border-bottom: 2px solid #e7ecf3;
  background-color: #f9fbfd;
  padding: 16px 2px 0px 2px;
  z-index: 500;
  margin-bottom: 10px;
`

export const TypographyRebalance = styled(
  ({ linkColor, position, verticalPosition, ...rest }) => (
    <Typography {...rest} />
  )
)`
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 1px;
  font-size: 0.6875rem;
  padding: 0 5px;
  margin-right: 3px;
  text-transform: uppercase;
  color: ${(props) => props.linkColor || 'white'};
  text-align: ${(props) => props.position || 'none'};
  align-self: ${(props) => props.verticalPosition || 'none'};
`

export const StyledTypography = styled(
  ({
    fontWeight,
    counterColor,
    prymaryColor,
    secondaryColor,
    position,
    ...rest
  }) => <Typography {...rest} />
)`
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 1px;
  font-size: 0.625rem;
  line-height: 23px;
  font-weight: ${(props) => props.fontWeight || '400'};
  text-transform: uppercase;
  color: ${(props) =>
    props.counterColor ||
    props.prymaryColor ||
    props.secondaryColor ||
    '#7284A0'};
  text-align: ${(props) => props.position || 'none'};
`

export const StyledSubTypography = styled(
  ({
    fontSize,
    fontWeight,
    color,
    counterColor,
    position,
    secondaryColor,
    primaryColor,
    ...rest
  }) => <Typography {...rest} />
)`
  font-size: ${(props) => props.fontSize || `1rem`};
  font-weight: ${(props) => props.fontWeight || '400'};
  line-height: 23px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) =>
    props.color ||
    props.counterColor ||
    props.secondaryColor ||
    props.primaryColor ||
    '#7284A0'};
  text-align: ${(props) => props.position || 'none'};
`

export const ReactSelectCustom = styled(ReactSelect)`
  font-family: 'DM Sans', sans-serif;
  width: 100px;
  font-size: 0.75rem;
  text-transform: uppercase;
  border: 1px solid transparent;
  font-weight: 700;
  letter-spacing: 1px;
  background: transparent;
`
