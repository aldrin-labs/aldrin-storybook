import React from 'react'
import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'
import ReactSelect from '@sb/components/ReactSelectComponent'

export const GridPageContainer = styled(Grid)`
  padding-top: 15px;
`

export const TypographySearchOption = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  padding-right: 3px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
`

export const PortfolioName = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 0;
  color: ${(props) => props.textColor};
`

export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: ${(props) => props.fontSize || '0.9rem'};
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#7284a0'};
  padding: ${(props) => props.paddingText};
  margin: ${(props) => props.marginText};
`
export const TypographyPercentage = styled(Typography)`
  color: ${(props) => props.textColor || '#7284a0'};
`

export const FolioValuesCell = styled(Grid)`
  height: 48px;
  width: 92px;
  text-align: center;
  background: ${(props) => props.bgColor || '#F9FBFD'};
  border: ${(props) => props.borderCell || '1px solid #E0E5EC'};
  border-radius: ${(props) => props.borderRadius || '12px'};

  display: flex;
  justify-content: center;
  align-items: center;
`

export const ReactSelectCustom = styled(ReactSelect)`
  font-family: DM Sans, sans-serif;
  width: 100px;
  font-size: 1.2rem;
  text-transform: uppercase;
  border: 1px solid transparent;
  font-weight: 700;
  letter-spacing: 1px;
  background: transparent;
`
export const GridSortOption = styled(Grid)`
  height: 33px;
  padding: 0 12px;
  border-left: 1px solid #e0e5ec;
  border-right: 1px solid #e0e5ec;
`

export const GridTableContainer = styled(Grid)``
export const FolioCard = styled(Grid)`
  height: 140px;
`

export const GridPortfolioContainer = styled(Grid)`
  /* display: flex;
  justify-content: center;
  padding: 15px; */
`

export const GridFolioScroll = styled(Grid)`
  padding: 0;
  height: 100vh;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`
