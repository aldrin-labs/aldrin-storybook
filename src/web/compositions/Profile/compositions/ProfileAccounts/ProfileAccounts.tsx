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

import PortfolioSelectorPopup from '@sb/components/PortfolioSelectorPopup/PortfolioSelectorPopup'
import { ComingSoonBlock } from '@sb/compositions/Profile/compositions/ProfileRouter/ProfileRouter'

const ProfileAccounts = ({
  currentPortfolioData,
  portfolioAccountsData: { keys: accounts },
  ...props
}) => {
  console.log('props', props)

  return (
    <MainContainer>
      <StatisticContainer>
        {/* total portfolios */}
        <PortfoliosBlock>
          <GridTitle>total portfolios</GridTitle>
          <PortfoliosValue>
            <GreenValue>$10,000</GreenValue>
            <BigNumberValue>1</BigNumberValue>
          </PortfoliosValue>
        </PortfoliosBlock>

        {/* summary accounts */}
        <SummaryAccountsBlock height={'42%'}>
          <GridTitle>summary accounts</GridTitle>
          <AccountsValue>
            <BigNumberValue>5</BigNumberValue>
          </AccountsValue>
          <AccountsChartBlock>
            <GridTitle>chart</GridTitle>
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
                <ChangePortfolioArrow>
                  <KeyboardArrowUp />
                </ChangePortfolioArrow>
                {/* next portfolio */}
                <ChangePortfolioArrow>
                  <KeyboardArrowDown />
                </ChangePortfolioArrow>
              </ChangePortfolioArrowsBlock>

              {/* current portfolio values */}
              <PortfolioValuesBlock>
                <PortfolioName>trade portfolio 1</PortfolioName>
                <GreyValue>5 accounts</GreyValue>
                <GreenValue>$10,000</GreenValue>
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
          <CreatePortfolioButton>
            <StyledAddIcon />
            <Typography>create new portfolio</Typography>
          </CreatePortfolioButton>
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
