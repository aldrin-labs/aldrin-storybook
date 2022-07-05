import styled from 'styled-components'

export const SwitcherContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  background-color: ${(props) => props.theme.colors.gray6};
  padding: 0.25em;
  border-radius: 12px;
`

type SwitchControlProps = {
  $active: boolean
}

export const SwitchControl = styled.div<SwitchControlProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${(props) => (props.$active ? '#303041' : 'inherit')};
  width: 2em;
  height: 2em;
  padding: 0.6em;
  border-radius: 8px;

  svg {
    fill: red;
  }
`
