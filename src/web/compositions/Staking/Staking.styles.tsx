import styled from 'styled-components'

import greenBackground from '@icons/greenBack.png'
import pinkBackground from '@icons/pinkBackground.png'
import StakeBtn from '@icons/stakeBtn.png'
import { RowContainer } from '../AnalyticsRoute/index.styles'

export const ADAPTIVE_LOW_BLOCKS = ({
  isMobile,
  needBackground,
}: {
  isMobile: boolean
  needBackground?: boolean
}) => {
  return {
    width: isMobile ? '100%' : '32%',
    height: 'auto',
    minHeight: isMobile ? '30rem' : '15rem',
    margin: isMobile ? '2rem 0' : '0',
    flexDirection: 'column',
    padding: '3rem',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    position: 'relative',
    backgroundImage: needBackground ? `url(${greenBackground})` : 'none',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
}

export const ADAPTIVE_UPPER_BLOCKS = ({
  isMobile,
  needBackground,
}: {
  isMobile: boolean
  needBackground?: boolean
}) => {
  return {
    height: isMobile ? '30rem' : '100%',
    width: isMobile ? '100%' : '48%',
    margin: isMobile ? '2rem 0' : '0',
    flexDirection: 'column',
    padding: '3rem',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    position: 'relative',
    backgroundImage: needBackground ? `url(${pinkBackground})` : 'none',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
}

export const CONTAINER = styled(RowContainer)`
  padding: 5rem 13rem;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background: rgb(14, 16, 22);
  @media (max-width: 1300px) {
    padding: 10rem 15rem;
    height: auto;
  }
  @media (max-width: 600px) {
    padding: 5rem;
    height: auto;
  }
`

export const MAIN_BLOCK = (isMobile: boolean) => {
  return {
    width: isMobile ? '100%' : '49%',
    height: isMobile ? '60rem' : '100%',
  }
}

export const StyledTextDiv = styled.div`
  height: auto;
  width: 100%;
  font-size: 1.4rem;
  font-family: Avenir Next Light;
  color: #96999c;
  border-radius: 2rem;
  background: #383b45;
  letter-spacing: 0.01rem;
  padding: 1.2rem;
  margin: 1rem 0 0 0;
`
export const RoundButton = styled.button`
  background-image: ${(props) =>
    props.needImage ? `url(${StakeBtn})` : 'none'};
  border-radius: 3rem;
  height: 3.6rem;
  width: 9rem;
  font-size: 1.2rem;
  font-family: Avenir Next Medium;
  color: #fff;
  border: none;
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #651ce4;
`
export const RoundInput = styled.input`
  background: #383b45;
  border: 0.1rem solid #3a475c;
  border-radius: 3rem;
  width: 100%;
  height: 5rem;
`
