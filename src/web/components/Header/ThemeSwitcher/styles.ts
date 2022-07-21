import styled from 'styled-components'

import { THEME_DARK } from '@sb/compositions/App/themes'

export const SwitcherContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  background-color: ${(props) => props.theme.colors.white5};
  padding: 0.25em;
  border-radius: 12px;
  margin-left: 1em;
`

type SwitchControlProps = {
  $active: boolean
}

export const SwitchControl = styled.div<SwitchControlProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.$active ? props.theme.colors.white4 : 'inherit'};
  width: 2em;
  height: 2em;
  padding: 0.6em;
  border-radius: 8px;
`
