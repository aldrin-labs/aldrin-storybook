import { em, rgba } from 'polished'
import styled from 'styled-components'

export const RinBalanceContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  background-color: ${(props) => props.theme.colors.white6};
  height: 2.5em;
  margin-left: 1em;
  padding: 0.75em;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => rgba(props.theme.colors.white6, 0.75)};
  }
`

export const RinBalanceLogo = styled.img`
  width: 1em;
  height: 1em;
`

export const RinBalanceLabel = styled.div`
  margin-left: 0.25em;
  font-size: 0.75em;
  font-weight: 600;
  line-height: 1em;
  color: ${(props) => props.theme.colors.white1};
`
