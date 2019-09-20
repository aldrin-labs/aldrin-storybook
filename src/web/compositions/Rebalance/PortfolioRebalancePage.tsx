import React, { Component } from 'react'
import { compose } from 'recompose'

import { buildStyles } from 'react-circular-progressbar'
import CircularProgressbar from '@sb/components/ProgressBar/CircularProgressBar'
import Joyride from 'react-joyride'

import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { SnackbarProvider, withSnackbar } from 'notistack'
import { withStyles } from '@material-ui/core/styles'

import { createGlobalStyle } from 'styled-components'

import { REBALANCE_CONFIG } from '@core/config/rebalanceConfig'

import { Container as Content } from '@sb/styles/cssUtils'
import { portfolioRebalanceSteps } from '@sb/config/joyrideSteps'
import DialogComponent from '@sb/components/RebalanceDialog/RebalanceDialog'

import PortfolioRebalanceChart from '@core/containers/PortfolioRebalanceChart/PortfolioRebalanceChart'
import {
  TypographyAccordionTitle,
  TypographyProgress,
  GridProgressTitle,
  GridTransactionBtn,
  GridTransactionTypography
} from './PortfolioRebalancePage.styles'
import { withTheme } from '@material-ui/styles'
import { Grid } from '@material-ui/core'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { graphql } from 'react-apollo'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'

import { IState, IProps } from './PortfolioRebalancePage.types'

// Rebalance Panel
import RebalanceInfoPanel from '@sb/components/RebalanceInfoPanel/RebalanceInfoPanel'
import RebalanceAccordionIndex from '@sb/components/RebalanceAccorionIndex/RebalanceAccordionIndex'
import RebalanceDialogTransaction from '@sb/components/RebalanceDialogTransaction/RebalanceDialogTransaction'
import RebalanceDialogAdd from '@sb/components/RebalanceDialogAdd/RebalanceDialogAdd'
import RebalanceAddSocialPortfolio from '@sb/components/RebalanceAddSocialPortfolio'
import PortfolioRebalanceTableContainer from '@core/containers/PortfolioRebalanceTableContainer/PortfolioRebalanceTableContainer'

import RouteLeavingGuard from '@sb/components/RouteLeavingGuard'
import RebalanceDialogLeave from '@sb/components/RebalanceDialogLeave/RebalanceDialogLeave'

import {
  rebalanceOption,
  addIndexData,
  targetAllocation,
} from './mockData'

import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

const RebalanceMediaQuery = createGlobalStyle`
  @media only screen and (min-width: 2560px) {
    html {
      font-size: 15px;
    }
  }
`

const canselStyeles = theme => ({
  icon: {
    fontSize: 20,
  }
})

const snackStyeles = theme => ({
  success: { backgroundColor: theme.customPalette.green.main },
  error: { backgroundColor: theme.customPalette.red.main },
})

const CloseButton = withStyles(canselStyeles)((props) => (
  <IconButton
    key="close"
    aria-label="Close"
    color="inherit"
  >
    <CloseIcon className={props.classes.icon} />
</IconButton>
))

@withTheme()
class PortfolioRebalancePage extends Component<IProps, IState> {
  state = {
    key: 0,
    openDialogTransaction: false,
    isSectionChart: false,
    isPanelExpanded: false,
    progress: null,
    rebalanceFinished: false,
    rebalanceError: false
  }

  getRebalanceProgress = ({
      rebalanceStarted,
      rebalanceFinished,
      failedTransactionIndex,
      oldProgress,
      transactions
  }) => {
    let progress
    if (failedTransactionIndex !== -1) {
      this.setState({
        rebalanceError: true
      })
      progress = 'N/A'
      this.props.enqueueSnackbar(transactions[failedTransactionIndex].error.message, { variant: 'error' })
    } else if (rebalanceStarted || oldProgress === 0 && !rebalanceFinished) {
      progress = Math.round(transactions.reduce((progress, transaction) => {
        return transaction.isDone ? progress + (100 / transactions.length) : progress
      }, 0))
    } else if (oldProgress !== null) {
      this.setState({
        progress: null
      })
      progress = null
    }

    return progress
  }

  getRebalanceStatus = (transactions, oldProgress) => {
    const rebalanceStarted = transactions.some(transaction => transaction.isDone === 'loading')
    const rebalanceFinished = transactions.every(transaction => transaction.isDone)
    const failedTransactionIndex = transactions.findIndex(transaction => transaction.error !== undefined)

    const status = this.getRebalanceProgress({
      rebalanceStarted,
      rebalanceFinished,
      failedTransactionIndex,
      oldProgress,
      transactions
    })
    
    if (status === 100 || failedTransactionIndex !== -1) {
      this.setState({
        rebalanceFinished: true
      })

      // Here we create bogus delay so user can notice that rebalance finished
      setTimeout(() => {
        this.setState({
          rebalanceFinished: false,
          rebalanceError: false
        })
      }, REBALANCE_CONFIG.bogusAfterRebalanceDelay)
    }

    return status
  }

  emitExecutingRebalanceHandler = () => {
    this.setState({
      progress: 0
    })

    this.props.executeRebalanceHandler()
  }

  onChangeExpandedPanel = () => {
    this.setState((prevstate) => ({
      isPanelExpanded: !prevstate.isPanelExpanded,
    }))
  }

  toggleSectionCoinChart = () => {
    this.setState({
      isSectionChart: !this.state.isSectionChart,
    })
  }

  handleJoyrideCallback = async (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      const {
        updateTooltipSettingsMutation,
        getTooltipSettingsQuery: { getTooltipSettings },
        theme: {
          palette: { blue, red, green },
        },
      } = this.props

      await updateTooltipSettingsMutation({
        variables: {
          settings: {
            ...removeTypenameFromObject(getTooltipSettings),
            portfolioRebalance: false,
          },
        },
      })
    }
    if (data.status === 'finished') {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  handleOpenTransactionWindow = () => {
    this.setState(
      {
        openDialogTransaction: true,
      },
      // set to default state, if you open again and cancel all previous actions
      () => {
        this.props.setTransactions()
      }
    )
  }

  handleCloseTransactionWindow = () => {
    this.setState({ openDialogTransaction: false })
  }

  render() {
    const {
      totalStaticRows,
      totalRows,
      isEditModeEnabled,
      undistributedMoney,
      isPercentSumGood,
      totalPercents,
      totalTableRows,
      totalSnapshotRows,
      rows,
      staticRows,
      leftBar,
      rightBar,
      loading,
      staticRowsMap,
      openWarning,
      isSystemError,
      warningMessage,
      isSaveError,
      isCurrentAssetsChangedError,
      isDustFilterError,
      children,
      isUSDCurrently,
      theme,
      theme: { palette, customPalette },
      timestampSnapshot,
      onDiscardChanges,
      onSaveClick,
      onReset,
      onEditModeEnable,
      updateState,
      onNewSnapshot,
      hideWarning,
      createNewSnapshot,
      dustFilter,
      showWarning,
      getTooltipSettingsQuery: { getTooltipSettings },
      sliderStep,
      theme: {
        palette: {
          blue,
          background: { table },
        },
      },
      transactions,
      rebalanceTimePeriod,
      onRebalanceTimerChange,
      isUserHasLockedBalance,
      history,
      slippageValue,
      onChangeSlippage,
      rebalanceIsExecuting,
      hideLeavePopup,
      // search,
      // searchCoinInTable,
    } = this.props

    const { progress, rebalanceFinished, rebalanceError } = this.state

    const secondary = palette.secondary.main
    const red = customPalette.red.main
    const green = customPalette.green.main
    const fontFamily = theme.typography.fontFamily
    const saveButtonColor = isPercentSumGood ? green : red

    const rebalanceInfoPanelData = {
      accountValue: roundAndFormatNumber(totalSnapshotRows, 3, false),
      availableValue: roundAndFormatNumber(undistributedMoney, 3, false),
      availablePercentage: roundAndFormatNumber(100 - +totalPercents, 3, false),
      // TODO: change after implement period for select
    }

    const sectionPanelData = {
      accordionPanelHeadingBorderColor: '#F29C38',
      accordionPanelHeading: 'free assets',
      secondColValue: roundAndFormatNumber(totalSnapshotRows, 3, false),
      fourthColValue: roundAndFormatNumber(totalTableRows, 3, false),
      percentage: 100,
    }

    const transactionsDataWithPrices = transactions.map((transaction) => {
      const prices = {
        convertedFromPrice: null,
        convertedToPrice: null,
      }

      rows.forEach((row) => {
        if (row.symbol === transaction.convertedFrom)
          prices.convertedFromPrice = row.price
        else if (row.symbol === transaction.convertedTo)
          prices.convertedToPrice = row.price
      })

      return {
        ...transaction,
        ...prices,
      }
    })

    const newProgress = rebalanceFinished ? 100 : this.getRebalanceStatus(transactionsDataWithPrices, progress)

    return (
      <>
        <RebalanceMediaQuery />

        {children}
        <Content
          key={`content`}
          container
          spacing={16}
          style={{
            padding: '0 25px 25px 25px',
            marginLeft: '-3rem',
            alignContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          {/*<Container
            key={`table-container`}
            item
            md={12}
            isEditModeEnabled={isEditModeEnabled}
          />*/}

          {/* REBALANCE INFO PANEL STARTS */}
          <RebalanceInfoPanel
            rebalanceTimePeriod={rebalanceTimePeriod}
            onRebalanceTimerChange={onRebalanceTimerChange}
            toggleSectionCoinChart={() => this.toggleSectionCoinChart()}
            isSectionChart={this.state.isSectionChart}
            rebalanceInfoPanelData={rebalanceInfoPanelData}
            rebalanceOption={rebalanceOption}
          />
          {/* REBALANCE INFO PANEL ENDS */}

          <Grid item lg={5} md={5} style={{ minHeight: '100px', padding: '0' }}>
            <Grid
              style={{
                paddingBottom: '.5rem',
                boxShadow: `0px 0px 15px 0px rgba(30, 30, 30, 0.2)`,
                borderRadius: '20px',
                border: `1px solid ${theme.palette.grey[theme.palette.type]}`,
              }}
            >
              <GridProgressTitle
                bgColor={theme.palette.primary.dark}
                content
                alignItems="center"
              >
                <TypographyProgress textColor={theme.palette.text.subPrimary}>
                  current allocation
                </TypographyProgress>
              </GridProgressTitle>

              <PortfolioRebalanceChart
                key={`current-chart`}
                isTargetChart={false}
                coinData={staticRows}
                isSectionChart={this.state.isSectionChart}
                sectionDataProgress={targetAllocation}
                isPanelExpanded={this.state.isPanelExpanded}
                onChangeExpandedPanel={this.onChangeExpandedPanel}
              />
            </Grid>
          </Grid>

          <GridTransactionBtn
            lg={2}
            md={2}
            justify="center"
            direction="column"
            style={{
              marginTop: '5rem',
            }}
          >
            <GridTransactionTypography>
              {progress !== null ?
               (rebalanceError ? <span>Rebalance is unsuccesful</span> : <span>REBALANCE IS PROCESSING</span>) :
                  <div>Distribute <span>100%</span> of your assets for rebalance.</div>
              }
            </GridTransactionTypography>

            {progress !== null && <CircularProgressbar value={newProgress} text={`${newProgress}%`}/>}

            <RebalanceDialogTransaction
              initialTime={+rebalanceTimePeriod.value}
              accordionTitle="TRANSACTIONS"
              transactionsData={transactionsDataWithPrices}
              open={this.state.openDialogTransaction}
              handleClickOpen={this.handleOpenTransactionWindow}
              handleClose={this.handleCloseTransactionWindow}
              onNewSnapshot={onNewSnapshot}
              slippageValue={slippageValue}
              onChangeSlippage={onChangeSlippage}
              executeRebalanceHandler={this.emitExecutingRebalanceHandler}
              onProgressChange={this.onProgressChange}
              progress={progress}
              rebalanceInfoPanelData={rebalanceInfoPanelData}
            />
          </GridTransactionBtn>

          <Grid
            item
            lg={5}
            md={5}
            style={{
              minHeight: '100px',
              padding: '0',
            }}
          >
            <Grid
              style={{
                paddingBottom: '.5rem',
                boxShadow: `0px 0px 15px 0px rgba(30, 30, 30, 0.2)`,
                borderRadius: '20px',
                border: `1px solid ${theme.palette.grey[theme.palette.type]}`,
              }}
            >
              <GridProgressTitle
                bgColor={theme.palette.primary.dark}
                content
                alignItems="center"
              >
                <TypographyProgress textColor={theme.palette.text.subPrimary}>
                  target allocation
                </TypographyProgress>
              </GridProgressTitle>
              <PortfolioRebalanceChart
                key={`target-chart`}
                isTargetChart={true}
                coinData={rows}
                isSectionChart={this.state.isSectionChart}
                sectionDataProgress={targetAllocation}
                isPanelExpanded={this.state.isPanelExpanded}
                onChangeExpandedPanel={this.onChangeExpandedPanel}
              />
            </Grid>
          </Grid>

          {/* Accordion Table Start */}
          <TypographyAccordionTitle margin={'3rem auto 1rem'}>Portfolio</TypographyAccordionTitle>

          <RebalanceAccordionIndex
            sliderValue={100}
            accordionData={[sectionPanelData]}
          >
            <PortfolioRebalanceTableContainer
              key={`PortfolioRebalanceTableContainer`}
              {...{
                isEditModeEnabled,
                staticRows,
                staticRowsMap,
                totalStaticRows,
                rows,
                totalRows,
                totalPercents,
                totalTableRows,
                isPercentSumGood,
                undistributedMoney,
                isUSDCurrently,
                theme,
                loading,
                red,
                saveButtonColor,
                secondary,
                fontFamily,
                totalSnapshotRows,
                timestampSnapshot,
                onDiscardChanges,
                onSaveClick,
                onReset,
                onEditModeEnable,
                updateState,
                onNewSnapshot,
                dustFilter,
                showWarning,
                hideWarning,
                sliderStep,
                rebalanceIsExecuting,
                rebalanceInfoPanelData
              }}
              // search={search}
              // searchCoinInTable={searchCoinInTable}
            />
          </RebalanceAccordionIndex>

          <TypographyAccordionTitle>indexes</TypographyAccordionTitle>
          {/* <RebalanceAccordionIndex*/}
          {/*isEditModeEnabled={isEditModeEnabled}*/}
          {/*staticRows={staticRows}*/}
          {/*staticRowsMap={staticRowsMap}*/}
          {/*totalStaticRows={totalStaticRows}*/}
          {/*rows={rows}*/}
          {/*totalRows={totalRows}*/}
          {/*totalPercents={totalPercents}*/}
          {/*totalTableRows={totalTableRows}*/}
          {/*isPercentSumGood={isPercentSumGood}*/}
          {/*undistributedMoney={undistributedMoney}*/}
          {/*isUSDCurrently={isUSDCurrently}*/}
          {/*theme={theme}*/}
          {/*loading={loading}*/}
          {/*red={red}*/}
          {/*saveButtonColor={saveButtonColor}*/}
          {/*secondary={secondary}*/}
          {/*fontFamily={fontFamily}*/}
          {/*totalSnapshotRows={totalSnapshotRows}*/}
          {/*timestampSnapshot={timestampSnapshot}*/}
          {/*onDiscardChanges={onDiscardChanges}*/}
          {/*onSaveClick={onSaveClick}*/}
          {/*onReset={onReset}*/}
          {/*onEditModeEnable={onEditModeEnable}*/}
          {/*updateState={updateState}*/}
          {/*onNewSnapshot={onNewSnapshot}*/}
          {/*dustFilter={dustFilter}*/}
          {/*showWarning={showWarning}*/}
          {/*sliderStep={sliderStep}*/}
          {/*accordionData={accordionAddIndexPanelData}*/}
          {/*/> */}

          <RebalanceDialogAdd title={'ADD INDEX'} data={addIndexData} />

          <TypographyAccordionTitle margin="1rem auto">
            Following portfolios
          </TypographyAccordionTitle>

          {/*<RebalanceAccordionIndex*/}
          {/*isEditModeEnabled={isEditModeEnabled}*/}
          {/*staticRows={staticRows}*/}
          {/*staticRowsMap={staticRowsMap}*/}
          {/*totalStaticRows={totalStaticRows}*/}
          {/*rows={rows}*/}
          {/*totalRows={totalRows}*/}
          {/*totalPercents={totalPercents}*/}
          {/*totalTableRows={totalTableRows}*/}
          {/*isPercentSumGood={isPercentSumGood}*/}
          {/*undistributedMoney={undistributedMoney}*/}
          {/*isUSDCurrently={isUSDCurrently}*/}
          {/*theme={theme}*/}
          {/*loading={loading}*/}
          {/*red={red}*/}
          {/*saveButtonColor={saveButtonColor}*/}
          {/*secondary={secondary}*/}
          {/*fontFamily={fontFamily}*/}
          {/*totalSnapshotRows={totalSnapshotRows}*/}
          {/*timestampSnapshot={timestampSnapshot}*/}
          {/*onDiscardChanges={onDiscardChanges}*/}
          {/*onSaveClick={onSaveClick}*/}
          {/*onReset={onReset}*/}
          {/*onEditModeEnable={onEditModeEnable}*/}
          {/*updateState={updateState}*/}
          {/*onNewSnapshot={onNewSnapshot}*/}
          {/*dustFilter={dustFilter}*/}
          {/*showWarning={showWarning}*/}
          {/*sliderStep={sliderStep}*/}
          {/*/>*/}
          {/*accordionData={accordionAddPortfolioPanelData}*/}

          <RebalanceAddSocialPortfolio />

          {/* Accordion Table End */}

          {/* end of a grid */}

          <DialogComponent
            key={`DialogComponent`}
            {...{
              openWarning,
              warningMessage,
              isSaveError,
              isSystemError,
              isCurrentAssetsChangedError,
              isDustFilterError,
              hideWarning,
              onSaveClick,
              onReset,
              createNewSnapshot,
              isUserHasLockedBalance,
            }}
          />
        </Content>

        <RouteLeavingGuard
          when={rebalanceIsExecuting}
          navigate={(path) => history.push(path)}
          shouldBlockNavigation={(location) => true}
          CustomModal={RebalanceDialogLeave}
          transactionsData={transactionsDataWithPrices}
          slippageValue={slippageValue}
          onChangeSlippage={onChangeSlippage}
          hideLeavePopup={hideLeavePopup}
        />

        <Joyride
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          steps={portfolioRebalanceSteps}
          // run={getTooltipSettings.portfolioRebalance}
          run={false}
          callback={this.handleJoyrideCallback}
          key={this.state.key}
          styles={{
            options: {
              backgroundColor: theme.palette.getContrastText(
                theme.palette.primary.main
              ),
              primaryColor: theme.palette.secondary.main,
              textColor: theme.palette.primary.main,
            },
            tooltip: {
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.fontSize,
            },
          }}
        />
      </>
    )
  }
}

const SnackbarWrapper = withSnackbar(PortfolioRebalancePage)

const IntegrationNotistack = ({classes, ...otherProps}) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      action={(
        <CloseButton />
      )}
      classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
      }}
    >
      <SnackbarWrapper
        {...otherProps}
      />
    </SnackbarProvider>
  );
}

export default compose(
  withTheme(),
  queryRendererHoc({
    query: GET_TOOLTIP_SETTINGS,
    name: 'getTooltipSettingsQuery',
  }),
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
    options: {
      update: updateTooltipMutation,
    },
  }),
  withStyles(snackStyeles)
)(IntegrationNotistack)
