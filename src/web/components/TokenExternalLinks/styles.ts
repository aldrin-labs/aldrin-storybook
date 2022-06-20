import { COLORS } from '@variables/variables'
import styled from 'styled-components'

import SvgIcon from '../SvgIcon'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto 5px;
`

export const Anchor = styled.a`
  cursor: pointer;
  display: block;
  height: 24px;
`

export const Icon = styled(SvgIcon)`
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin: 0 5px;
  background: ${COLORS.primary};
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 60%,
    rgba(101, 28, 228, 1) 61%,
    rgba(101, 28, 228, 1) 100%
  );
  border-radius: 50%;
`

export const AnalyticsIcon = styled(Icon)`
  border-radius: 0;
  background: none;
`

export const IconsInner = styled.div`
  margin-top: -5px;
  padding-top: 5px;
  position: relative;
`

export const Wrap = styled.div`
  background: ${(props) => props.theme.colors.gray5};
  position: absolute;
  left: 3px;
  z-index: 1000;
  border-radius: 2rem;
  width: 29px;
  height: 60px;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  display: none;
`

export const IconsContainer = styled.div`
  position: relative;
  cursor: pointer;
  display: block;
  height: 24px;

  ${Anchor} {
    background: ${(props) => props.theme.colors.gray6};
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }
  }

  &:hover {
    ${Wrap} {
      display: flex;
    }
  }
`
