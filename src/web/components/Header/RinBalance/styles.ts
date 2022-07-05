import styled from 'styled-components'

export const RinBalanceContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  background-color: ${(props) => props.theme.colors.gray7};
  height: 2.5em;
  margin-left: 1em;
  padding: calc(1em * 3 / 4);
  border-radius: 8px;
`

export const RinBalanceLogo = styled.img`
  width: 1em;
  height: 1em;
`

export const RinBalanceLabel = styled.div`
  margin-left: 0.25em;
  font-weight: 600;
  line-height: 1em;
`
