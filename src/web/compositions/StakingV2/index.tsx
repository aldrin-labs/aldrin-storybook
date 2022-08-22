import React, { useState } from 'react'
import { compose } from 'recompose'

import { Page } from '@sb/components/Layout'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { toMap } from '@sb/utils'

import { getDexTokensPrices as getDexTokensPricesQuery } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getStakingInfo as getStakingInfoQuery } from '@core/graphql/queries/staking/getStakingInfo'

import CoinsBg from './components/Icons/coins.webp'
import { MarinadeStaking } from './components/Popups/MarinadeStaking/index'
import { StSolStaking } from './components/Popups/StSolStaking/index'
import { TableRow } from './components/TableRow'
import { stakeTokens } from './config'
import {
  StyledWideContent,
  ThinHeading,
  TotalStakedCard,
  TotalStakedRow,
  TotalStaked,
  ImageContainer,
} from './index.styles'
import { StakingPageProps } from './types'

const Block: React.FC<StakingPageProps> = (props) => {
  const {
    getStakingInfoQuery: { getStakingInfo = [] },
    getDexTokensPricesQuery: { getDexTokensPrices = [] },
  } = props

  const stakingDataMap = toMap(getStakingInfo.farming, (farming) =>
    farming?.stakeMint.toString()
  )

  const dexTokensPricesMap = toMap(getDexTokensPrices, (price) => price.symbol)

  const [isMSolStakingPopupOpen, setIsMSolStakingPopupOpen] = useState(false)
  const [isStSolStakingPopupOpen, setIsStSolStakingPopupOpen] = useState(false)

  console.log({ getStakingInfo })

  return (
    <Page>
      <StyledWideContent>
        <TotalStakedRow>
          <TotalStakedCard>
            <ThinHeading>Total Staked</ThinHeading>
            <TotalStaked>$ 4.42m</TotalStaked>
          </TotalStakedCard>
          <ImageContainer>
            <img alt="rin" src={CoinsBg} width="100%" height="100%" />
          </ImageContainer>
        </TotalStakedRow>
        {stakeTokens.map((token) => (
          <TableRow
            dexTokensPricesMap={dexTokensPricesMap}
            stakingDataMap={stakingDataMap}
            setIsStSolStakingPopupOpen={setIsStSolStakingPopupOpen}
            setIsMSolStakingPopupOpen={setIsMSolStakingPopupOpen}
            getStakingInfo={getStakingInfo}
            token={token}
          />
        ))}
      </StyledWideContent>
      {isMSolStakingPopupOpen && (
        <MarinadeStaking
          open={isMSolStakingPopupOpen}
          onClose={() => setIsMSolStakingPopupOpen(false)}
          getDexTokensPricesQuery={getDexTokensPrices}
        />
      )}
      {isStSolStakingPopupOpen && (
        <StSolStaking
          open={isStSolStakingPopupOpen}
          onClose={() => setIsStSolStakingPopupOpen(false)}
        />
      )}
    </Page>
  )
}

export const StakingPage: any = compose(
  queryRendererHoc({
    query: getDexTokensPricesQuery,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  }),
  queryRendererHoc({
    query: getStakingInfoQuery,
    name: 'getStakingInfoQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(Block)
