import styled from 'styled-components'

import { Button } from '@sb/components/Button'

export const MainButtonWrapper = styled.div`
  width: 48%;
`

export const FeeInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const RedButton = styled(Button)`
  outline: none;
  background-color: ${(props) => props.theme.colors.red4};
`
