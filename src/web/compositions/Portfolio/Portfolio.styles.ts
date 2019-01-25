import styled from 'styled-components'

export const PortfolioContainer = styled.div`
  display: grid;
  grid-template-columns: 5.5rem calc(100vw - 5.5rem);
  justify-content: center;
  min-height: 600px;
`
export const Backdrop = styled.div`
  display: block;
  height: 100vh;
  width: 100vw;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`
