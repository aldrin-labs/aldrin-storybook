import styled from 'styled-components'

type BalanceLineProps = {
  width?: string
}

export const LineContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
`
export const FirstPart = styled.div<BalanceLineProps>`
  width: ${(props) => props.width || '50%'};
  height: 0;
  border-top: 3px solid ${(props) => props.theme.colors.green2};
`
export const SecondPart = styled.div<BalanceLineProps>`
  width: ${(props) => props.width || '50%'};
  height: 0;
  border-top: 3px solid ${(props) => props.theme.colors.green10};
`
