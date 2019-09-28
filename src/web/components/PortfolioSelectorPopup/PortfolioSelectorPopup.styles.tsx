import styled from 'styled-components'

export const PortfolioSelectorPopupWrapper = styled.div`
  box-sizing: border-box;
  position: relative;

  span {
    cursor: pointer;
  }
`

export const PortfolioSelectorPopupMain = styled.div`
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 1.25rem;
  border-radius: 1.5rem;
  background-color: #fff;
  z-index: 1010;
  color: ${(props) => props.theme.palette.text.dark};
  display: block;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  opacity: 0;
  visibility: hidden;

  // &.popup-visible {
  visibility: ${(props) => (props.isPopupOpen ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isPopupOpen ? '1' : '0')};
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  // }
`

export const PortfolioSelectorPopupMask = styled.div`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  opacity: ${(props) => (props.visible ? '1' : '0')};
  position: absolute;
  top: -15px;
  left: 0;
  width: 100%;
  height: calc(100vh + 15px);
  background-color: rgba(0, 0, 0, 0.33);
  z-index: 1009;
`
