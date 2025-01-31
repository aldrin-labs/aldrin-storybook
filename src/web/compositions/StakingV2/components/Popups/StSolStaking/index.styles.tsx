import { FONT_SIZES, BORDER_RADIUS, BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

type CircleIconContainerType = {
  size?: string
}

type PeriodButtonType = {
  isActive: boolean
}

type LabelType = {
  weight?: string
  size?: string
  padding?: string
}

export const CircleIconContainer = styled.div<CircleIconContainerType>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.size || '2em'};
  height: ${(props) => props.size || '2em'};
  background: ${(props) => props.theme.colors.gray7};
  border-radius: 50%;
  font-family: Avenir Next Bold;
  color: ${(props) => props.theme.colors.gray0};
  line-height: ${(props) => props.size || '2em'};
`

export const PositionatedIconContainer = styled(CircleIconContainer)`
  position: absolute;
  left: 50%;
  top: 50%;
  border: 1px solid ${(props) => props.theme.colors.white4};
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

export const MainContainer = styled.div`
  @media (max-width: ${BREAKPOINTS.md}) {
    .modal-container {
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      z-index: 101;
    }

    .modal-body {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
    }

    .apy-row {
      width: 100%;
    }

    .rate-row {
      width: 100%;
      flex-wrap: wrap;
    }

    .rate-box {
      margin-bottom: 1em;
    }

    .fee-box,
    .rate-box {
      width: 100%;
    }
  }
`
