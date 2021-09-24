import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const StyledLink = styled(Link)`
  width: 7rem;
  height: 7rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  text-decoration: none;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.6rem;
  span {
    margin-top: 1rem;
  }
`
export const StyledA = styled.a`
  width: 7rem;
  height: 7rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  text-decoration: none;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.6rem;
  span {
    margin-top: 1rem;
  }
`

export const FooterComponent = styled(RowContainer)`
  display: none;
  @media (max-width: 600px) {
    display: flex;
    background-color: #222429;
    border-top: 0.1rem solid #383b45;
    padding: 0 2rem;
  }
`
export const StyledButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 7rem;
  height: 7rem;
  text-align: center;
  text-decoration: none;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.6rem;
`
