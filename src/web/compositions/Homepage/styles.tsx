import { COLORS, BORDER_RADIUS, TRANSITION } from '@variables/variables'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'

export const TextContainer = styled(RowContainer)`
  position: absolute;
  justify-content: space-between;
  padding: 2rem 8rem;
  height: 100%;
`

export const BlockForText = styled(Row)`
  flex-direction: column;
  width: 90%;
`

export const MainContainer = styled(RowContainer)`
  width: 100%;
  height: 100%;
`

export const MainContainerForSmallScreens = styled.div`
  width: 100%;
  height: 100%;
  display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`
export const IdoBtn = styled.button`
  background-image: linear-gradient(
    135deg,
    rgb(44, 58, 174),
    rgb(94, 182, 183)
  );
  border: none;
  border-radius: 1rem;
  width: 8rem;
  white-space: nowrap;
  height: 3.5rem;
  color: #fff;
  font-size: 1.3rem;
  outline: none;
  font-family: 'Avenir Next Bold';
  cursor: pointer;
  &:hover {
    background-image: none;
    background: #4679f4;
  }
`
export const CardContainer = styled.div`
  height: ${(props) => props.height || '30%'};
  width: ${(props) => props.width || '100%'};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const WhiteButton = styled.a`
  bottom: ${(props) => props.bottom || 'none'};
  right: ${(props) => props.right || 'none'};
  top: ${(props) => props.top || 'none'};
  display: flex;
  text-decoration: none;
  justify-content: space-around;
  align-items: center;
  position: ${(props) => props.position || 'relative'};
  background: none;
  border: 0.1rem solid #f8faff;
  border-radius: 2.3rem;
  width: ${(props) => props.width || '21rem'};
  white-space: nowrap;
  height: 4rem;
  color: #fff;
  font-size: 1.6rem;
  outline: none;
  font-family: 'Avenir Next Medium';
  cursor: pointer;
  padding: ${(props) => props.padding || '0 4rem'};

  @media only screen and (min-width: 1430px) {
    width: ${(props) => props.width || '18rem'};
  }

  &:hover {
    background: ${(props) => (props.needHover ? '#f8faff' : null)};
    color: ${(props) => (props.needHover ? '#3a475c' : null)};
    svg {
      path {
        fill: ${(props) => (props.needHover ? '#3a475c' : null)};
      }
    }
  }
`
export const Header = styled.span`
  font-family: Avenir Next Bold;
  font-size: ${(props) => props.fontSize || '4rem'};
  line-height: 20px;
  letter-spacing: -0.394236px;
  color: #f8faff;
`
export const Description = styled.span`
  font-family: Avenir Next Medium;
  font-size: ${(props) => props.fontSize || '2rem'};
  letter-spacing: -0.653846px;
  color: #f8faff;
  line-height: 3.2rem;
  width: ${(props) => props.width || '90%'};
  @media only screen and (max-width: 2190px) {
    font-size: 2.5rem;
    line-height: 3.5rem;
  }
  @media only screen and (min-width: 1230px) {
    font-size: 2rem;
    line-height: 2.8rem;
  }
  @media only screen and (min-width: 1430px) {
    font-size: 1.6rem;
    line-height: 2.2rem;
  }
  @media only screen and (min-width: 1600px) {
    font-size: 2.1rem;
    line-height: 3.2rem;
  }
  @media only screen and (min-width: 1900px) {
    font-size: 2.4rem;
    line-height: 3rem;
  }
  @media only screen and (min-width: 2200px) {
    font-size: 1.4rem;
  }
`
export const HeaderContainer = styled.div`
  position: absolute;
  height: ${(props) => props.height || '90%'};
  display: flex;
  justify-content: space-around;
  flex-direction: ${(props) => props.direction || 'column'};
  align-items: ${(props) => props.align || 'flex-start'};
  width: 83%;
`
export const Socials = styled(Row)`
  & a:hover {
    svg {
      g {
        path {
          fill: #4679f4;
        }
      }
    }
  }
`
export const ButtonContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 10% 3% 0;
  @media only screen and (min-width: 1000px) {
    padding: 0 9% 3% 0;
  }

  @media only screen and (min-width: 1430px) {
    padding: 0 8% 3% 0;
  }
`

export const BannerHeader = styled(Description)`
  @media (max-width: 3000px) {
    font-size: 3.2rem;
  }
`
export const ThinText = styled(Description)`
  @media (max-width: 3000px) {
    white-space: nowrap;
    font-family: Avenir Next Thin;
    line-height: 3rem;
    font-size: 1.8rem;
  }
`
export const NewLink = styled(Link)`
  white-space: nowrap;
  font-family: Avenir Next Demi;
  line-height: 3rem;
  text-decoration: none;
  font-size: 1.8rem;
  color: #fbf2f2;
  transition: 0.3s;

  &:hover {
    text-decoration: underline;
    transition: 0.3s;
    svg {
      path {
        fill: #5e55f2;
      }
      defs {
        linearGradient {
          stop {
            stop-color: #5e55f2;
          }
        }
      }
    }
  }
`
export const StyledA = styled.a`
  text-decoration: none;
  white-space: nowrap;
  font-family: Avenir Next Demi;
  line-height: 3rem;
  font-size: 1.8rem;
  color: #fbf2f2;
  transition: 0.3s;

  &:hover {
    transition: 0.3s;
    text-decoration: underline;
    svg {
      path {
        fill: ${COLORS.primary};
      }
    }
  }
`

export const LinksRow = styled(RowContainer)`
  @media only screen and (max-width: 600px) {
    display: none;
  }
`

export const StyledPicture = styled.picture`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 70%;
  height: 100%;
`

export const StyledLink = styled.a`
  width: 36px;
  height: 36px;
  background: ${(props) => props.theme.colors.gray6};
  border-radius: ${BORDER_RADIUS.md};
  transition: ${TRANSITION};

  &:hover {
    background: ${(props) => props.theme.colors.blue5};

    svg path:not(.not-fill) {
      fill: ${COLORS.white};
    }

    svg {
      defs {
        clipPath {
          rect {
            fill: ${COLORS.white};
          }
        }
      }
    }
  }

  &:active {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
      ${COLORS.primaryBlue};

    svg path:not(.not-fill) {
      fill: ${COLORS.white};
    }
  }
`

export const StyledImg = styled.img`
  height: auto;
  width: 100%;

  @media only screen and (max-width: 600px) {
    height: 100%;
    width: auto;
  }
`
