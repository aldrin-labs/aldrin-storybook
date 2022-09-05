import { rgba } from 'polished'
import styled from 'styled-components'

type BalanceLineProps = {
  width?: string
  needRotate?: boolean
}

type BalanceType = {
  needRotate?: boolean
}

export const LineContainer = styled.div<BalanceType>`
  width: ${(props) => (props.needRotate ? '30%' : '100%')};
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  transform: ${(props) => (props.needRotate ? 'rotate(90deg)' : 'none')};
`
export const FirstPart = styled.div<BalanceLineProps>`
  width: ${(props) => props.width || '50%'};
  height: 0;
  border-top: ${(props) =>
    `${props.needRotate ? '5px' : '3px'} solid  ${props.theme.colors.green2}`};
  border-top-left-radius: ${(props) => (props.needRotate ? '3px' : '0')};
  border-bottom-left-radius: ${(props) => (props.needRotate ? '3px' : '0')};
`
export const SecondPart = styled.div<BalanceLineProps>`
  width: ${(props) => props.width || '50%'};
  height: 0;
  border-top: ${(props) =>
    `${props.needRotate ? '5px' : '3px'} solid  ${rgba(
      props.theme.colors.green2,
      0.5
    )}`};
  border-top-right-radius: ${(props) => (props.needRotate ? '3px' : '0')};
  border-bottom-right-radius: ${(props) => (props.needRotate ? '3px' : '0')};
`
