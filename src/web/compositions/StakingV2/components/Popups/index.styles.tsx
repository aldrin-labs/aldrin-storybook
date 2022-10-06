import { BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { CircleIconContainer, RootRow } from '../../index.styles'
import {
  RowType,
  BoxType,
  ColumnType,
  PeriodButtonType,
  ModalType,
} from './types'

export const StyledModal = styled.div`
  .modal-body {
    width: 39em;
    margin: 0;
    border-radius: 1.5em;
    background: ${(props) => props.theme.colors.gray7};
    padding: 0 1.5em;
  }
  .modal-content {
    height: 100%;
    width: 100%;
  }

  @media (max-width: ${BREAKPOINTS.xxxl}) {
    .modal-container {
      justify-content: flex-end;
    }
    .modal-body {
      border-radius: 1.5em 1.5em 0 0;
    }
  }

  @media (max-width: ${BREAKPOINTS.md}) {
    .rewards-row {
      width: 100%;
      flex-wrap: wrap;
    }
    .modal-container {
      height: calc(100% - 65px);
    }
    .modal-body {
      width: 100%;
      margin: 0;
      border-radius: 0;
      padding: 0 1.5em;
      height: 100%;
      max-height: 100%;
    }
  }
`

export const StyledPopupContainer = styled.div`
  width: 100%;
  border-radius: 0;
  bottom: 0;

  @media (min-width: ${BREAKPOINTS.sm}) {
    border-radius: 2em 2em 0 0;
    width: 35em;
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.white5};

  @media (min-width: ${BREAKPOINTS.sm}) {
    flex-direction: row;
    height: 7em;
  }

  @media (max-width: ${BREAKPOINTS.md}) {
    height: 7.4em;
    align-items: flex-start;
    padding-top: 1.5em;

    .links-row {
      margin-left: 2.6em;
    }
  }
`

export const Row = styled.div<RowType>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.padding || '0'};
  height: ${(props) => props.height || 'auto'};
  margin: ${(props) => props.margin || '0'};

  .stake-block {
    flex: 1;
  }

  .rewards-block {
    flex: 1;
    margin: 0 0 0 8px;
  }

  .token-icon {
    margin: 0 1em 0;
  }

  @media (min-width: ${BREAKPOINTS.sm}) {
    flex-direction: row;
    width: ${(props) => props.width || 'auto'};
  }

  @media (max-width: ${BREAKPOINTS.md}) {
    .stake-block {
      min-width: 100%;
      height: auto;
      margin-bottom: 1em;
    }

    .rewards-block {
      min-width: 100%;
      height: auto;
      margin: 0;
    }

    .token-icon {
      margin: 0 1em 0 0;
    }

    .escape-button {
      position: absolute;
      top: 20px;
      right: 0;
    }
  }
`

export const Box = styled.div<BoxType>`
  border-radius: 0.5em;
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '4.5em'};
  background: ${(props) => props.theme.colors.white5};
  border: 1px solid ${(props) => props.theme.colors.white4};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${(props) => props.padding || '0.5em 1em'};
`
export const Column = styled.div<ColumnType>`
  height: ${(props) => props.height || '100%'};
  width: ${(props) => props.width || 'auto'};
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  margin: ${(props) => props.margin || '0'};
  .stake-btn,
  .stake-st-btn {
    margin-bottom: 2em;
  }
  @media (max-width: ${BREAKPOINTS.md}) {
    .stake-st-btn {
      margin-bottom: 7em;
    }
  }
`
export const Container = styled.div`
  background: ${(props) => props.theme.colors.white4};
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.6em;
  padding: 0.5em;
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
export const ModalContainer = styled(StyledModal)<ModalType>`
  .modal-container {
    .modal-body {
      @keyframes modal {
        from {
          transform: translate(0, 30em);
        }
        to {
          transform: translate(0, 0);
        }
      }
      transform-origin: center center;
      animation-name: modal;
      animation-duration: 500ms;
      animation-iteration-count: 1;
      animation-timing-function: linear;
    }

    backdrop-filter: ${(props) => (props.needBlur ? 'blur(5px)' : 'none')};
    background: ${(props) => (props.needBlur ? 'rgba(0, 0, 0, 0.5)' : 'none')};
  }
`

export const RightCenteredRow = styled(RootRow)`
  justify-content: flex-end;
  width: 95%;
`
