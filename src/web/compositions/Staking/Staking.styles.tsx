import styled from 'styled-components'

import { Row } from '@sb/components/Layout'
import { Block } from '@sb/components/Block'
import { BREAKPOINTS, FONTS, COLORS } from '../../../variables'
import { RowContainer } from '../AnalyticsRoute/index.styles'
import { Paper } from '@material-ui/core'

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

export const Container = styled(RowContainer)`
  padding: 5rem 13rem;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background: rgb(14, 16, 22);
  @media (max-width: 1300px) {
    padding: 8rem 15rem;
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
  font-size: 0.75em;
  font-weight: 500;
  color: ${COLORS.hint};
  border-radius: 1.5rem;
  line-height: 1.25em;
  background: ${COLORS.background};
  padding: 8px 12px;
  margin: 12px 0 0 0;

  @media (min-width: ${BREAKPOINTS.lg}) {
    min-width: 360px;
  }
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
  outline: none;
`

export const RootRow = styled(Row)`
  margin: 50px 0;
`

export const WalletRow = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${BREAKPOINTS.xl}) {
    & {
      flex-direction: row;
      justify-content: space-between;
    }
  }
`

export const WalletBalanceBlock = styled.div`
  margin-top: 20px;

  @media (min-width: ${BREAKPOINTS.xl}) {
    & {
      margin-top: 8px;
    }
  }
`

const InnerBlock = styled(Block)`
  margin: 10px 0;
`

export const TotalStakedBlock = styled(InnerBlock)`
  @media (min-width: ${BREAKPOINTS.md}) {
    margin: 18px 0 38px 0;
  }

  @media (min-width: ${BREAKPOINTS.lg}) {
    margin: 10px 0;
  }

  @media (min-width: ${BREAKPOINTS.xl}) {
    margin: 0;
  }
`

export const RewardsBlock = styled(InnerBlock)`
  @media (min-width: ${BREAKPOINTS.md}) {
    margin: 18px 0 38px 16px;
  }

  @media (min-width: ${BREAKPOINTS.lg}) {
    margin: 10px 0;
  }

  @media (min-width: ${BREAKPOINTS.xl}) {
    margin: 0 0 0 16px;
  }
`
export const BalanceRow = styled.div`
  color: ${COLORS.hint};
  font-size: 1.5em;
  text-transform: lowercase;
  font-variant: small-caps;
  height: 1.25em;
  line-height: 1.25em;
`

export const BalanceWrap = styled.div`
  @media (min-width: ${BREAKPOINTS.xl}) {
    text-align: right;
    padding-top: 5px;
  }
`
export const Digit = styled.span`
  color: ${COLORS.white};
  font-variant: initial;
  font-weight: 600;
`

export const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem;
  width: 55rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 1.6rem;
`
export const BigNumber = styled.p`
  font-size: 2em;
  line-height: 1.3;
  font-weight: bold;
  margin: 10px 0;
`
export const Number = styled.p`
  margin: 10px 0 0;
  font-size: 1.5em;
  line-height: 1.2;
  font-weight: bold;
`
