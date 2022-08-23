import { BORDER_RADIUS, BREAKPOINTS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

import { Button, PADDINGS } from '@sb/components/Button'
import { StretchedBlock, WideContent } from '@sb/components/Layout'

import bg from './Components/Icons/bg.png'

type FilterButtonType = {
  isActive: boolean
}

type RootRowType = {
  height?: string
  width?: string
  margin?: string
  align?: string
}

export const RootRow = styled.div<RootRowType>`
  height: ${(props) => props.height || 'auto'};
  display: flex;
  justify-content: space-between;
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
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: ${BREAKPOINTS.md}) {
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin: ${(props) => props.margin};
  }
`

export const SpacedColumn = styled(RootColumn)<RootRowType>`
  justify-content: space-around;
  min-width: 12%;
  align-items: flex-start;

  @media (max-width: ${BREAKPOINTS.md}) {
    justify-content: space-between;
  }
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
  @media (min-width: ${BREAKPOINTS.xl}) {
    margin-top: 0;
    min-width: 25%;
    width: auto;
  }
`
export const FilterButton = styled(Button)<FilterButtonType>`
  color: ${(props) => props.theme.colors.gray3};
  border: none;
  background-color: ${(props) =>
    props.isActive ? props.theme.colors.violet2 : props.theme.colors.gray7};
  border-radius: 0.6em;
  color: ${(props) =>
    props.isActive ? props.theme.colors.violet4 : props.theme.colors.gray13};
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
  background: ${(props) => props.theme.colors.gray7};
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

export const TotalStakedRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
  margin-bottom: 1em;
  @media only screen and (max-width: 600px) {
    width: 90%;
    margin: 1em auto;
  }
`

export const TotalStakedCard = styled.div`
  overflow: hidden;
  position: relative;
  width: 24%;
  height: 7em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-image: url(${bg});
  background-size: cover;
  border-radius: 18px;
  padding: 0.8em 1em;
  box-shadow: -3px 3px 35px 10px rgba(145, 41, 122, 0.3);
  @media only screen and (max-width: 600px) {
    width: 90%;
    margin: 1em auto;
    position: absolute;
  }
`

export const ThinHeading = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 0.6em;

  /* identical to box height, or 143% */

  letter-spacing: -0.0015em;

  /* Dark Mode/D1 */

  color: #fafafa;
`

export const TotalStaked = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: 0.0037em;

  /* Dark Mode/D1 */

  color: #fafafa;

  @media only screen and (max-width: 600px) {
    font-size: 30px;
  }
`
export const ImageContainer = styled.div`
  width: 150px;
  height: 150px;
  position: relative;

  img {
    position: absolute;
    left: 20%;
  }

  @media only screen and (max-width: 600px) {
    width: 120px;
    height: 120px;
    left: 60%;
  }
`
