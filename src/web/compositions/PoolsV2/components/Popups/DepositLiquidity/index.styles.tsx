import styled from 'styled-components'

import { StyledModal } from '../index.styles'

type CircleIconContainerType = {
  size?: string
}

type PeriodButtonType = {
  isActive: boolean
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
  border: 1px solid ${(props) => props.theme.colors.border2};
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
  border: 1px solid ${(props) => props.theme.colors.border2};
  border-radius: 0.8em;
  padding: 0.8em 0;
  margin: 0.5em 0 0 0;
  background: ${(props) => props.theme.colors.gray7};
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
  border-bottom: 1px solid ${(props) => props.theme.colors.border2};
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
  background: ${(props) => props.theme.colors.gray8};
  border-radius: 0.5em;
  height: auto;
`
export const PeriodButton = styled.div<PeriodButtonType>`
  width: 1.5em;
  background: ${(props) =>
    props.isActive ? props.theme.colors.border2 : props.theme.colors.gray8};
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
export const ModalContainer = styled(StyledModal)`
  .modal-container {
    backdrop-filter: none;
    background: none;
  }
`
