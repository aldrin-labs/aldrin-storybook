import styled from 'styled-components'
import { Paper } from '@material-ui/core'

import { Row, StretchedBlock } from '@sb/components/Layout'
import { Block } from '@sb/components/Block'
import { BREAKPOINTS, COLORS } from '../../../variables'

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
  font-size: 1.3em;
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
  font-variant-numeric: tabular-nums;
`

export const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem;
  width: 70rem;
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
export const Number = styled.span`
  margin: 0 10px 0 0;
  font-size: 1.5em;
  line-height: 1.2;
  font-weight: bold;
`

export const Asterisks = styled.span`
  position: relative;
  top: 0.3em;
`

export const StatsBlock = styled(StretchedBlock)`
  flex-wrap: wrap;
`

export const StatsBlockItem = styled.div`
  margin: 20px 20px 0 0;

  &:last-child {
    margin-right: 0;
  }
`

export const LastPrice = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`

export const FormWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`
export const FormItem = styled.div`
  margin: 10px 10px 0 0;
`

export const ChartContainer = styled.div`
  background: #383b42;
  border-radius: 2rem;
  padding: 2rem;
  margin-top: 2rem;
  height: 30rem;
`
export const Chart = styled(StretchedBlock)`
  height: 23rem;
`
