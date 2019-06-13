import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import Joyride from 'react-joyride'
import * as actions from '@core/redux/user/actions'

import { Container as Content } from '@sb/styles/cssUtils'
import { portfolioRebalanceSteps } from '@sb/config/joyrideSteps'
import DialogComponent from '@sb/components/RebalanceDialog/RebalanceDialog'

import PortfolioRebalanceTableContainer from '@core/containers/PortfolioRebalanceTableContainer/PortfolioRebalanceTableContainer'
import PortfolioRebalanceChart from '@core/containers/PortfolioRebalanceChart/PortfolioRebalanceChart'
import { Container, ChartWrapper, ButtonWrapper } from './PortfolioRebalancePage.styles'
import { withTheme } from '@material-ui/styles'

class PortfolioRebalancePage extends Component {
  state = {
    key: 0,
  }

  handleJoyrideCallback = (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      this.props.hideToolTip('Rebalance')
    }
    if (data.status === 'finished') {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  render() {
    const {
      selectedActive,
      areAllActiveChecked,
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
    } = this.props

    const secondary = palette.secondary.main
    const red = customPalette.red.main
    const green = customPalette.green.main
    const fontFamily = theme.typography.fontFamily
    const saveButtonColor = isPercentSumGood ? green : red

    const tableDataHasData = !staticRows.length || !rows.length

    return (
      <>



          {children}
          <Content key={`content`} container spacing={16}>

{/* TODO */}
            <ChartWrapper
              key={`chart-container`}
              item
              md={10}
              className="PortfolioDistributionChart"
            >
              <PortfolioRebalanceChart
                dustFilter={dustFilter}
                key={`PortfolioRebalanceChart`}
                title={`Current Allocation`}
                background={theme.palette.background.default}
                staticRows={staticRows}
                rows={rows}
                bottomMargin={75}
                theme={theme}
                hideDashForToolTip={true}
                xAxisVertical={true}
                alwaysShowLegend={true}
                leftBar={leftBar}
                rightBar={rightBar}
              />
            </ChartWrapper>
{/* 
            <ButtonWrapper
              key={`button-container`}
              item
              md={2}
              className="PortfolioDistributionChart"
            >
              <button>{`<=>`}</button>
            </ButtonWrapper>

            <ChartWrapper
              key={`chart-container`}
              item
              md={5}
              className="PortfolioDistributionChart"
            >
              <PortfolioRebalanceChart
                dustFilter={dustFilter}
                key={`PortfolioRebalanceChart`}
                title={`Target Allocation`}
                background={theme.palette.background.default}
                staticRows={staticRows}
                rows={rows}
                bottomMargin={75}
                theme={theme}
                hideDashForToolTip={true}
                xAxisVertical={true}
                alwaysShowLegend={true}
                leftBar={leftBar}
                rightBar={rightBar}
              />
            </ChartWrapper> */}


            {/* TODO */}




            <Container
              key={`table-container`}
              item
              md={12}
              isEditModeEnabled={isEditModeEnabled}
            >
              <PortfolioRebalanceTableContainer
                key={`PortfolioRebalanceTableContainer`}
                {...{
                  isEditModeEnabled,
                  staticRows,
                  staticRowsMap,
                  totalStaticRows,
                  rows,
                  selectedActive,
                  areAllActiveChecked,
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
              />
            </Container>


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
          run={this.props.toolTip.portfolioRebalance}
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

const mapDispatchToProps = (dispatch: any) => ({
  hideToolTip: (tab: string) => dispatch(actions.hideToolTip(tab)),
})

const mapStateToProps = (store: any) => ({
  toolTip: store.user.toolTip,
})

export default compose(
  withTheme(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PortfolioRebalancePage)
