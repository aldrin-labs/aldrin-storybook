import React from 'react'
import styled from 'styled-components'
import FaFilter from '@material-ui/icons/FilterList'
import { Grid, Typography } from '@material-ui/core'
import ReactSelect from '@sb/components/ReactSelectComponent'
import Slider from '@sb/components/Slider/Slider'

export const SliderDustFilter = styled(Slider)`
  margin: 'auto 0';
`

export const Name = styled.h1`
  width: 100%;
  text-align: center;
  letter-spacing: 1px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2.5rem;
  padding: 0.5rem 0;
  text-align: center;
  color: ${(props: { color: string }) => props.color};
`

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const FilterValues = styled.div`
  width: 100%;
  display: flex;
  place-items: center;
  margin-bottom: 2rem;
`
export const FilterIcon = styled(FaFilter)`
  color: ${(props: { color: string }) => props.color};
  font-size: 1.5rem;
  margin: 0 0.5rem;
`

export const AccountsWalletsBlock = styled.div`
  font-family: ${(props: { fontFamily: string }) => props.fontFamily};
  min-width: 200px;
  background-color: ${(props: { background: string }) => props.background};
  padding: 16px;
  left: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? '0' : '-11.5rem'};
  cursor: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? 'auto' : 'pointer'};
  display: block;
  position: fixed;
  top: 0;
  z-index: 1008;
  height: 100vh;
  transition: right 0.2s ease-in;

  &:hover {
    background-color: ${({
      isSideNavOpen,
      background,
      hoverBackground,
    }: {
      isSideNavOpen: boolean
      background: string
      hoverBackground: string
    }) => (isSideNavOpen ? background : hoverBackground)};
  }
`

export const AddAccountBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
`

// export const TypographyTitle = styled(({ fontSize, ...rest }) => (
//   <Typography {...rest}/>
// ))`
export const TypographyTitle = styled(Typography)`
  font-family: 'DM Sans', sans-serif;
  font-size: ${(props) => props.fontSize || `0.75rem`};
  line-height: ${(props) => props.lineHeight || '35px'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#ABBAD1'};
  margin-left: 12px;
`

export const GridRow = styled(Grid)``
export const GridCell = styled(Grid)``

export const SliderContainer = styled(Grid)`
  display: flex;
  justify-content: center;
  margin-top: 35px;
  padding: 0 15px;
`
export const GridSection = styled(Grid)`
  border-bottom: 1px solid #e7ecf3;
  padding: 25px 0;
`
export const GridSectionAccounts = styled(Grid)`
  padding: 25px 0;
`

export const GridSectionDust = styled(Grid)`
  min-width: 380px;
  border-top: 1px solid #e7ecf3;
  padding: 25px 0;
  position: absolute;
  bottom: 0;
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
  margin-left: 10px;
`
export const GridSymbolContainer = styled(Grid)`
  min-width: 30px;
  color: #7284a0;
  font-size: 0.75rem;
  padding: 0 15px 0 0;
`
export const GridSymbolValue = styled(Grid)`
  min-width: 75px;
  color: #7284a0;
  font-size: 0.75rem;
  padding: 0 0 0 15px;
`

export const TypographySpan = styled(Typography)`
  font-size: 0.75rem;
  color: #165be0 !important;
`
