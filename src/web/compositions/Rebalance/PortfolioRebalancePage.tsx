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


import  { Link } from '@material-ui/core'
import SvgIcon from '../../components/SvgIcon'
import { BtnCustom } from '../../components/BtnCustom/BtnCustom.styles'

import { IState, IProps } from './PortfolioRebalancePage.types'


// Rebalance Panel
import RebalanceInfoPanel from '../../components/RebalanceInfoPanel/RebalanceInfoPanel'
import RebalanceAccordionIndex from '../../components/RebalanceAccorionIndex/RebalanceAccordionIndex'
import RebalanceDialogTransaction from '@sb/components/RebalanceDialogTransaction/RebalanceDialogTransaction'
// Rebalance Panel End

import Stroke from '../../../icons/Stroke.svg'


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
        <Content key={`content`} container spacing={16} style={{padding: '25px'}}>
          <Container
            key={`table-container`}
            item
            md={12}
            isEditModeEnabled={isEditModeEnabled}
          >

            {/* <PortfolioRebalanceTableContainer
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
              }}
            /> */}
          </Container>

          {/* REBALANCE INFO PANEL STARTS */ }
          <RebalanceInfoPanel />
          {/* REBALANCE INFO PANEL ENDS */ }
         
          <ChartWrapper
            key={`chart-container`}
            item
            md={5}
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
              sectionData = {[{symbol: 'Portfolio', portfolioPerc: 50},{symbol: 'Index', portfolioPerc: 50},{symbol: 'Source', portfolioPerc: 50}]}
              showSectionData={true}
              //coinData={staticRows}
            />
          </ChartWrapper> 

          <ChartWrapper
            key={`chart-container`}
            item
            md={12}
            lg={2}
            className="PortfolioDistributionChart"
            style={{background: `url(${Stroke})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}
          >



          <RebalanceDialogTransaction />




{/* 
                <Link  style={{color: 'white'}} onClick={this.handleClickOpen}>
                  <svg width="96" height="210" viewBox="0 0 96 210" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M49 0L49 210" stroke="#E7ECF3" stroke-width="2"/>
                  <circle cx="48" cy="109" r="48" fill="#F9FBFD"/>
                  <circle cx="48" cy="109" r="37" fill="white"/>
                  <path d="M96 109C96 135.51 74.5097 157 48 157C21.4903 157 0 135.51 0 109C0 82.4903 21.4903 61 48 61C74.5097 61 96 82.4903 96 109ZM12 109C12 128.882 28.1177 145 48 145C67.8822 145 84 128.882 84 109C84 89.1177 67.8822 73 48 73C28.1177 73 12 89.1177 12 109Z" fill="url(#paint0_angular)"/>
                  <path d="M30.9393 99.9393C30.3536 100.525 30.3536 101.475 30.9393 102.061L40.4853 111.607C41.0711 112.192 42.0208 112.192 42.6066 111.607C43.1924 111.021 43.1924 110.071 42.6066 109.485L34.1213 101L42.6066 92.5147C43.1924 91.9289 43.1924 90.9792 42.6066 90.3934C42.0208 89.8076 41.0711 89.8076 40.4853 90.3934L30.9393 99.9393ZM64 99.5L32 99.5L32 102.5L64 102.5L64 99.5Z" fill="#7284A0"/>
                  <path d="M65.0607 118.061C65.6464 117.475 65.6464 116.525 65.0607 115.939L55.5147 106.393C54.9289 105.808 53.9792 105.808 53.3934 106.393C52.8076 106.979 52.8076 107.929 53.3934 108.515L61.8787 117L53.3934 125.485C52.8076 126.071 52.8076 127.021 53.3934 127.607C53.9792 128.192 54.9289 128.192 55.5147 127.607L65.0607 118.061ZM32 118.5L64 118.5L64 115.5L32 115.5L32 118.5Z" fill="#7284A0"/>
                  <defs>
                  <radialGradient id="paint0_angular" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48 109) rotate(-135) scale(29.6985)">
                  <stop offset="0.126166" stop-color="#DEDB8E"/>
                  <stop offset="0.37577" stop-color="#4B62C1"/>
                  <stop offset="0.624738" stop-color="#5ADF57"/>
                  <stop offset="0.875989" stop-color="#EE7868"/>
                  </radialGradient>
                  </defs>
                  </svg>
                </Link> */}

          </ChartWrapper>

          <ChartWrapper
            key={`chart-container`}
            item
            md={5}
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
              sectionData = {[{symbol: 'Portfolio', portfolioPerc: 50},{symbol: 'Index', portfolioPerc: 50},{symbol: 'Source', portfolioPerc: 50}]}
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
            />


          <TypographyAccordionTitle>indexes</TypographyAccordionTitle>
          
          <BtnCustom btnColor="#5085EC">add index</BtnCustom>

          <TypographyAccordionTitle>following portfolios</TypographyAccordionTitle>


          <BtnCustom btnColor="#5085EC">Add portfolio</BtnCustom>



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
