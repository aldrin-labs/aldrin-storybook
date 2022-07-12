import { BREAKPOINTS, FONT_SIZES } from '@variables/variables'
import styled from 'styled-components'

import { Button, PADDINGS } from '@sb/components/Button'
import { StretchedBlock, WideContent } from '@sb/components/Layout'

export const RootRow = styled.div`
  height: ${(props) => props.height || 'auto'};
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;

  @media (min-width: ${BREAKPOINTS.sm}) {
    flex-direction: row;
  }
`
export const StyledWideContent = styled(WideContent)`
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
export const FilterButton = styled(Button)`
  color: ${(props) => props.theme.colors.gray3};
  border: none;
  background-color: ${(props) => props.theme.colors.gray7};
  border-radius: 0.6em;
  color: ${(props) => props.theme.colors.gray13};
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
  margin: 40px auto;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: 100%;
  }
`
