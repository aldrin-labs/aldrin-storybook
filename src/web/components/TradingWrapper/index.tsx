import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import {Button} from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'

import Grid from '@material-ui/core/Grid'

import TraidingTerminal from '../TraidingTerminal'
import { value } from 'popmotion';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
})

const BySellWrapper = (props: {priceType: string}) => (
  <Grid container spacing={8}>
    <Grid item xs={6}>
      <TraidingTerminal
        byType="buy"
        priceType={props.priceType}
        pair={['BTC', 'USDT']}
        walletValue={1}
        marketPrice={4040.40}
        confirmOperation={(values) => console.log(values)}
      />
    </Grid>
    <Grid item xs={6}>
      <TraidingTerminal
        byType="sell"
        priceType={props.priceType}
        pair={['USDT', 'BTC']}
        walletValue={500}
        marketPrice={4040.40}
        confirmOperation={(values) => console.log(values)}
      />
    </Grid>
  </Grid>
)

class SimpleTabs extends React.Component {
  state = {
    value: 0,
  };


  render() {
    const { value } = this.state

    return (
      <div>
        <div>
          <Button
            onClick={() => this.setState({ value: 0 })}
            variant={value === 0 ? 'contained' : 'flat'}
            color={value === 0 ? 'secondary' : 'default'}
          >
            Limit
          </Button>
          <Button
            onClick={() => this.setState({ value: 1 })}
            variant={value === 1 ? 'contained' : 'flat'}
            color={value === 1 ? 'secondary' : 'default'}
          >
            Market
          </Button>
          <Button
            onClick={() => this.setState({ value: 2 })}
            variant={value === 2 ? 'contained' : 'flat'}
            color={value === 2 ? 'secondary' : 'default'}
          >
            Stop-limit
          </Button>
        </div>
        {value === 0 && <BySellWrapper priceType="limit"/>}
        {value === 1 && <BySellWrapper priceType="market"/>}
        {value === 2 && <BySellWrapper priceType="stop-limit"/>}
      </div>
    )
  }
}

export default withStyles(styles)(SimpleTabs)
