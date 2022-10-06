import { FONT_SIZES, BORDER_RADIUS, BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { CircleIconContainer } from '@sb/compositions/StakingV2/index.styles'

import { Row } from '../index.styles'
import { LabelType, PeriodButtonType } from '../types'

export const PositionatedIconContainer = styled(CircleIconContainer)`
  position: absolute;
  left: 50%;
  top: 50%;
  border: 1px solid ${(props) => props.theme.colors.white4};
  background: ${(props) => props.theme.colors.white5};
  transform: translate(-50%, -50%);
  z-index: 2;

  svg {
    width: 1.2em;
    height: auto;
    path {
      fill: ${(props) => props.theme.colors.gray0};
    }
  }
`
export const InputsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  border: 1px solid ${(props) => props.theme.colors.white4};
  border-radius: 0.8em;
  padding: 0.8em 0;
  margin: 0.5em 0 0 0;
  background: ${(props) => props.theme.colors.white5};
`

export const FirstInputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 0 0 0.8em 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.white4};
`

export const SecondInputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 0.8em 0 0 0;
`

export const PeriodSwitcher = styled.div`
  display: flex;
  flex-direction: row;
  width: auto;
  background: ${(props) => props.theme.colors.white5};
  border-radius: 0.5em;
  height: auto;
`
export const PeriodButton = styled.div<PeriodButtonType>`
  width: 1.5em;
  background: ${(props) =>
    props.isActive ? props.theme.colors.border2 : props.theme.colors.white5};
  border-radius: 0.5em;
  height: 1.5em;
  padding: 0.3em;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  span {
    color: ${(props) =>
      props.isActive ? props.theme.colors.gray0 : props.theme.colors.gray1};
    font-weight: ${(props) => (props.isActive ? 600 : 400)};
  }
`

export const Container = styled.div`
  background: ${(props) => props.theme.colors.green8};
  color: ${(props) => props.theme.colors.green4};
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 36px;
  padding: 0 8px;
  width: auto;
  border-radius: ${BORDER_RADIUS.md};
  font-weight: 600;
`

export const Label = styled.span<LabelType>`
  font-weight: ${(props) => props.weight || '400'};
  padding: ${(props) => props.padding || '0 0 0 0.25em'};
  font-size: ${(props) => props.size || FONT_SIZES.md};
`
export const LabelsRow = styled(Row)`
  width: 100%;
  margin: 2em 0 1em 0;

  @media (max-width: ${BREAKPOINTS.md}) {
    div {
      width: 49%;
      justify-content: center;
    }
  }
`

export const AdditionalInfoRow = styled(Row)`
  margin: 1em 0;
  width: 100%;

  @media (max-width: ${BREAKPOINTS.md}) {
    flex-direction: column;
    .rate-box {
      margin-bottom: 1em;
    }
    div {
      width: 100%;

      div {
        justify-content: space-between;

        div {
          width: auto;
        }
      }
    }
  }
`
