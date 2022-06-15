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

export const IconsContainer = styled.div`
  position: relative;
  cursor: pointer;
  display: block;
  height: 24px;

  .explorers-dropdown {
    display: none;
    background: ${(props) => props.theme.colors.gray5};
    position: absolute;
    top: 3rem;
    left: 3px;
    z-index: 1000;
    border-radius: 2rem;
    width: 29px;
    height: 60px;
  }

  .explorers-dropdown-item {
    background: ${(props) => props.theme.colors.gray6};
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    .explorers-dropdown {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }
  }
`
