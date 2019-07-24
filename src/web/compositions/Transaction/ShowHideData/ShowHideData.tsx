import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Checkbox from '@material-ui/core/Checkbox'
import { Typography, Grid } from '@material-ui/core'

const styles = (theme) => ({
  root: {
    //display: 'flex',
  },
  formControl: {
    //margin: theme.spacing.unit * 3,
  },
})

class CheckboxesGroup extends React.Component {
  state = {
    ShowDepositWithdrawal: false,
    ShowTrades: false,
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked })
  }

  render() {
    const { classes } = this.props
    const { ShowDepositWithdrawal, ShowTrades } = this.state
    const error =
      [ShowDepositWithdrawal, ShowTrades].filter((v) => v).length !== 2

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <Grid
            container
            justify="left"
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography style={{ fontSize: '0.75rem' }}>
              Show Deposit / Withdrawal{' '}
              <Checkbox
                style={{ padding: '0' }}
                checked={ShowDepositWithdrawal}
                onChange={this.handleChange('ShowDepositWithdrawal')}
                value="ShowDepositWithdrawal"
              />
            </Typography>
            <Typography style={{ fontSize: '0.75rem' }}>
              Show Trades{' '}
              <Checkbox
                style={{ padding: '0' }}
                checked={ShowTrades}
                onChange={this.handleChange('ShowTrades')}
                value="ShowTrades"
              />
            </Typography>
          </Grid>
          {/* 
          <FormControlLabel
            label="Show Deposit / Withdrawal"
            control={
              <Checkbox
                checked={ShowDepositWithdrawal}
                onChange={this.handleChange('ShowDepositWithdrawal')}
                value="ShowDepositWithdrawal"
              />
            }
          /> */}
        </FormControl>
      </div>
    )
  }
}

export default withStyles(styles)(CheckboxesGroup)
