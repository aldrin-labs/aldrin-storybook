import styled from 'styled-components'
import { GridCard } from '@sb/compositions/Profile/Profile.styles'
import { Button } from '@material-ui/core'
import { Add } from '@material-ui/icons'

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

export const PortfolioValues = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  height: 100%;
`

export const PortfolioValuesBlock = styled(PortfolioValues)`
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;

  padding-left: 1rem;
`

export const ChangePortfolioArrowsBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 100%;
`

export const ChangePortfolioArrow = styled.button`
  height: 50%;
  color: #0b1fd1;
  background: inherit;
  border: none;
  cursor: pointer;
  outline: none;
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

  width: 77.5%;
  padding: 1.5rem 2.5rem 1.5rem 1.5rem;
`

export const Typography = styled.span`
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

export const GreyValue = styled(Typography)`
  color: #7284a0;
  font-weight: 500;
  font-size: 1.2rem;
`

export const BigNumberValue = styled(Typography)`
  color: #16253d;
  font-size: 3.5rem;
  line-height: 90%;
`

export const PortfolioName = styled(Typography)`
  color: #16253d;
  font-size: 1.4rem;
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

  & > span {
    display: flex;
    flex-direction: column;
  }
`

export const StyledAddIcon = styled(Add)`
  height: 6rem;
  width: 6rem;

  @media (max-width: 1600px) {
    height: 4.5rem;
    width: 4.5rem;
  }
`

export const AddAccountButton = styled(Button)`
  color: #0b1fd1;
`

export const SmallAddIcon = styled(Add)`
  color: #0b1fd1;
  height: 2.4rem;
  width: 2.4rem;
  margin-right: 1rem;
`
