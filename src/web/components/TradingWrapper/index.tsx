import React from 'react'
import { withErrorFallback } from '@core/hoc/withErrorFallback'

import { Grid } from '@material-ui/core'

import { compose } from 'recompose'

import TraidingTerminal from '../TraidingTerminal'
import ChartCardHeader from '@sb/components/ChartCardHeader'

import {
  TablesBlockWrapper,
  TerminalContainer,
  ScrollWrapper,
  TabsContainer,
  TabsTypeContainer,
  StyledTab,
  BuyTab,
  SellTab,
} from './styles'

import { IProps } from './types'

class SimpleTabs extends React.Component {
  state = {
    operation: 'buy',
    mode: 'market',
    percentage: '100',
  }

  handleChangeMode = (mode: string) => {
    this.setState({ mode })
  }

  handleChangeOperation = (operation: string) => {
    this.setState({ operation })
  }

  handleChangePercentage = (percentage: string) => {
    this.setState({ percentage })
  }

  render() {
    const { operation, mode, percentage } = this.state
    const {
      pair,
      funds,
      price,
      placeOrder,
      decimals,
      showOrderResult,
      cancelOrder,
    } = this.props

    return (
      <TablesBlockWrapper>
        <ChartCardHeader>{`${pair[0]}/${pair[1]} Trading`}</ChartCardHeader>
        <TabsTypeContainer>
          <BuyTab
            active={operation === 'buy'}
            onClick={() => this.handleChangeOperation('buy')}
          >
            Buy {pair[0]}
          </BuyTab>
          <SellTab
            active={operation === 'sell'}
            onClick={() => this.handleChangeOperation('sell')}
          >
            Sell {pair[0]}
          </SellTab>
        </TabsTypeContainer>
        <TabsContainer>
          <StyledTab
            active={mode === 'market'}
            onClick={() => this.handleChangeMode('market')}
          >
            Market
          </StyledTab>
          <StyledTab
            active={mode === 'limit'}
            onClick={() => this.handleChangeMode('limit')}
          >
            Limit
          </StyledTab>
          <StyledTab
            active={mode === 'stop-limit'}
            onClick={() => this.handleChangeMode('stop-limit')}
          >
            Stop-limit
          </StyledTab>
        </TabsContainer>

        <Grid xs={12} item>
          <TerminalContainer>
            <TraidingTerminal
              byType="buy"
              operationType={operation}
              priceType={mode}
              percentage={percentage}
              changePercentage={this.handleChangePercentage}
              pair={pair}
              funds={funds}
              key={[pair, funds, mode]}
              walletValue={funds && funds[1]}
              marketPrice={price}
              confirmOperation={placeOrder}
              cancelOrder={cancelOrder}
              decimals={decimals}
              showOrderResult={showOrderResult}
            />
          </TerminalContainer>
        </Grid>
      </TablesBlockWrapper>
    )
  }
}

export default compose(withErrorFallback)(SimpleTabs)
