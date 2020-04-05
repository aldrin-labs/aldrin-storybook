import React from 'react'
import dayjs from 'dayjs'
import { withTheme } from '@material-ui/styles'
import styled, { createGlobalStyle } from 'styled-components'
import { compose } from 'recompose'
// import Joyride from 'react-joyride'
import { getStartDate } from '@sb/components/TradingTable/TradingTable.utils'
import { graphql } from 'react-apollo'

import { IProps, IState } from './PortfolioMainPage.types'
// import PortfolioMainChart from '@core/containers/PortfolioMainChart/PortfolioMainChart'
// import TradeOrderHistory from '@core/containers/TradeOrderHistory/TradeOrderHistory'
import PortfolioMainTable from '@core/containers/PortfolioMainTable/PortfolioMainTable'
import PortfolioMainFuturesTable from '@core/containers/PortfolioMainTable/FuturesTableWrapper'
import PortfolioMainAllocation from '@core/containers/PortfolioMainAllocation'
// import { portfolioMainSteps } from '@sb/config/joyrideSteps'
import { combineTableData } from '@core/utils/PortfolioTableUtils.ts'
import { getPortfolioAssetsData } from '@core/utils/Overview.utils'

import Template from '@sb/components/Template/Template'
// import SharePortfolioDialog from '@sb/components/SharePortfolioDialog/SharePortfolioDialog'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { client } from '@core/graphql/apolloClient'
import { writeQueryData } from '@core/utils/TradingTable.utils'

import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { sharePortfolio } from '@core/graphql/mutations/portfolio/sharePortfolio'
import { getPageType } from '@core/graphql/queries/portfolio/main/getPageType'

import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'

import { Grid, Divider } from '@material-ui/core'
// import TransactionPage from '@sb/compositions/Transaction/TransactionPage'
import SharePortfolioPanel from '@core/components/SharePortfolioPanel/SharePortfolioPanel'
import AccordionOverview from '@sb/components/AccordionOverview/AccordionOverView'
import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'

import { portfolioMainSteps } from '@sb/config/joyrideSteps'
import { finishJoyride } from '@core/utils/joyride'
import {
  prefetchFuturesTransactions,
  prefetchSpotChart,
  prefetchFuturesChart,
  prefetchSpotTransactions,
} from '@core/utils/prefetching'

// Padding based on navbar padding (3rem on sides)
// TODO: Fix this. Find the way to remove sidebar and get rid of these hacks
const LayoutClearfixWrapper = styled.div`
  @media only screen and (min-width: 600px) {
    padding-right: calc(2.5% + 3rem);
  }
`
@withTheme()
class PortfolioMainPage extends React.Component<IProps, IState> {
  state: IState = {
    key: 0,
    stepIndex: 0,
    startDate: dayjs()
      .startOf('day')
      .subtract(7, 'day'),
    endDate: dayjs().endOf('day'),
    openSharePortfolioPopUp: false,
  }

  componentDidMount() {
    setTimeout(() => {
      prefetchFuturesChart()
    }, 15000)

    setTimeout(() => {
      prefetchFuturesTransactions()
    }, 30000)

    setTimeout(() => {
      prefetchSpotTransactions()
    }, 45000)
  }

  choosePeriod = (stringDate: string) => {
    this.setState({
      startDate: getStartDate(stringDate),
      endDate: dayjs().endOf('day'),
    })
  }

  handleOpenSharePortfolio = () => {
    this.setState({
      openSharePortfolioPopUp: true,
    })
  }

  handleCloseSharePortfolio = () => {
    this.setState({
      openSharePortfolioPopUp: false,
    })
  }

  handleJoyrideCallback = (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      const {
        updateTooltipSettingsMutation,
        getTooltipSettingsQuery: { getTooltipSettings },
      } = this.props

      finishJoyride({
        updateTooltipSettingsMutation,
        getTooltipSettings,
        name: 'portfolioMain',
      })
    }

    switch (data.action) {
      case 'next': {
        if (data.lifecycle === 'complete') {
          this.setState((prev) => ({ stepIndex: prev.stepIndex + 1 }))
        }
        break
      }
      case 'prev': {
        if (data.lifecycle === 'complete') {
          this.setState((prev) => ({ stepIndex: prev.stepIndex - 1 }))
        }
        break
      }
    }

    if (
      data.status === 'finished' ||
      (data.status === 'stop' && data.index !== data.size - 1) ||
      data.status === 'reset'
    ) {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  render() {
    const {
      theme,
      dustFilter,
      // sharePortfolioMutation,
      // portfolioId,
      portfolioName,
      portfolioKeys,
      isUSDCurrently,
      portfolioAssets: assets,
      baseCoin,
      getTooltipSettingsQuery: { getTooltipSettings },
      getPageTypeQuery: {
        portfolio: { pageType },
      },
      // getFuturesOverviewQuery: { getFuturesOverview },
    } = this.props

    const isSPOTCurrently = pageType === 'SPOT'
    // const { openSharePortfolioPopUp } = this.state

    const accountsNames = portfolioKeys
      .filter((key) => key.selected)
      .map((key) => key.name)

    const enabledAssets = assets.myPortfolios[0].portfolioAssets.filter(
      (asset) => accountsNames.includes(asset.name)
    )

    const filteredData = combineTableData(
      enabledAssets || [],
      dustFilter,
      isUSDCurrently
    )

    const {
      portfolioAssetsData,
      totalKeyAssetsData,
      portfolioAssetsMap,
    } = getPortfolioAssetsData(filteredData, baseCoin)

    return (
      <LayoutClearfixWrapper>
        <Grid style={{ height: '100%' }}>
          <div
            id="sharePortfolioPanel"
            style={{ minHeight: '17.2vh', position: 'relative' }}
          >
            <SharePortfolioPanel
              handleOpenSharePortfolio={this.handleOpenSharePortfolio}
              portfolioName={portfolioName}
              baseCoin={baseCoin}
              isSPOTCurrently={isSPOTCurrently}
              isUSDCurrently={isUSDCurrently}
              choosePeriod={this.choosePeriod}
            />
            {/* TODO: Recomment if needed <Divider /> */}
            <AccordionOverview
              baseCoin={baseCoin}
              isSPOTCurrently={isSPOTCurrently}
              isUSDCurrently={isUSDCurrently}
              // getFuturesOverview={getFuturesOverview}
              portfolioAssetsData={portfolioAssetsData}
              portfolioAssetsMap={portfolioAssetsMap}
              totalKeyAssetsData={totalKeyAssetsData}
            />
          </div>

          <Template
            isSPOTCurrently={isSPOTCurrently}
            PortfolioMainFuturesTable={
              <PortfolioMainFuturesTable
                startDate={this.state.startDate}
                endDate={this.state.endDate}
              />
            }
            PortfolioMainTable={
              <PortfolioMainTable
                data={{ myPortfolios: [{ portfolioAssets: enabledAssets }] }}
                theme={theme}
                dustFilter={dustFilter}
                baseCoin={baseCoin}
                isUSDCurrently={isUSDCurrently}
              />
            }
            Chart={
              <PortfolioMainAllocation
                data={filteredData}
                dustFilter={dustFilter}
                isUSDCurrently={isUSDCurrently}
              />
            }
          />

          <JoyrideOnboarding
            continuous={true}
            stepIndex={this.state.stepIndex}
            showProgress={true}
            showSkipButton={true}
            steps={portfolioMainSteps}
            open={getTooltipSettings.portfolioMain}
            // run={false}
            handleJoyrideCallback={this.handleJoyrideCallback}
            key={this.state.key}
            // styles={{
            //   options: {
            //     backgroundColor: theme.palette.getContrastText(
            //       theme.palette.primary.main
            //     ),
            //     primaryColor: theme.palette.secondary.main,
            //     textColor: theme.palette.primary.main,
            //   },
            //   tooltip: {
            //     fontFamily: theme.typography.fontFamily,
            //     fontSize: theme.typography.fontSize,
            //   },
            // }}
          />

          {/* <SharePortfolioDialog
            portfolioKeys={portfolioKeys}
            portfolioId={portfolioId}
            sharePortfolioTitle={portfolioName}
            openSharePortfolioPopUp={openSharePortfolioPopUp}
            sharePortfolioMutation={sharePortfolioMutation}
            handleCloseSharePortfolio={this.handleCloseSharePortfolio}
          /> */}
        </Grid>
      </LayoutClearfixWrapper>
    )
  }
}

export default compose(
  queryRendererHoc({
    query: GET_TOOLTIP_SETTINGS,
    name: 'getTooltipSettingsQuery',
    fetchPolicy: 'cache-and-network',
  }),
  queryRendererHoc({
    query: getPageType,
    name: 'getPageTypeQuery',
  }),
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
  }),
  graphql(sharePortfolio, {
    name: 'sharePortfolioMutation',
  }),
  withErrorFallback
)(PortfolioMainPage)
