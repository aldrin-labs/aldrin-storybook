import React from 'react'

import {
  MainContainer,
  StatisticContainer,
  ContentContainer,
  GridBlock,
  PortfoliosBlock,
  SummaryAccountsBlock,
  CurrentPortfolioBlock,
  PortfoliosValue,
  AccountsValue,
  AccountsChartBlock,
  GridTitle,
  GreenValue,
  BigNumberValue,
  ChangePortfolioBlock,
  CreatePortfolioButton,
} from './ProfileAccounts.styles'

import { ComingSoonBlock } from '@sb/compositions/Profile/compositions/ProfileRouter/ProfileRouter'

const ProfileAccounts = (props) => {
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
          <ChangePortfolioBlock>change portfolio etc</ChangePortfolioBlock>
          <CreatePortfolioButton>create portfolio +</CreatePortfolioButton>
        </CurrentPortfolioBlock>

        {/* account table */}
        <GridBlock height={'86%'}>table with accounts</GridBlock>
      </ContentContainer>
    </MainContainer>
  )
}

export default ProfileAccounts
