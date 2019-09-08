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
  border-bottom: ${(props) => `1px solid ${props.borderColor}`};
  background-color: ${(props) => props.bgColor};
  padding: 1.6rem 1.6rem 0.4rem;
  z-index: 500;
  margin-bottom: 10px;

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    align-items: center;
  }
`

export const TypographyRebalance = styled(
  ({ linkColor, position, verticalPosition, ...rest }) => (
    <Typography {...rest} />
  )
)`
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 1px;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0 5px;
  margin-right: 5px;
  text-transform: uppercase;
  color: ${(props) => props.linkColor || 'white'};
  text-align: ${(props) => props.position || 'none'};
  align-self: ${(props) => props.verticalPosition || 'none'};
  border-right: 1px solid #e0e5ec;

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    //font-size: 1.8rem;
  }
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
  font-size: ${(props) => props.fontSize || '1rem'};
  line-height: 23px;
  font-weight: ${(props) => props.fontWeight || '400'};
  text-transform: uppercase;
  color: ${(props) =>
    props.counterColor ||
    props.prymaryColor ||
    props.secondaryColor ||
    '#7284A0'};
  text-align: ${(props) => props.position || 'none'};
  white-space: ${(props) => props.whiteSpace || 'normal'};

  @media only screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    padding-bottom: 1rem;
  }
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
  font-size: ${(props) => props.fontSize || `1.4rem`};
  font-weight: ${(props) => props.fontWeight || '400'};
  line-height: ${(props) => props.lineHeight || '23px'};
  letter-spacing: ${(props) => props.letterSpacing || '1px'};
  margin: ${(props) => props.margin || '.25rem 0 0 0'};
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
  font-size: 0.95rem;
  text-transform: uppercase;
  border: 1px solid transparent;
  font-weight: 700;
  letter-spacing: 1px;
  background: transparent;

  .custom-select-box__indicator {
    position: relative;
    top: 0;
    left: -3rem;
  }
`
