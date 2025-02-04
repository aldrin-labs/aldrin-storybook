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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
`

export const Icon = styled(SvgIcon)`
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin: 0;
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
  background: ${(props) => props.theme.colors.white4};
  position: absolute;
  top: 16px;
  right: 0;
  transform: translateX(25%);
  z-index: 1000;
  border-radius: 2rem;
  width: 29px;
  height: 60px;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  display: none;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
`

export const IconsContainer = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  width: 24px;

  ${Anchor} {
    background: ${(props) => props.theme.colors.white5};
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
