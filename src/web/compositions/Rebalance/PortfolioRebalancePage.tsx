import React, { Component } from 'react'
import { compose } from 'recompose'
import Joyride from 'react-joyride'

import { Container as Content } from '@sb/styles/cssUtils'
import { portfolioRebalanceSteps } from '@sb/config/joyrideSteps'
import DialogComponent from '@sb/components/RebalanceDialog/RebalanceDialog'

import PortfolioRebalanceChart from '@core/containers/PortfolioRebalanceChart/PortfolioRebalanceChart'
import {
  Container,
  ChartWrapper,
  ChartWrapperCustom,
  ChartWrapperCustomLeft,
  ChartWrapperCustomRight,
  TypographyAccordionTitle,
  TypographyProgress,
  GridProgressTitle,
  GridTransactionBtn,
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
import RebalanceInfoPanel from '../../components/RebalanceInfoPanel/RebalanceInfoPanel'
import RebalanceAccordionIndex from '../../components/RebalanceAccorionIndex/RebalanceAccordionIndex'
import RebalanceDialogTransaction from '@sb/components/RebalanceDialogTransaction/RebalanceDialogTransaction'
import Stroke from '../../../icons/Stroke.svg'
import RebalanceDialogAdd from '../../components/RebalanceDialogAdd/RebalanceDialogAdd'
import PortfolioRebalanceTableContainer from '@core/containers/PortfolioRebalanceTableContainer/PortfolioRebalanceTableContainer'

import {
  dialogTransactionData,
  accordionPortfolioPanelData,
  accordionAddPortfolioPanelData,
  accordionAddIndexPanelData,
  rebalanceInfoPanelData,
  rebalanceOption,
  sectionDataHardCode,
  addFolioData,
  addIndexData,
  currentAllocation,
  targetAllocation,
} from './mockData'

import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

import ProgressBarWrapper from '@sb/components/ProgressBarCustom/ProgressBarWrapper.tsx'

@withTheme()
class PortfolioRebalancePage extends Component<IProps, IState> {
  state = {
    key: 0,
    open: false,
    isSectionChart: false,
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

  handleClickOpen = () => {
    this.setState(
      {
        open: true,
      },
      () => {
        this.props.setTransactions()
      }
    )
  }

  handleClose = () => {
    this.setState({ open: false })
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
      executeRebalanceHandler,
      transactions,
      rebalanceTimePeriod,
      onRebalanceTimerChange,
    } = this.props

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

    return (
      <>
        {children}
        <Content
          key={`content`}
          container
          spacing={16}
          style={{ padding: '0 25px 25px 25px' }}
        >
          <Container
            key={`table-container`}
            item
            md={12}
            isEditModeEnabled={isEditModeEnabled}
          />

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
                minHeight: '130px',
                boxShadow: `0px 0px 15px 0px rgba(30, 30, 30, 0.2)`,
                borderRadius: '20px',
              }}
            >
              <GridProgressTitle content alignItems="center">
                <TypographyProgress>current allocation</TypographyProgress>
              </GridProgressTitle>

              <PortfolioRebalanceChart
                coinData={staticRows}
                isSectionChart={this.state.isSectionChart}
                sectionDataProgress={targetAllocation}
              />
            </Grid>
          </Grid>

          <GridTransactionBtn
            lg={2}
            md={2}
            style={{ height: '195px' }}
            justify="center"
          >
            <RebalanceDialogTransaction
              initialTime={rebalanceInfoPanelData.rebalanceTime}
              accordionTitle="TRANSACTIONS"
              transactionsData={transactions}
              open={this.state.open}
              handleClickOpen={this.handleClickOpen}
              handleClose={this.handleClose}
              executeRebalanceHandler={executeRebalanceHandler}
            />
          </GridTransactionBtn>

          <Grid
            item
            lg={5}
            md={5}
            style={{
              minHeight: '100px', padding: '0'
            }}
          >
            <Grid
              style={{
                minHeight: '130px',
                boxShadow: `0px 0px 15px 0px rgba(30, 30, 30, 0.2)`,
                borderRadius: '20px',
              }}
            >
              <GridProgressTitle content alignItems="center">
                <TypographyProgress>target allocation</TypographyProgress>
              </GridProgressTitle>
              <PortfolioRebalanceChart
                coinData={rows}
                isSectionChart={this.state.isSectionChart}
                sectionDataProgress={targetAllocation}
              />
            </Grid>
          </Grid>

          {/* Accordion Table Start */}
          <TypographyAccordionTitle>Portfolio</TypographyAccordionTitle>

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
                sliderStep,
              }}
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

          <TypographyAccordionTitle>
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
          {/*accordionData={accordionAddPortfolioPanelData}*/}
          {/*/>*/}

          <RebalanceDialogAdd title={'ADD PORTFOLIO'} data={addFolioData} />

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
            }}
          />
        </Content>

        <Joyride
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          steps={portfolioRebalanceSteps}
          run={getTooltipSettings.portfolioRebalance}
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
  })
)(PortfolioRebalancePage)
