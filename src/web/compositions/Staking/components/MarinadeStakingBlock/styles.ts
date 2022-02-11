import styled from 'styled-components'

import bg from './bg.png'

export const LogoWrap = styled.div`
  height: 200px;
  position: relative;
  background-image: url(${bg});
  background-repeat: none;
  background-size: cover;

  border-radius: 12px 12px 0px 0px;
  display: flex;
  align-items: center;
  padding: 0 20px;
`
export const AbsoluteImg = styled.img`
  position: absolute;
  left: 13%;
  max-width: 75%;
`
