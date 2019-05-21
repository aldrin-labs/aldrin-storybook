import React from 'react'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withStyles } from '@material-ui/core/styles'

import {
  Button,
  Toolbar,
  Paper,
  Tabs,
  AppBar,
  Grid,
  Typography,
  Tab,
} from '@material-ui/core'

import { compose } from 'recompose'

import TraidingTerminal from '../TraidingTerminal'

import {
  TablesBlockWrapper,
  TerminalContainer,
  ScrollWrapper,
} from './styles'

import { IProps } from './types'
import {CSS_CONFIG} from '@sb/config/cssConfig'

const styles = theme => ({
  appBar: {
    background: theme.palette.primary.dark,
    boxShadow: 'none',
  },
  toolBar: {
    flex: 1,
  },
  tabGroupRoot: {
    minHeight: 30,
  },
  tabRoot: {
    fontSize: CSS_CONFIG.chart.title.fontSize,
    minWidth: 60,
    minHeight: 30,
    '&$tabSelected': {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
  tabSelected: {},
})

const wrapperStyles = theme => ({
  gridWithBorder: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
})

const BySellWrapper = withStyles(wrapperStyles)((props: IProps) => {
  const {
    pair,
    funds,
    price,
    classes,
    priceType,
    placeOrder,
    cancelOrder,
    decimals,
    showOrderResult,
  } = props

  return (
  <ScrollWrapper>
  <Grid container spacing={0} alignItems="center" justify="center">
    <Grid item xs={6} className={classes.gridWithBorder}>
      <TerminalContainer>
        <TraidingTerminal
          byType="buy"
          priceType={priceType}
          pair={pair}
          key={[pair, funds, priceType]}
          walletValue={funds && funds[1]}
          marketPrice={price}
          confirmOperation={placeOrder}
          cancelOrder={cancelOrder}
          decimals={decimals}
          showOrderResult={showOrderResult}
        />
      </TerminalContainer>
    </Grid>
    <Grid item xs={6}>
      <TerminalContainer>
        <TraidingTerminal
          byType="sell"
          priceType={priceType}
          pair={pair}
          key={[pair, funds, priceType]}
          walletValue={funds && funds[0]}
          marketPrice={price}
          confirmOperation={placeOrder}
          cancelOrder={cancelOrder}
          decimals={decimals}
          showOrderResult={showOrderResult}
        />
      </TerminalContainer>
    </Grid>
  </Grid>
  </ScrollWrapper>
)})

class SimpleTabs extends React.Component {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }


  render() {
    const { value } = this.state
    const {
      classes,
      pair,
      funds,
      price,
      placeOrder,
      decimals,
      showOrderResult,
      cancelOrder,
    } = this.props

    return(
      <TablesBlockWrapper>
        <AppBar position="static" className={classes.appBar}>
        <Tabs
          classes={{ root: classes.tabGroupRoot }}
          value={value}
          onChange={this.handleChange}
        >
          <Tab
            disableRipple
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            label="Limit"
          />
          <Tab
            disableRipple
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            label="Market"
          />
          <Tab
            disableRipple
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            label="Stop-limit"
          />
        </Tabs>
        </AppBar>
        <BySellWrapper
          priceType={value === 0 ? 'limit' : value === 1 ? 'market' : 'stop-limit'}
          pair={pair}
          funds={funds}
          price={price}
          placeOrder={placeOrder}
          cancelOrder={cancelOrder}
          decimals={decimals}
          showOrderResult={showOrderResult}
        />
      </TablesBlockWrapper>
    )
  }
}

export default compose(
  withErrorFallback,
  withStyles(styles)
  )(SimpleTabs)
