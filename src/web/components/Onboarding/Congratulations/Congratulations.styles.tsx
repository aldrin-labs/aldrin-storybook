import styled, { keyframes } from 'styled-components'

const keyFrameLogo = keyframes`
  0% {
    transform: rotate(0)
  }
  100% {
    transform: rotate(360deg)
  }
`

export const Logo = styled.img`
  display: block;
  margin: 0 auto;
  margin-top: 2rem;
  margin-bottom: 1rem;
  animation: ${keyFrameLogo} 4s ease-in-out 0s infinite;
`

export default Logo
