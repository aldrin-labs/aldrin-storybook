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
  TypographyAccordionTitle,
  TypographyProgress,
  GridProgressTitle,
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
      addMoneyInputValue,
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
      rebalanceTime: 432000000,
    }

    const sectionPanelData = {
      accordionPanelHeadingBorderColor: '#F29C38',
      accordionPanelHeading: 'My portfolio',
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
          style={{ padding: '15px 35px' }}
        >
          <Container
            key={`table-container`}
            item
            md={12}
            isEditModeEnabled={isEditModeEnabled}
          />

          {/* REBALANCE INFO PANEL STARTS */}
          <RebalanceInfoPanel
            rebalanceInfoPanelData={rebalanceInfoPanelData}
            rebalanceOption={rebalanceOption}
          />
          {/* REBALANCE INFO PANEL ENDS */}

          <ChartWrapperCustom
            key={`chart-container-current-allocation`}
            item
            md={5}
            sm={5}
            className="PortfolioDistributionChart"
            style={{
              padding: '0px',
              display: 'flex',
              justifyContent: 'start',
            }}
          >
            <GridProgressTitle content alignItems="center">
              <TypographyProgress>current allocation</TypographyProgress>
            </GridProgressTitle>

            <ProgressBarWrapper data={currentAllocation} />
          </ChartWrapperCustom>

          <ChartWrapper
            key={`chart-container-dialog`}
            item
            sm={2}
            md={2}
            lg={2}
            className="PortfolioDistributionChart"
            style={{
              height: '130px',
              background: `url(${Stroke})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
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
          </ChartWrapper>

          <ChartWrapperCustom
            key={`chart-container-distribtion`}
            item
            md={5}
            sm={5}
            className="PortfolioDistributionChart"
            style={{
              padding: '0px',
              display: 'flex',
              justifyContent: 'start',
            }}
          >
            <GridProgressTitle content alignItems="center">
              <TypographyProgress>target allocation</TypographyProgress>
            </GridProgressTitle>

            <ProgressBarWrapper data={targetAllocation} />
          </ChartWrapperCustom>

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
                addMoneyInputValue,
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
          {/*addMoneyInputValue={addMoneyInputValue}*/}
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
          {/*addMoneyInputValue={addMoneyInputValue}*/}
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
