import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import { Button, Toolbar,Paper, Tabs } from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'

import Grid from '@material-ui/core/Grid'

import TraidingTerminal from '../TraidingTerminal'

import {
  TablesBlockWrapper,
  TerminalContainer,
  ScrollWrapper,
} from './styles'


const styles = theme => ({
  appBar: {
    background: theme.palette.primary.dark,
    boxShadow: 'none',
  },
  toolBar: {
    flex: 1,
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 60,
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

const BySellWrapper = withStyles(wrapperStyles)((props: {priceType: string, classes: any}) => (
  <ScrollWrapper>
  <Grid container spacing={0} alignItems="center" justify="center">
    <Grid item xs={6} className={props.classes.gridWithBorder}>
    <TerminalContainer>
      <TraidingTerminal
        byType="buy"
        priceType={props.priceType}
        pair={['BTC', 'USDT']}
        walletValue={1678}
        marketPrice={4040.40}
        confirmOperation={(values) => console.log(values)}
      />
      </TerminalContainer>
    </Grid>
    <Grid item xs={6}>
    <TerminalContainer>
      <TraidingTerminal
        byType="sell"
        priceType={props.priceType}
        pair={['BTC', 'USDT']}
        walletValue={500}
        marketPrice={4040.40}
        confirmOperation={(values) => console.log(values)}
      />
      </TerminalContainer>
    </Grid>
  </Grid>
  </ScrollWrapper>
))

class SimpleTabs extends React.Component {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }


  render() {
    const { value } = this.state
    const { classes } = this.props

    return (
      <TablesBlockWrapper>
        <AppBar position="static" className={classes.appBar}>
        <Tabs
          centered
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
        {value === 0 && <BySellWrapper priceType="limit"/>}
        {value === 1 && <BySellWrapper priceType="market"/>}
        {value === 2 && <BySellWrapper priceType="stop-limit"/>}
      </TablesBlockWrapper>
    )
  }
}

export default withStyles(styles)(SimpleTabs)
