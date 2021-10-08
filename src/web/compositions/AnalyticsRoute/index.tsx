import React, { useEffect } from 'react'
import { compose } from 'recompose'
import { withTheme } from '@material-ui/core/styles'

import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { withPublicKey } from '@core/hoc/withPublicKey'

import { GlobalStyles } from '@sb/compositions/Chart/Chart.styles'
import TopBar from './components/TopBar/TopBar'
import MarketInfo from './components/MarketInfo/MarketInfo'
import PairSelector from './components/PairSelector'
import AreaVolumeChart from './components/AreaCharts/AreaVolumeChart'
import CountButterflyChart from './components/ButterflyCharts/CountButterflyChart'
import AverageButterflyChart from './components/ButterflyCharts/AverageButterflyChart'

import { IProps } from './index.types'

import {
  Row,
  RowContainer,
  BlockTemplate,
  Container,
  MainContentContainer,
  TopBarContainer,
} from './index.styles'

const AnalyticsRoute = ({
  markets,
  theme,
  publicKey,
  selectedPair,
}: IProps) => {
  const isAllMarketsSelected = selectedPair === 'all'

  return (
    <Container theme={theme}>
      <RowContainer height="100%" direction="column">
        <TopBarContainer theme={theme} justify="space-between">
          <TopBar theme={theme} />
        </TopBarContainer>
        <MainContentContainer height="100%">
          <BlockTemplate
            width="calc(17% - .4rem)"
            height="calc(100% - .1rem)"
            margin="0 0.4rem 0 0"
            theme={theme}
          >
            <PairSelector
              theme={theme}
              publicKey={publicKey}
              selectedPair={selectedPair}
            />
          </BlockTemplate>
          <Row
            width="calc(83% - 0.4rem)"
            margin="0 0 0 0.4rem"
            height="100%"
            style={{ overflowY: 'auto' }}
          >
            {isAllMarketsSelected ? null : (
              <MarketInfo
                theme={theme}
                selectedPair={selectedPair}
                marketType={0}
              />
            )}
            <RowContainer
              height="calc(50% - 0.4rem)"
              margin="0 0 .4rem 0"
              theme={theme}
            >
              <BlockTemplate
                width="calc(50% - .4rem)"
                height="100%"
                margin="0 .4rem 0 0"
                theme={theme}
                style={{ position: 'relative' }}
              >
                <CountButterflyChart
                  theme={theme}
                  selectedPair={selectedPair === 'all' ? 'ALL' : selectedPair}
                />
              </BlockTemplate>
              <BlockTemplate
                width="calc(50% - .4rem)"
                height="100%"
                margin="0 0 0 .4rem"
                theme={theme}
                style={{ position: 'relative' }}
              >
                <AverageButterflyChart
                  theme={theme}
                  selectedPair={selectedPair === 'all' ? 'ALL' : selectedPair}
                />
              </BlockTemplate>
            </RowContainer>
            <BlockTemplate
              width="100%"
              height="calc(50% - 0.4rem)"
              margin=".4rem 0 0 0"
              theme={theme}
              style={{ position: 'relative' }}
            >
              <AreaVolumeChart
                theme={theme}
                selectedPair={selectedPair === 'all' ? 'ALL' : selectedPair}
              />
            </BlockTemplate>
          </Row>
        </MainContentContainer>
      </RowContainer>
    </Container>
  )
}

export default compose(
  withPublicKey,
  withTheme(),
  withMarketUtilsHOC
)(AnalyticsRoute)
