import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import Joyride from 'react-joyride'
import * as actions from '@core/redux/user/actions'

import { Container as Content } from '@storybook/styles/cssUtils'
import { portfolioRebalanceSteps } from '@storybook/config/joyrideSteps'
import DialogComponent from '@storybook/components/RebalanceDialog/RebalanceDialog'
import EmptyTablePlaceholder from '@storybook/components/EmptyTablePlaceholder'

import PortfolioRebalanceTableContainer from '@core/containers/PortfolioRebalanceTableContainer/PortfolioRebalanceTableContainer'
import PortfolioRebalanceChart from '@core/containers/PortfolioRebalanceChart/PortfolioRebalanceChart'
import { Container, ChartWrapper } from './PortfolioRebalancePage.styles'
import { withTheme } from "@material-ui/styles"

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
      children,
      isUSDCurrently,
      theme,
      theme: { palette, customPalette },
      tab,
      timestampSnapshot,
      onDiscardChanges,
      onSaveClick,
      onReset,
      onEditModeEnable,
      updateState,
      onNewSnapshot,
      hideWarning,
      createNewSnapshot,
    } = this.props

    const secondary = palette.secondary.main
    const red = customPalette.red.main
    const green = customPalette.green.main
    const fontFamily = theme.typography.fontFamily
    const saveButtonColor = isPercentSumGood ? green : red

    const tableDataHasData = !staticRows.length || !rows.length

    return (
      <>
        <Joyride
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          steps={portfolioRebalanceSteps}
          run={this.props.toolTip.portfolioRebalance && tab === 'rebalance'}
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

        <EmptyTablePlaceholder isEmpty={tableDataHasData}>
          {children}
          <Content key={`content`} container spacing={16}>
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
                }}
              />
            </Container>

            <ChartWrapper
              key={`chart-container`}
              item
              md={12}
              className="PortfolioDistributionChart"
            >
              <PortfolioRebalanceChart
                key={`PortfolioRebalanceChart`}
                title={`Portfolio Distribution`}
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

            {/* end of a grid */}

            <DialogComponent
              key={`DialogComponent`}
              {...{
                openWarning,
                warningMessage,
                isSaveError,
                isSystemError,
                isCurrentAssetsChangedError,
                hideWarning,
                onSaveClick,
                onReset,
                createNewSnapshot,
              }}
            />
          </Content>
        </EmptyTablePlaceholder>
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
