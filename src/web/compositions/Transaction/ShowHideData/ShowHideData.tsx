import React from 'react'
import { Grid } from '@material-ui/core'
import {
  TypographyShowHide,
  CheckboxShowHide,
  FormControlCustom,
} from './ShowHideData.style'

class CheckboxesGroup extends React.Component {
  state = {
    ShowDepositWithdrawal: false,
    ShowTrades: false,
  }

  handleChange = (option) => (event) => {
    this.setState({ [option]: event.target.checked })
  }

  render() {
    const { ShowDepositWithdrawal, ShowTrades } = this.state
    const error =
      [ShowDepositWithdrawal, ShowTrades].filter((v) => v).length !== 2

    return (
      <>
        <FormControlCustom component="fieldset">
          <Grid container justify="space-between">
            <TypographyShowHide>Show Deposit / Withdrawal</TypographyShowHide>
            <CheckboxShowHide
              checked={ShowDepositWithdrawal}
              onChange={this.handleChange('ShowDepositWithdrawal')}
              value="ShowDepositWithdrawal"
            />
          </Grid>
          <Grid container justify="space-between">
            <TypographyShowHide>Show Trades</TypographyShowHide>
            <CheckboxShowHide
              checked={ShowTrades}
              onChange={this.handleChange('ShowTrades')}
              value="ShowTrades"
            />
          </Grid>
        </FormControlCustom>
      </>
    )
  }
}

export default CheckboxesGroup
