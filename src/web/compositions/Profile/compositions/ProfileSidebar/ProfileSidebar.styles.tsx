import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const UserInfo = styled.div`
  padding: 1rem 0;
  border-bottom: 0.1rem solid #e0e5ec;
`

export const Navigation = styled.nav`
  width: 100%;
  padding: 1rem 0;
`

export const Button = styled(Link)`
  display: block;
  width: 100%;
  padding: 1.5rem 0;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.15rem;

  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 1.2rem;
`

export const NavButton = styled(Button)`
  color: ${(props) => (props.active ? '#fff' : '#7284a0')};
  background-color: ${(props) => (props.active ? '#0b1fd1' : '#fff')};
  border-radius: ${(props) => (props.active ? '1.5rem' : '0')};
  border-bottom: ${(props) => (props.active ? '0' : '0.1rem solid #e0e5ec')};
`

export const LogoutButton = styled(Button)`
  color: #fff;
  background-color: #dd6956;
  border-radius: 1.5rem;
`

export const UserAvatar = styled.img`
  width: 75%;
  border-radius: 50%;
`

export const Typography = styled.p`
  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
`

export const UserName = styled(Typography)`
  text-transform: uppercase;
  color: #16253d;
  font-size: 1.35rem;
`

export const UserEmail = styled(Typography)`
  color: #7284a0;
  font-size: 1.2rem;
  overflow: scroll;
`
