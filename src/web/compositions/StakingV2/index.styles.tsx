import { BORDER_RADIUS, BREAKPOINTS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

import { Button, PADDINGS } from '@sb/components/Button'
import { StretchedBlock, WideContent } from '@sb/components/Layout'

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
  margin-top: 2em;
  margin-bottom: 3em;
`

export const TotalStakedCard = styled.div`
  overflow: hidden;
  position: relative;
  width: 24%;
  height: 6em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-image: linear-gradient(25deg, #d64c7f, #ee4758 50%);
  border-radius: 18px;
  padding: 0.8em;
  box-shadow: 2px 17px 70px 3px rgba(174, 46, 33, 0.4);

  @media only screen and (max-width: 600px) {
    width: 70%;
  }
`

export const ThinHeading = styled.div`
  font-family: 'Prompt';
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 20px;
  /* identical to box height, or 143% */

  letter-spacing: -0.0015em;

  /* Dark Mode/D1 */

  color: #fafafa;
`

export const TotalStaked = styled.div`
  font-family: 'Prompt';
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  /* identical to box height, or 120% */

  letter-spacing: 0.0037em;

  /* Dark Mode/D1 */

  color: #fafafa;
`
