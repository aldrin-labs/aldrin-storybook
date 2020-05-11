import styled from 'styled-components'
import { Outlined } from '../Withdrawal/Withdrawal.styles'

export const StyledInputReferral = styled(Outlined)`
  width: 50%;
  flex-grow: 1;
  & input {
    font-size: 1.4rem;
    color: #16253d;
    text-align: left;
  }
`

export const CircleNumber = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7rem;
  height: 7rem;
  font-size: 5rem;
  font-weight: bold;
  font-family: 'DM Sans';
  background: #165be0;
  color: #fff;
  border-radius: 50%;
`

export const Subtitle = styled.h3`
  font-size: 1.8rem;
  line-height: 140%;
  letter-spacing: 0.01em;
  margin: 0;
  /* margin: 1.5rem 0 3rem 0; */

  font-family: 'DM Sans', sans-serif;
  font-weight: 400;

  color: #16253d;
`

export const StyledSubtitle = styled(Subtitle)`
  font-weight: bold;
  margin: 3rem 0 2rem 0;
`
