import { BREAKPOINTS, COLORS, BORDER_RADIUS } from '@variables/variables'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Block, BlockSubtitle } from '@sb/components/Block'
import { Button } from '@sb/components/Button'
import { Input } from '@sb/components/Input'
import { Row, StretchedBlock, Page, BlackPage } from '@sb/components/Layout'

import { Append, InputEl } from '../../components/Input/styles'

export const StakingPage = styled(BlackPage)`
  display: flex;
  justify-content: center;
  align-items: center;
  // height: 100%;
  @media (max-width: ${BREAKPOINTS.lg}) {
    align-items: flex-start;
  }
`

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
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: ${BREAKPOINTS.lg}) {
    min-width: 360px;
  }
`

export const RootRow = styled(Row)`
  margin: 40px 0;
  background: ${COLORS.newBlack};
  border-radius: 2rem;
  padding: 2rem;
`

export const RewardsStats = styled(StretchedBlock)`
  flex-direction: column;

  @media (min-width: ${BREAKPOINTS.md}) {
    flex-direction: row;
  }

  @media (min-width: ${BREAKPOINTS.lg}) {
    flex-direction: column;
  }

  @media (min-width: ${BREAKPOINTS.xl}) {
    flex-direction: row;
  }
`

export const RewardsStatsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media (min-width: ${BREAKPOINTS.md}) {
    flex-direction: column;
    align-items: flex-start;
  }

  @media (min-width: ${BREAKPOINTS.lg}) {
    flex-direction: row;
    align-items: center;
  }

  @media (min-width: ${BREAKPOINTS.xl}) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const RewardsTitle = styled(BlockSubtitle)`
  margin: 0;

  @media (min-width: ${BREAKPOINTS.md}) {
    margin-bottom: 2em;
  }

  @media (min-width: ${BREAKPOINTS.lg}) {
    margin-bottom: 0;
  }

  @media (min-width: ${BREAKPOINTS.xl}) {
    margin-bottom: 2em;
  }
`

export const WalletAvailableTitle = styled(BlockSubtitle)`
  margin-bottom: 0;

  @media (min-width: ${BREAKPOINTS.md}) {
    margin-bottom: 1em;
  }

  @media (min-width: ${BREAKPOINTS.lg}) {
    margin-bottom: 0;
  }

  @media (min-width: ${BREAKPOINTS.xl}) {
    margin-bottom: 1em;
  }
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

export const WalletBalanceBlock = styled(RewardsStatsRow)`
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
  font-size: 1em;
  text-transform: lowercase;
  font-variant: small-caps;
  height: 1.25em;
  line-height: 1.25em;
`

export const BalanceWrap = styled.div`
  @media (min-width: ${BREAKPOINTS.xl}) {
    text-align: right;
    padding-top: 12px;
  }
`
export const Digit = styled.span`
  color: ${COLORS.white};
  font-variant: initial;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

export const BigNumber = styled.p`
  font-size: 1.6em;
  line-height: 1.3;
  font-weight: bold;
  margin: 10px 0;
  white-space: nowrap;
`

interface NumberProps {
  margin?: string
  lineHeight?: string
}

export const Number = styled.span<NumberProps>`
  margin: ${(props: NumberProps) => props.margin || '0 10px 0 0'};
  font-size: 1.4em;
  line-height: ${(props: NumberProps) => props.lineHeight || '1.2rem'};
  font-weight: bold;
`

export const Asterisks = styled.span`
  position: relative;
  top: 0.2em;
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

export const FormWrap = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  margin: 10px;
`
export const UnstakingFormWrap = styled(FormWrap)``

export const FormItem = styled.div`
  margin: 10px 10px 0 0;
`

export const FormItemFull = styled(FormItem)`
  display: flex;
  flex: 1;
  margin-right: 0;
  margin-top: 16px;
  &:first-child {
    margin-top: 0;
  }
`

export const InputWrapper = styled.div`
  flex: 1;
`

export const StakingInput = styled(Input)`
  border-radius: ${BORDER_RADIUS.md};
  height: 6.8rem;
  background-color: ${COLORS.cardsBack};
  border: 0.1rem solid ${COLORS.background};
  &:focus {
    border: 0.1rem solid #aaaaaa;
  }
  ${InputEl} {
    padding-left: 0.7em;
  }
  ${Append} {
    padding-right: 0.7em;
  }
`

export const ButtonWrapper = styled.div`
  margin: auto;
  margin-left: 0.6em;
`

export const ChartContainer = styled.div`
  background: ${COLORS.gray};
  border-radius: ${BORDER_RADIUS.md};
  padding: 2rem;
  margin-top: 2rem;
`

export const Chart = styled(StretchedBlock)`
  height: 30rem;
`

export const ChartCanvas = styled.canvas`
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
`

export const RestakeButton = styled(Button)`
  flex: 1;
  margin-top: 10px;
  padding-bottom: 0;
`

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${COLORS.main};
`

export const ClaimButtonContainer = styled(RewardsStatsRow)`
  margin-top: 20px;

  @media (min-width: ${BREAKPOINTS.md}) {
    margin-top: 0;
    justify-content: center;
  }

  @media (min-width: ${BREAKPOINTS.lg}) {
    margin-top: 20px;
  }

  @media (min-width: ${BREAKPOINTS.xl}) {
    margin-top: 0;
  }
`

export const RestakeWrapper = styled.div`
  margin-top: 1.3rem;
`
export const UserFormRestakeButton = styled(Button)`
  margin-top: 10px;
  padding: 0 10px;
`

export const CenteredPage = styled(Page)`
  display: flex;
  align-items: center;
`

export const FormsContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${BREAKPOINTS.xl}) {
    flex-direction: row;
    justify-content: space-between;
  }
`

export const FormsWrap = styled.div`
  @media (min-width: ${BREAKPOINTS.lg}) {
    margin-top: 20px;
  }
`
