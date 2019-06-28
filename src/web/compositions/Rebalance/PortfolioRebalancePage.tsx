import React, { Component } from 'react'
import { compose } from 'recompose'
import Joyride from 'react-joyride'

import { Container as Content } from '@sb/styles/cssUtils'
import { portfolioRebalanceSteps } from '@sb/config/joyrideSteps'
import DialogComponent from '@sb/components/RebalanceDialog/RebalanceDialog'

import PortfolioRebalanceTableContainer from '@core/containers/PortfolioRebalanceTableContainer/PortfolioRebalanceTableContainer'
import PortfolioRebalanceChart from '@core/containers/PortfolioRebalanceChart/PortfolioRebalanceChart'
import { Container, ChartWrapper, TypographyAccordionTitle } from './PortfolioRebalancePage.styles'
import { withTheme } from '@material-ui/styles'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { graphql } from 'react-apollo'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'

import { BtnCustom } from '../../components/BtnCustom/BtnCustom.styles'

import { IState, IProps } from './PortfolioRebalancePage.types'


// Rebalance Panel
import RebalanceInfoPanel from '../../components/RebalanceInfoPanel/RebalanceInfoPanel'
import RebalanceAccordionIndex from '../../components/RebalanceAccorionIndex/RebalanceAccordionIndex'
import RebalanceDialogTransaction from '@sb/components/RebalanceDialogTransaction/RebalanceDialogTransaction'
import Stroke from '../../../icons/Stroke.svg'
import RebalanceDialogAdd from '../../components/RebalanceDialogAdd/RebalanceDialogAdd'
import { dialogTransactionData, accordionPortfolioPanelData, accordionAddPortfolioPanelData, accordionAddIndexPanelData, rebalanceInfoPanelData, rebalanceOption, sectionDataHardCode, addFolioData, addIndexData } from './mockData'


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
        theme: {palette: {blue, red, green}},
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
    this.setState({
      open: true,
    })
  }

  handleClose = () => {
    this.setState({ open: false });
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
    } = this.props

    const secondary = palette.secondary.main
    const red = customPalette.red.main
    const green = customPalette.green.main
    const fontFamily = theme.typography.fontFamily
    const saveButtonColor = isPercentSumGood ? green : red

    return (
      <>

        {children}
        <Content key={`content`} container spacing={16} style={{padding: '25px'}} >
          <Container
            key={`table-container`}
            item
            md={12}
            isEditModeEnabled={isEditModeEnabled}
          >
          </Container>

          {/* REBALANCE INFO PANEL STARTS */ }
          <RebalanceInfoPanel rebalanceInfoPanelData={rebalanceInfoPanelData} rebalanceOption={rebalanceOption} />
          {/* REBALANCE INFO PANEL ENDS */ }
         
          <ChartWrapper
            key={`chart-container`}
            item
            md={5}
            sm={5}
            className="PortfolioDistributionChart"
          >
            <PortfolioRebalanceChart
              dustFilter={dustFilter}
              key={`PortfolioRebalanceChart`}
              title={`Portfolio Distribution`}
              background={theme.palette.background.default}
              staticRows={staticRows}
              rows={rows}
              bottomMargin={5}
              theme={theme}
              hideDashForToolTip={true}
              xAxisVertical={true}
              alwaysShowLegend={true}
              leftBar={leftBar}
              rightBar={rightBar}
              height={160}
              customBarSeriesStyles={   
                {   
                  rx: 10,
                  ry: 10,
                  height: 25,
                }
              }
              yType={"ordinal"}
              xDomain={[0, 100]}
              color={"#fff"}
              chartcolor={'#fff'}
              chartTitle={'title'}
              sectionData = {sectionDataHardCode}
              showSectionData={true}
              //coinData={staticRows}
            />
          </ChartWrapper> 

          <ChartWrapper
            key={`chart-container`}
            item
            sm={2}
            md={2}
            lg={2}
            className="PortfolioDistributionChart"
            style={{background: `url(${Stroke})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}
          >
            <RebalanceDialogTransaction 
              dialogHedaing='ARE YOU SURE?'
              titleDescription='Your portfolio will change.'
              btnFirst='Cancel'
              btnSecond='Go!'
              accordionTitle='TRANSACTIONS'
              data={dialogTransactionData}
              open={this.state.open}
              handleClickOpen={this.handleClickOpen}
              handleClose={this.handleClose}/>

          </ChartWrapper>

          <ChartWrapper
            key={`chart-container`}
            item
            md={5}
            sm={5}
            className="PortfolioDistributionChart"
          >
            <PortfolioRebalanceChart
              dustFilter={dustFilter}
              key={`TargetRebalanceChart`}
              title={`Target Distribution`}
              background={theme.palette.background.default}
              staticRows={staticRows}
              rows={rows}
              bottomMargin={5}
              theme={theme}
              hideDashForToolTip={true}
              xAxisVertical={true}
              alwaysShowLegend={true}
              leftBar={leftBar}
              rightBar={rightBar}
              height={160}
              customBarSeriesStyles={   
                {   
                  rx: 10,
                  ry: 10,
                  height: 25,
                }
              }
              yType={"ordinal"}
              xDomain={[0, 100]}
              color={"#fff"}
              chartcolor={'#fff'}
              chartTitle={'title'}
              sectionData = {sectionDataHardCode}
              showSectionData={true}
            />
          </ChartWrapper> 



          {/* Accordion Table Start */}
          <TypographyAccordionTitle>Portfolio</TypographyAccordionTitle>

          <RebalanceAccordionIndex 
                isEditModeEnabled={isEditModeEnabled}
                staticRows={staticRows}
                staticRowsMap={staticRowsMap}
                totalStaticRows={totalStaticRows}
                rows={rows}
                totalRows={totalRows}
                totalPercents={totalPercents}
                totalTableRows={totalTableRows}
                isPercentSumGood={isPercentSumGood}
                undistributedMoney={undistributedMoney}
                isUSDCurrently={isUSDCurrently}
                addMoneyInputValue={addMoneyInputValue}
                theme={theme}
                loading={loading}
                red={red}
                saveButtonColor={saveButtonColor}
                secondary={secondary}
                fontFamily={fontFamily}
                totalSnapshotRows={totalSnapshotRows}
                timestampSnapshot={timestampSnapshot}
                onDiscardChanges={onDiscardChanges}
                onSaveClick={onSaveClick}
                onReset={onReset}
                onEditModeEnable={onEditModeEnable}
                updateState={updateState}
                onNewSnapshot={onNewSnapshot}
                dustFilter={dustFilter}
                showWarning={showWarning}

                accordionData={accordionPortfolioPanelData}
            />


          <TypographyAccordionTitle>indexes</TypographyAccordionTitle>

                    <RebalanceAccordionIndex 
                isEditModeEnabled={isEditModeEnabled}
                staticRows={staticRows}
                staticRowsMap={staticRowsMap}
                totalStaticRows={totalStaticRows}
                rows={rows}
                totalRows={totalRows}
                totalPercents={totalPercents}
                totalTableRows={totalTableRows}
                isPercentSumGood={isPercentSumGood}
                undistributedMoney={undistributedMoney}
                isUSDCurrently={isUSDCurrently}
                addMoneyInputValue={addMoneyInputValue}
                theme={theme}
                loading={loading}
                red={red}
                saveButtonColor={saveButtonColor}
                secondary={secondary}
                fontFamily={fontFamily}
                totalSnapshotRows={totalSnapshotRows}
                timestampSnapshot={timestampSnapshot}
                onDiscardChanges={onDiscardChanges}
                onSaveClick={onSaveClick}
                onReset={onReset}
                onEditModeEnable={onEditModeEnable}
                updateState={updateState}
                onNewSnapshot={onNewSnapshot}
                dustFilter={dustFilter}
                showWarning={showWarning}

                accordionData={accordionAddIndexPanelData}
            />
          
          <RebalanceDialogAdd title={'ADD INDEX'} data={addIndexData}/>

          <TypographyAccordionTitle>add portfolio</TypographyAccordionTitle>


          <RebalanceAccordionIndex 
                isEditModeEnabled={isEditModeEnabled}
                staticRows={staticRows}
                staticRowsMap={staticRowsMap}
                totalStaticRows={totalStaticRows}
                rows={rows}
                totalRows={totalRows}
                totalPercents={totalPercents}
                totalTableRows={totalTableRows}
                isPercentSumGood={isPercentSumGood}
                undistributedMoney={undistributedMoney}
                isUSDCurrently={isUSDCurrently}
                addMoneyInputValue={addMoneyInputValue}
                theme={theme}
                loading={loading}
                red={red}
                saveButtonColor={saveButtonColor}
                secondary={secondary}
                fontFamily={fontFamily}
                totalSnapshotRows={totalSnapshotRows}
                timestampSnapshot={timestampSnapshot}
                onDiscardChanges={onDiscardChanges}
                onSaveClick={onSaveClick}
                onReset={onReset}
                onEditModeEnable={onEditModeEnable}
                updateState={updateState}
                onNewSnapshot={onNewSnapshot}
                dustFilter={dustFilter}
                showWarning={showWarning}

                accordionData={accordionAddPortfolioPanelData}
            />

          <RebalanceDialogAdd title={'ADD PORTFOLIO'} data={addFolioData}/>


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
