import React from 'react'
import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'
import ReactSelect from '@sb/components/ReactSelectComponent'

export const ReactSelectCustom = styled(ReactSelect)`
  font-family: 'DM Sans', sans-serif;
  width: 100px;
  font-size: 0.75rem;
  text-transform: uppercase;
  border: 1px solid transparent;
  font-weight: 700;
  letter-spacing: 1px;
  background: transparent;
  margin-left: 10px;
`

export const GridContainerTitle = styled(Grid)`
  display: flex;
  width: 100%;
  border-radius: 20px 20px 0 0;
  background: #f2f4f6;
  margin-bottom: 8px;
`

export const GridItemContainer = styled(Grid)`
  //min-height: 200px;
  box-shadow: 0px 0px 15px 0px rgba(30, 30, 30, 0.2);
  border-radius: 20px;
`

export const ContentGrid = styled(Grid)`
  padding: 0 15px;
  margin-top: 25px;
`

export const TypographyContatinerTitle = styled(Typography)`
  margin-top: 10px;
  color: #16253d;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  width: 100%;
  text-align: ${(props) => props.textAlign || 'center'};
  height: 24px;
  padding: ${(props) => props.textPadding};
`

export const TypographyAccountTitle = styled(Typography)`
  font-family: DM Sans;
  font-size: ${(props) => props.fontSize || `0.75rem`};
  line-height: ${(props) => props.lineHeight || '35px'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#7284A0'};
  margin-left: 10px;
`

export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-size: ${(props) => props.fontSize || `0.75rem`};
  line-height: ${(props) => props.lineHeight || '35px'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#ABBAD1'};
  margin-left: 12px;
`

export const GridShowHideDataContainer = styled(Grid)`
  position: absolute;
  bottom: 0;
  min-width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center;
`

export const TypographyCalendarLegend = styled(Typography)`
  padding: '0 10px';
  font-size: '0.5625rem';
  text-align: ${(props) => props.textAlign};
`

export const GridAccountContainer = styled(Grid)`
  min-height: 130px;
  box-shadow: 0px 0px 15px 0px rgba(30, 30, 30, 0.2);
  border-radius: 20px;
  position: relative;
`
