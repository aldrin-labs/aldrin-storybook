import styled from 'styled-components'
import Grid from '@icons/grid.svg'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'

export const TransparentText = styled.div`
  font-family: Avenir Next Bold;
  font-size: ${(props) => props.fontSize || '10rem'};
  letter-spacing: -1.37308px;
  color: transparent;
  -webkit-text-stroke: 0.1rem #fff;
  white-space: nowrap;
`
export const RotatedContainer = styled.div`
  left: 0;
  transform: translate(-40%, 0) rotate(270deg);
  position: absolute;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;

  @media only screen and (max-width: 700px) {
    display: none;
  }
`
export const Header = styled.span`
  font-family: Avenir Next Medium;
  font-size: 4rem;
  line-height: 7rem;
  color: #ffffff;
  text-align: left;
`

export const LinkContainer = styled.a`
  width: 4rem;
  height: 4rem;
  cursor: pointer;
  text-decoration: none;
  @media (max-width: 600px) {
    width: 6rem;
    height: 6rem;
  }
`
export const VioletButton = styled.a`
  text-decoration: none;
  display: flex;
  align-items: center;
  border-radius: 1.5rem;
  white-space: nowrap;
  font-size: ${(props) => props.fontSize || '2.3rem'};
  background-color: #621ae1;
  color: #f8faff;
  font-family: Avenir Next Medium;
  letter-spacing: 0.5px;
  cursor: pointer;
  padding: 2rem 5rem;
  justify-content: center;
  text-transform: uppercase;

  &:hover {
    color: #f8faff;
    background-color: #651ce4;
    transition: 0.3s;
  }

  @media (max-width: 600px) {
    padding: 3rem 7rem;
    font-size: 3rem;
  }
`
export const SpinAnimatedImage = styled.img`
  width: 35%;
  height: auto;
  animation-name: spin;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @media (max-width: 600px) {
    width: 60%;
  }
`
export const AnimatedImage = styled.img`
  width: 70%;
  height: auto;
  animation-name: rotate;
  animation-duration: 5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes rotate {
    0% {
      transform: rotate(60deg);
    }

    50% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(60deg);
    }
  }
  @media (max-width: 600px) {
    width: 30%;
  }
`
export const GridContainer = styled(Row)`
  background-image: url(${Grid});
  background-repeat: repeat-y;
  background-position-x: left;
  background-size: cover;
  @media (max-width: 600px) {
    display: none;
  }
`

export const MobileImageContainer = styled.div`
  top: ${(props) => props.top || 'auto'};
  bottom: ${(props) => props.bottom || 'auto'};
  right: ${(props) => props.right || 'auto'};
  left: ${(props) => props.left || 'auto'};
  position: absolute;
  @media (min-width: 600px) {
    display: none;
  }
`
