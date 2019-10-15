import styled from 'styled-components'
import { GridCard } from '@sb/compositions/Profile/Profile.styles'
import { Button } from '@material-ui/core'

export const MainContainer = styled.div`
  display: flex;
  height: 100%;
`

export const StatisticContainer = styled.div`
  width: 20%;
  margin-right: 1.5rem;
`

export const ContentContainer = styled.div`
  width: calc(80% - 1.5rem);
`

// 1.5 rem - margin
export const GridBlock = styled(GridCard)`
  margin-top: 1.5rem;
  height: ${(props) => `calc(${props.height} - 1.5rem)`};
`

export const PortfoliosBlock = styled(GridCard)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 1.5rem;
  height: 14%;
`

export const SummaryAccountsBlock = styled(GridBlock)`
  padding: 1.5rem;
`

export const CurrentPortfolioBlock = styled(GridCard)`
  display: flex;
  justify-content: space-between;
  height: 14%;
`

export const PortfoliosValue = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

export const AccountsValue = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 0.1rem dashed #abbad1;
`

export const AccountsChartBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70%;
`

export const ChangePortfolioBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.5rem;
`

const Typography = styled.span`
  font-family: DM Sans;
  font-weight: bold;
  text-transform: uppercase;
`

export const GridTitle = styled(Typography)`
  color: #7284a0;
  font-size: 1rem;
`

export const GreenValue = styled(Typography)`
  color: #29ac80;
  font-size: 1.4rem;
`

export const BigNumberValue = styled(Typography)`
  color: #16253d;
  font-size: 3.5rem;
  line-height: 90%;
`

export const CreatePortfolioButton = styled(Button)`
  width: 22.5%;
  height: 100%;
  background: #0b1fd1;
  color: #fff;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;

  &:hover {
    background: #0b1fd1;
    color: #fff;
  }
`
