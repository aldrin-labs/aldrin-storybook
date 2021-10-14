import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
// import Joyride from 'react-joyride'
import { withTheme } from '@material-ui/styles'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import Tour from 'reactour'
// import { Grid, Hidden } from '@material-ui/core'

import {
  tourConfig,
  FinishBtn,
} from '@sb/components/ReactourOnboarding/ReactourOnboarding'
// import { CardsPanel } from './components'

import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { finishJoyride } from '@core/utils/joyride'
// import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getUserCustomMarkets } from '@core/graphql/queries/serum/getUserCustomMarkets'

import { MainContainer } from '@sb/compositions/Chart/Chart.styles'

import { useAllMarketsList, useMarket } from '@sb/dexUtils/markets'
import { getDecimalCount } from '@sb/dexUtils/utils'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { useAwesomeMarkets } from '@core/utils/awesomeMarkets/serum'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { withRegionCheck } from '@core/hoc/withRegionCheck'
// import { ParticleRuggedPopup } from '@sb/components/ParticleRuggedPopup'
import { TokenDelistPopup } from '@sb/components/TokenDelistPopup'
import { tokensToDelist } from '@core/config/dex'
import { TransactionsConfirmationWarningPopup } from '@sb/components/TransactionsConfirmationWarningPopup/TransactionsConfirmationWarningPopup'
import { ProposeToSettlePopup } from '@sb/components/ProposeToSettlePopup/ProposeToSettlePopup'
import { MarketDeprecatedPopup } from '@sb/components/MarketDeprecatedPopup/MarketDeprecatedPopup'
import MarketBlock from './components/MarketBlock/MarketBlock'
import { WarningPopup } from './components/WarningPopup'
import DefaultView from './DefaultView/StatusWrapper'

const arraysCustomMarketsMatch = (arr1, arr2) => {
  // Check if the arrays are the same length
  if (arr1.length !== arr2.length) return false

  // Check if all items exist and are in the same order
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].symbol !== arr2[i].symbol) return false
  }

  // Otherwise, return true
  return true
}

interface ChartPageProps {
  selectedPair: string
  marketType: 0 | 1
}

const ChartPageComponent: React.FC<ChartPageProps> = (props) => {
  const {
    theme,
    getTooltipSettingsQuery: {
      getTooltipSettings = { chartPage: false, chartPagePopup: false },
    } = {
      getTooltipSettings: { chartPage: false, chartPagePopup: false },
    },
    marketType,
    selectedPair,
    setCustomMarkets,
    getUserCustomMarketsQuery = { getUserCustomMarkets: [] },
    location,
    history,
    customMarkets,
    publicKey,
  } = props

  const [terminalViewMode, updateTerminalViewMode] = useState('default')
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [isWarningPopupOpen, openWarningPopup] = useState(false)
  const [isDelistPopupOpen, openDelistPopup] = useState(false)

  const [isNotificationTourOpen, setNotificationTourOpen] = useState(
    localStorage.getItem('isNotificationDone') == 'null'
  )

  const allMarketsMap = useAllMarketsList()
  const AWESOME_MARKETS = useAwesomeMarkets()

  useEffect(() => {
    return () => {
      document.title = 'Aldrin'
    }
  }, [props.marketType])

  useEffect(() => {
    const userMarkets = getUserCustomMarketsQuery.getUserCustomMarkets.map(
      ({ publicKey, marketId, isPrivate, ...rest }) => ({
        ...rest,
        name: rest.symbol,
        address: marketId,
        isCustomUserMarket: true,
        isPrivateCustomMarket: isPrivate,
      })
    )

    const savedCustomMarkets = localStorage.getItem('customMarkets') || '[]'

    const updatedMarkets = AWESOME_MARKETS.map((el) => ({
      ...el,
      address: el.address.toString(),
      programId: el.programId.toString(),
      isCustomUserMarket: true,
    }))

    const isDataChanged = !arraysCustomMarketsMatch(
      JSON.parse(savedCustomMarkets),
      [...updatedMarkets, ...userMarkets]
    )

    if (isDataChanged) setCustomMarkets([...updatedMarkets, ...userMarkets])
  }, [getUserCustomMarketsQuery.getUserCustomMarkets.length])

  const setCorrectMarketAddress = async () => {
    const pair = location.pathname.split('/')[3]
      ? location.pathname.split('/')[3]
      : 'RIN_USDC'

    const userMarkets = getUserCustomMarketsQuery.getUserCustomMarkets.map(
      ({ publicKey, marketId, isPrivate, ...rest }) => ({
        ...rest,
        name: rest.symbol,
        address: marketId,
        isCustomUserMarket: true,
        isPrivateCustomMarket: isPrivate,
      })
    )

    const UPDATED_AWESOME_MARKETS = AWESOME_MARKETS.map((el) => ({
      ...el,
      address: el.address.toString(),
      programId: el.programId.toString(),
      isCustomUserMarket: true,
    }))

    const updatedMarkets = [...props.markets, ...UPDATED_AWESOME_MARKETS]

    const allMarkets = [...updatedMarkets, ...userMarkets]

    const selectedMarketFromUrl = allMarkets.find(
      (el) => el.name.replaceAll('_', '/') === pair.replaceAll('_', '/')
    )

    if (!selectedMarketFromUrl) {
      history.push('/chart/spot/RIN_USDC')
      return
    }

    const isCustomUsersMarket = updatedMarkets?.find(
      (el) => el.name.replaceAll('_', '/') === pair.replaceAll('_', '/')
    )

    const isPublicUsersMarket = userMarkets?.find(
      (el) => el.name.replaceAll('_', '/') === pair.replaceAll('_', '/')
    )

    if (isPublicUsersMarket !== undefined && !isCustomUsersMarket) {
      openWarningPopup(true)
    }
  }

  const [base, quote] = selectedPair.split('_')
  const tokenToDelist = tokensToDelist[base] || tokensToDelist[quote]

  useEffect(() => {
    setCorrectMarketAddress()
    if (tokenToDelist) {
      openDelistPopup(true)
    }
  }, [selectedPair])

  const closeChartPagePopup = () => {
    finishJoyride({
      updateTooltipSettingsMutation: props.updateTooltipSettingsMutation,
      getTooltipSettings,
      name: 'chartPagePopup',
    })
  }

  const { market } = useMarket()

  let minPriceDigits
  let quantityPrecision
  let pricePrecision
  let minSpotNotional
  let minFuturesStep
  let initialLeverage

  const isPairDataLoading = false

  quantityPrecision =
    market?.minOrderSize && getDecimalCount(market.minOrderSize)

  pricePrecision = market?.tickSize && getDecimalCount(market.tickSize)

  const accentColor = '#09ACC7'

  return (
    <MainContainer fullscreen={false}>
      {/* {!isTourOpen && (
        <Tour
          className="my-helper"
          showCloseButton={false}
          showNumber={false}
          nextButton={null}
          prevButton={<a />}
          showNavigationNumber={false}
          showButtons={false}
          showCloseButton={false}
          showNavigation={false}
          lastStepNextButton={null}
          steps={notificationTourConfig}
          accentColor={accentColor}
          isOpen={isNotificationTourOpen}
          onRequestClose={() => {
            setNotificationTourOpen(false)
            localStorage.setItem('isNotificationDone', 'true')
          }}
        />
      )} */}
      <Tour
        showCloseButton={false}
        nextButton={<FinishBtn>Next</FinishBtn>}
        prevButton={<a />}
        showNavigationNumber
        showNavigation
        lastStepNextButton={<FinishBtn>Finish</FinishBtn>}
        steps={tourConfig}
        accentColor={accentColor}
        isOpen={isTourOpen}
        onRequestClose={() => {
          setIsTourOpen(false)
          localStorage.setItem('isOnboardingDone', 'true')
        }}
      />
      <MarketBlock
        terminalViewMode={terminalViewMode}
        updateTerminalViewMode={updateTerminalViewMode}
      />
      <DefaultView
        id="_id"
        view="default"
        theme={theme}
        publicKey={publicKey}
        marketType={marketType}
        currencyPair={selectedPair}
        maxLeverage={initialLeverage}
        pricePrecision={pricePrecision}
        quantityPrecision={quantityPrecision}
        minPriceDigits={minPriceDigits}
        minSpotNotional={minSpotNotional}
        minFuturesStep={minFuturesStep}
        isPairDataLoading={
          isPairDataLoading || !pricePrecision || !quantityPrecision
        }
        themeMode={theme.palette.type}
        selectedKey={{ hedgeMode: false }}
        activeExchange="serum"
        terminalViewMode={terminalViewMode}
        updateTerminalViewMode={(mode) => {
          if (mode === 'smartOrderMode') {
            finishJoyride({
              updateTooltipSettingsMutation:
                props.updateTooltipSettingsMutation,
              getTooltipSettings,
              name: 'chartPagePopup',
            })
          }

          updateTerminalViewMode(mode)
        }}
        chartProps={props}
        arrayOfMarketIds={[]}
        chartPagePopup={
          (getTooltipSettings.chartPagePopup === null ||
            getTooltipSettings.chartPagePopup) &&
          !getTooltipSettings.chartPage
        }
        closeChartPagePopup={closeChartPagePopup}
      />

      <WarningPopup
        open={isWarningPopupOpen}
        onClose={() => openWarningPopup(false)}
        theme={theme}
      />

      <TokenDelistPopup
        open={isDelistPopupOpen}
        onClose={() => openDelistPopup(false)}
        theme={theme}
        tokenToDelist={tokenToDelist}
      />

      <TransactionsConfirmationWarningPopup theme={theme} />
      {/* <SettleWarningPopup theme={theme} /> */}
      <ProposeToSettlePopup theme={theme} />
      <MarketDeprecatedPopup
        theme={theme}
        newMarketID={allMarketsMap.get('LIQ_USDC')?.address.toString()}
        oldMarketID={allMarketsMap
          .get('LIQ_USDC_deprecated')
          ?.address.toString()}
      />
      {/* <AldrinIsOverCapacityPopup theme={theme} /> */}
      {/* <RpcCapacityWarningPopup theme={theme} /> */}

      {/* )} */}
      {/* <JoyrideOnboarding
        continuous={true}
        stepIndex={stepIndex}
        showProgress={true}
        showSkipButton={true}
        key={key}
        steps={getChartSteps({ marketType })}
        open={getTooltipSettings.chartPage}
        handleJoyrideCallback={handleJoyrideCallback}
      /> */}
    </MainContainer>
  )
}

const ChartPage = ChartPageComponent

// TODO: combine all queries to one
export default compose<ChartPageProps, any>(
  withMarketUtilsHOC,
  withErrorFallback,
  withTheme(),
  withPublicKey,
  withRouter,
  withRegionCheck,
  queryRendererHoc({
    query: getUserCustomMarkets,
    name: 'getUserCustomMarketsQuery',
    fetchPolicy: 'cache-and-network',
    variables: (props) => ({
      publicKey: props.publicKey,
    }),
  }),
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
  })
)(ChartPage)
