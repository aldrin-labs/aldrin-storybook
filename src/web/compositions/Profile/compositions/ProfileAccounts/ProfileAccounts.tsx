import React from 'react'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'

import {
  MainContainer,
  StatisticContainer,
  ContentContainer,
  GridBlock,
  PortfoliosBlock,
  SummaryAccountsBlock,
  CurrentPortfolioBlock,
  PortfoliosValue,
  PortfolioValues,
  PortfolioValuesBlock,
  AccountsValue,
  AccountsChartBlock,
  GridTitle,
  GreenValue,
  BigNumberValue,
  ChangePortfolioBlock,
  CreatePortfolioButton,
  ChangePortfolioArrowsBlock,
  ChangePortfolioArrow,
  GreyValue,
  PortfolioName,
  StyledAddIcon,
  Typography,
} from './ProfileAccounts.styles'
import ProfileAccountsTable from './ProfileAccountsTable'
import { formatValue, countAllPortfoliosValue } from './ProfileAccounts.utils'

import CreatePortfolio from '@sb/components/CreatePortfolio/CreatePortfolio'
import PortfolioSelectorPopup from '@sb/components/PortfolioSelectorPopup/PortfolioSelectorPopup'
import { ComingSoonBlock } from '@sb/compositions/Profile/compositions/ProfileRouter/ProfileRouter'

const ProfileAccounts = ({
  currentPortfolioData,
  allPortfoliosData,
  portfolioAccountsData: { keys: accounts },
  selectPortfolioMutation,
}) => {
  const currentPortfolioIndex = allPortfoliosData.findIndex(
    (portfolio) => portfolio._id === currentPortfolioData._id
  )

  const prevPortfolioId =
    currentPortfolioIndex === 0
      ? allPortfoliosData[allPortfoliosData.length - 1]._id
      : allPortfoliosData[currentPortfolioIndex - 1]._id

  const nextPortfolioId =
    currentPortfolioIndex === allPortfoliosData.length - 1
      ? allPortfoliosData[0]._id
      : allPortfoliosData[currentPortfolioIndex + 1]._id

  return (
    <MainContainer>
      <StatisticContainer>
        {/* total portfolios */}
        <PortfoliosBlock>
          <GridTitle>total portfolios</GridTitle>
          <PortfoliosValue>
            <GreenValue>
              {formatValue(countAllPortfoliosValue(allPortfoliosData))}
            </GreenValue>
            <BigNumberValue>{allPortfoliosData.length}</BigNumberValue>
          </PortfoliosValue>
        </PortfoliosBlock>

        {/* summary accounts */}
        <SummaryAccountsBlock height={'42%'}>
          <GridTitle>summary accounts</GridTitle>
          <AccountsValue>
            <BigNumberValue>{accounts.length}</BigNumberValue>
          </AccountsValue>
          <AccountsChartBlock>
            <GridTitle>chart soon</GridTitle>
          </AccountsChartBlock>
        </SummaryAccountsBlock>

        {/* temporary empty block */}
        <GridBlock height={'44%'}>
          <ComingSoonBlock />
        </GridBlock>
      </StatisticContainer>
      <ContentContainer>
        {/* current portfolio info */}
        <CurrentPortfolioBlock>
          <ChangePortfolioBlock>
            <PortfolioValues>
              {/* switch between portfolios */}
              <ChangePortfolioArrowsBlock>
                {/* prev portfolio */}
                <ChangePortfolioArrow
                  onClick={() =>
                    selectPortfolioMutation({
                      variables: {
                        inputPortfolio: {
                          id: nextPortfolioId,
                        },
                      },
                    })
                  }
                >
                  <KeyboardArrowUp />
                </ChangePortfolioArrow>
                {/* next portfolio */}
                <ChangePortfolioArrow
                  onClick={() =>
                    selectPortfolioMutation({
                      variables: {
                        inputPortfolio: {
                          id: prevPortfolioId,
                        },
                      },
                    })
                  }
                >
                  <KeyboardArrowDown />
                </ChangePortfolioArrow>
              </ChangePortfolioArrowsBlock>

              {/* current portfolio values */}
              <PortfolioValuesBlock>
                <PortfolioName>{currentPortfolioData.name}</PortfolioName>
                <GreyValue>{`${accounts.length} ${
                  accounts.length === 1 ? 'account' : 'accounts'
                }`}</GreyValue>
                <GreenValue>
                  {formatValue(currentPortfolioData.portfolioValue)}
                </GreenValue>
              </PortfolioValuesBlock>
            </PortfolioValues>
            {/* edit portfolio name */}
            <PortfolioSelectorPopup
              isPortfolio={true}
              needPortal={true}
              dotsColor={'#7284A0'}
              data={currentPortfolioData}
            />
          </ChangePortfolioBlock>
          <CreatePortfolio
            baseCoin={'USDT'}
            existCustomButton={true}
            CustomButton={({ handleClick }) => (
              <CreatePortfolioButton onClick={handleClick}>
                <StyledAddIcon />
                <Typography>create new portfolio</Typography>
              </CreatePortfolioButton>
            )}
          />
        </CurrentPortfolioBlock>

        {/* account table */}
        <GridBlock height={'86%'}>
          <ProfileAccountsTable accounts={accounts} />
        </GridBlock>
      </ContentContainer>
    </MainContainer>
  )
}

export default ProfileAccounts
