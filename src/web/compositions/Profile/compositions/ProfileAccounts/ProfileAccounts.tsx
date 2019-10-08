import React from 'react'

import {
  MainContainer,
  StatisticContainer,
  ContentContainer,
  GridBlock,
  PortfolioBlock,
} from './ProfileAccounts.styles'

import { ComingSoonBlock } from '@sb/compositions/Profile/compositions/ProfileRouter/ProfileRouter'

const ProfileAccounts = () => {
  return (
    <MainContainer>
      <StatisticContainer>
        <PortfolioBlock>total portfolio</PortfolioBlock>
        {/* summary accounts */}
        <GridBlock height={'42%'}>summary accounts</GridBlock>
        {/* temporary empty block */}
        <GridBlock height={'44%'}>
          <ComingSoonBlock />
        </GridBlock>
      </StatisticContainer>
      <ContentContainer>
        <PortfolioBlock>change portfolio etc</PortfolioBlock>
        <GridBlock height={'86%'}>table with accounts</GridBlock>
      </ContentContainer>
    </MainContainer>
  )
}

export default ProfileAccounts
