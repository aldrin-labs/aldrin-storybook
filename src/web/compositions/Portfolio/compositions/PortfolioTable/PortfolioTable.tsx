import React, { Component, lazy, Suspense, memo } from 'react'
import { withTheme } from '@material-ui/styles'

import { IState, IProps } from './PortfolioTable.types'

import PortfolioMain from '@core/compositions/PortfolioMain'

const PortfolioTableIndustries = React.lazy(() =>
  import(/* webpackPrefetch: true */ '@core/compositions/PortfolioIndustry')
)
import Rebalance from '@core/compositions/PortfolioRebalance'
const Optimization = React.lazy(() =>
  import(/* webpackPrefetch: true */ '@sb/compositions/Optimization/Optimization')
)
const Correlation = React.lazy(() =>
  import(/* webpackPrefetch: true */ '@sb/compositions/Correlation/Correlation')
)

import PortfolioTableTabs from '@sb/components/PortfolioTableTabs/PortfolioTableTabs'

import { Loading } from '@sb/components/index'
import { Mutation } from 'react-apollo'
import { TOGGLE_BASE_COIN } from '@core/graphql/mutations/portfolio/toggleBaseCoin'

const MemoizedTab = memo(
  (props: any) => <>{props.children}</>,
  (prevProps: any, nextProps: any) => nextProps.tab === prevProps.tab
)
class PortfolioTable extends Component<IProps, IState> {
  state: IState = {
    isShownChart: true,
    tab: 'main',
  }

  onChangeTab = (
    kind: 'main' | 'industry' | 'rebalance' | 'correlation' | 'optimization'
  ) => {
    this.setState({ tab: kind })
  }

  render() {
    const { isShownChart, tab } = this.state
    const {
      theme,
      dustFilter,
      showTable = false,
      isUSDCurrently,
      baseCoin,
    } = this.props

    return (
      <Mutation mutation={TOGGLE_BASE_COIN}>
        {(toggleBaseCoin) => (
          <>
            <PortfolioTableTabs
              theme={theme}
              toggleWallets={this.props.toggleWallets}
              tab={tab}
              isUSDCurrently={isUSDCurrently}
              onChangeTab={this.onChangeTab}
              onToggleUSDBTC={() => {
                this.props.onToggleUSDBTC()
                toggleBaseCoin()
              }}
            />
            <Suspense fallback={<Loading centerAligned />}>
              {showTable && (
                <>
                  <div id="main_tab" hidden={tab !== 'main'}>
                    <MemoizedTab tab={tab}>
                      <PortfolioMain
                        isShownChart={isShownChart}
                        isUSDCurrently={isUSDCurrently}
                        tab={this.state.tab}
                        theme={theme}
                        variables={{ baseCoin }}
                        baseCoin={baseCoin}
                        dustFilter={-100}
                      />
                    </MemoizedTab>
                  </div>
                  <div id="industry_tab" hidden={tab !== 'industry'}>
                    <MemoizedTab tab={tab}>
                      <PortfolioTableIndustries
                        isUSDCurrently={isUSDCurrently}
                        theme={theme}
                        tab={this.state.tab}
                        variables={{ baseCoin: 'USDT' }}
                        baseCoin="USDT"
                        filterValueSmallerThenPercentage={-100}
                        dustFilter={-100}
                      />
                    </MemoizedTab>
                  </div>
                  {tab === 'rebalance' && (
                    <div id="rebalance_tab">
                      <MemoizedTab tab={tab}>
                        <Rebalance
                          baseCoin={`USDT`}
                          tab={this.state.tab}
                          isUSDCurrently={true}
                          dustFilter={dustFilter}
                        />
                      </MemoizedTab>
                    </div>
                  )}
                  <div id="correlation_tab" hidden={tab !== 'correlation'}>
                    <MemoizedTab tab={tab}>
                      <Correlation
                        baseCoin="USDT"
                        tab={this.state.tab}
                        theme={theme}
                        filterValueSmallerThenPercentage={-100}
                      />
                    </MemoizedTab>
                  </div>

                  <div id="optimization_tab" hidden={tab !== 'optimization'}>
                    <MemoizedTab tab={tab}>
                      <Optimization
                        theme={theme}
                        tab={this.state.tab}
                        isUSDCurrently={isUSDCurrently}
                        baseCoin="USDT"
                        dustFilter={dustFilter}
                        filterValueSmallerThenPercentage={-100}
                      />
                    </MemoizedTab>
                  </div>
                </>
              )}
            </Suspense>
          </>
        )}
      </Mutation>
    )
  }
}

export default withTheme()(PortfolioTable)
