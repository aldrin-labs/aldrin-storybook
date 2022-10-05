import { BORDER_RADIUS, BREAKPOINTS, FONT_SIZES } from '@variables/variables'
import { rgba } from 'polished'
import styled from 'styled-components'

import { Button, PADDINGS } from '@sb/components/Button'
import { StretchedBlock, WideContent } from '@sb/components/Layout'

import Bg from './components/YourPools/components/assets/bg.png'

type FilterButtonType = {
  isActive: boolean
}

type RootRowType = {
  height?: string
  width?: string
  margin?: string
  align?: string
  $justify?: string
}

type LineProps = {
  $height?: string
}

export const RootRow = styled.div<RootRowType>`
  height: ${(props) => props.height || 'auto'};
  display: flex;
  justify-content: ${(props) => props.$justify || 'space-between'};
  flex-direction: column;
  align-items: ${(props) => props.align || 'center'};
  margin: ${(props) => props.margin || '30px 0'};
  width: ${(props) => props.width || 'auto'};

  @media (min-width: ${BREAKPOINTS.sm}) {
    flex-direction: row;
    width: 100%;
  }
`

export const RootColumn = styled.div<RootRowType>`
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  display: flex;
  justify-content: ${(props) => props.$justify || 'space-between'};
  flex-direction: column;
  align-items: flex-start;
  margin: ${(props) => props.margin || '0'};
`

export const SpacedColumn = styled(RootColumn)<RootRowType>`
  justify-content: space-around;
`

export const StyledWideContent = styled(WideContent)`
  margin: 0 auto;

  @media (min-width: ${BREAKPOINTS.xl}) {
    max-width: ${BREAKPOINTS.xl};
    margin: 0 auto;
  }
`
export const ButtonsContainer = styled(StretchedBlock)`
  width: 90%;
  margin-top: 1em;
  @media (min-width: ${BREAKPOINTS.md}) {
    margin-top: 0;
    min-width: 25%;
    width: auto;
  }
`
export const FilterButton = styled(Button)<FilterButtonType>`
  color: ${(props) => props.theme.colors.white3};
  border: none;
  background-color: ${(props) =>
    props.isActive
      ? rgba(props.theme.colors.violet2, 0.15)
      : props.theme.colors.white6};
  border-radius: 0.6em;
  color: ${(props) =>
    props.isActive ? props.theme.colors.violet2 : props.theme.colors.white3};
  font-size: ${FONT_SIZES.sm};
  padding: 0.66em 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    margin-right: 5px;
  }
`
export const SButton = styled(Button)`
  padding: ${PADDINGS.xxl};
  font-size: ${FONT_SIZES.md};

  @media (min-width: ${BREAKPOINTS.sm}) {
    padding: ${PADDINGS.xl};
    font-size: ${FONT_SIZES.sm};
  }
`
export const FilterRow = styled(RootRow)`
  width: 90%;
  flex-direction: row;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: 100%;
  }
`
export const GrayContainer = styled.div`
  width: 90%;
  position: relative;
  background: ${(props) => props.theme.colors.white6};
  border-radius: ${BORDER_RADIUS.lg};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 1em;
  height: 8em;
  padding: 1em 1.5em;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: 48%;
    min-height: 7em;
    height: auto;
    margin: 0;
  }
`
export const Line = styled.div<LineProps>`
  height: ${(props) => props.$height || '100%'};
  background: none;
  border-left: 1px solid ${(props) => props.theme.colors.white4};
`

export const BannerBg = styled.div`
  width: 100%;
  height: 70%;
  border-radius: 16px;
  background-image: url(${Bg});
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
`
export const Container = styled.div`
  background: ${(props) => props.theme.colors.white5};
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.6em;
  padding: 0.5em;
`
