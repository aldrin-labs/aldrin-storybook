import styled from 'styled-components'
import FaFilter from '@material-ui/icons/FilterList'
import { Grid, Typography } from '@material-ui/core'
import ReactSelect from '@sb/components/ReactSelectComponent'
import Slider from '@sb/components/Slider/Slider'

export const SliderDustFilter = styled(Slider)`
  position: relative;
  top: 7px;
  left: 0;

  @media (min-width: 1921px) {
    top: 12px;
    width: 80%;

    .trackAfter {
      height: 1.8rem;
    }

    .thumb {
      height: 1.8rem;
      width: 1.8rem;
    }
  }
`

export const Name = styled.h1`
  width: 100%;
  text-align: center;
  letter-spacing: 1px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4rem;
  padding: 0.8rem 0;
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
  margin-bottom: 3.2rem;
`
export const FilterIcon = styled(FaFilter)`
  color: ${(props: { color: string }) => props.color};
  font-size: 2.4rem;
  margin: 0 0.8rem;
`

export const AccountsWalletsBlock = styled.div`
  font-family: ${(props: { fontFamily: string }) => props.fontFamily};
  min-width: 200px;
  background-color: ${(props: { background: string }) => props.background};
  left: ${({ isSideNavOpen }: { isSideNavOpen: boolean }) =>
    isSideNavOpen ? '0' : '-18.4rem'};
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
  margin: 3.2rem 0;
`

// export const TypographyTitle = styled(({ fontSize, ...rest }) => (
//   <Typography {...rest}/>
// ))`
export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-size: ${(props) => props.fontSize || `1.25rem`};
  line-height: ${(props) => props.lineHeight || '3rem'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #fff;
  margin-left: 10px;
`

export const GridRow = styled(Grid)``
export const GridCell = styled(Grid)``

export const SliderContainer = styled(Grid)`
  display: flex;
  justify-content: center;
  margin-top: 35px;
  padding: 0 15px;
  height: 2rem;
`
export const GridSection = styled(Grid)`
  padding: 1rem 0;
  margin-bottom: 2rem;
  position: relative;
`
export const GridSectionAccounts = styled(Grid)`
  padding: 2.4rem 1.6rem;
`

export const GridSectionDust = styled(Grid)`
  width: 37rem;
  border-top: 1px solid #e7ecf3;
  padding: 2.4rem 1.6rem;
  position: absolute;
  bottom: 0;
  z-index: 1;
`

export const ReactSelectCustom = styled(ReactSelect)`
  font-family: 'DM Sans', sans-serif;
  width: 100px;
  font-size: 1.2rem;
  text-transform: uppercase;
  border: 1px solid transparent;
  font-weight: 700;
  letter-spacing: 1px;
  background: transparent;
  margin-left: 10px;
`
export const GridSymbolContainer = styled(Grid)`
  width: 10%;
  color: #7284a0;
  font-size: 1.2rem;
  padding: 0 15px 0 0;

  @media (min-width: 1921px) {
    margin-right: 1rem;
    font-size: 1.4rem;
  }
`
export const GridSymbolValue = styled(Grid)`
  width: 10%;
  color: #7284a0;
  font-size: 1.2rem;
  padding: 0 0 0 15px;
  white-space: nowrap;

  @media (min-width: 1921px) {
    padding: 0;
    font-size: 1.4rem;
  }
`

export const TypographySpan = styled(Typography)`
  font-size: 1.2rem;
  color: #165be0 !important;
`
