import styled from 'styled-components'

import { THEME_DARK } from '@sb/compositions/App/themes'

export const RinBalanceContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  background-color: ${(props) => props.theme.colors.gray7};
  height: 2.5em;
  margin-left: 1em;
  padding: 0.75em;
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
  color: ${(props) =>
    props.theme.name === THEME_DARK
      ? props.theme.colors.gray0
      : props.theme.colors.gray1};
`
