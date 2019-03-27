import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import { Button, Toolbar,Paper } from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'

import Grid from '@material-ui/core/Grid'

import TraidingTerminal from '../TraidingTerminal'

import { TablesBlockWrapper, TerminalContainer } from './styles'


const styles = theme => ({
  appBar: {
    background: theme.palette.primary.dark,
    position: 'relative',
    boxShadow: 'none',
  },
  toolBar: {
    flex: 1,
    minHeight: 40,
  },
  button: {
    padding: 0,
    margin: 3,
    marginRight: 6,
  },
})

const wrapperStyles = theme => ({
  gridWithBorder: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
})

const BySellWrapper = withStyles(wrapperStyles)((props: {priceType: string, classes: any}) => (
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
))

class SimpleTabs extends React.Component {
  state = {
    value: 0,
  };


  render() {
    const { value } = this.state
    const { classes } = this.props

    return (
      <TablesBlockWrapper>
        <AppBar position="static" className={classes.appBar}>
        <Toolbar variant="dense" className={classes.toolBar}>
          <Button
            className={classes.button}
            size="small"
            onClick={() => this.setState({ value: 0 })}
            variant={value === 0 ? 'contained' : 'flat'}
            color={value === 0 ? 'secondary' : 'default'}
          >
            Limit
          </Button>
          <Button
            className={classes.button}
            size="small"
            onClick={() => this.setState({ value: 1 })}
            variant={value === 1 ? 'contained' : 'flat'}
            color={value === 1 ? 'secondary' : 'default'}
          >
            Market
          </Button>
          <Button
            className={classes.button}
            size="small"
            onClick={() => this.setState({ value: 2 })}
            variant={value === 2 ? 'contained' : 'flat'}
            color={value === 2 ? 'secondary' : 'default'}
          >
            Stop-limit
          </Button>
          </Toolbar>
        </AppBar>
        {value === 0 && <BySellWrapper priceType="limit"/>}
        {value === 1 && <BySellWrapper priceType="market"/>}
        {value === 2 && <BySellWrapper priceType="stop-limit"/>}
      </TablesBlockWrapper>
    )
  }
}

export default withStyles(styles)(SimpleTabs)
