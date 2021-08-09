import styled from 'styled-components'

export const NavBarForSmallScreens = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 11rem;
  padding: 0 3rem;
  background: #222429;
  @media (min-width: 600px) {
    display: none;
  }
`
