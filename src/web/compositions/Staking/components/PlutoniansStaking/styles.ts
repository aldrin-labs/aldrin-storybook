import { COLORS } from '@variables/variables'
import styled from 'styled-components'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import bg from './assets/plutonians-bg.png'
import Logo from './assets/plutonians-logo.png'

export const LogoWrap = styled.div`
  height: 200px;
  position: relative;
  background-color: ${COLORS.black};
  background-image: url(${bg});
  background-repeat: none;
  background-size: contain;

  border-radius: 12px 12px 0px 0px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 90%;
    left: 5%;
    height: 100%;
    background: url(${Logo}) center center no-repeat;
    background-size: contain;
  }
`

export const ButtonContainer = styled(RowContainer)`
  margin-top: 9px;
`
