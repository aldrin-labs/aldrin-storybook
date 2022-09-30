import { BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { Row } from '../index.styles'

type InputsContainerType = {
  margin?: string
}

type PeriodButtonType = {
  isActive: boolean
}

export const InputsContainer = styled.div<InputsContainerType>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  border-radius: 0.8em;
  padding: 0.8em 0;
  margin: ${(props) => props.margin || '0.5em 0 0 0'};
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
  padding: 0.8em;
  border-radius: 1em;
  margin-bottom: 0.8em;
  border: 1px solid ${(props) => props.theme.colors.white4};
  background: ${(props) => props.theme.colors.white5};
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
  border: 1px solid ${(props) => props.theme.colors.border2};
  border-radius: 0.8em;
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

export const BigNumber = styled.p`
  font-size: 1.6em;
  line-height: 1.3;
  font-weight: bold;
  margin: 10px 0;
  white-space: nowrap;
`

export const FormWrap = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  margin: 10px;
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

    .modal-content {
      overflow-y: scroll;
    }
  }
`
export const SRow = styled(Row)`
  width: 100%;
  margin: 1.25em 0;

  @media (max-width: ${BREAKPOINTS.md}) {
    flex-direction: column;
    .rewards-block,
    .stake-block {
      width: 100%;
      margin: 0.5em 0;
    }
  }
`

export const SpanContainer = styled.span`
  width: 100%;
`
