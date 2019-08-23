import React from 'react'
import { Grid } from '@material-ui/core'
import {
  TypographyShowHide,
  CheckboxShowHide,
  FormControlCustom,
} from './ShowHideData.style'

class CheckboxesGroup extends React.Component {
  // state = {
  //   includeExchangeTransactions: true,
  //   includeTrades: true,
  // }
  //
  // handleChangeShowHideOptions = (option) => (event) => {
  //   this.setState({ [option]: event.target.checked })
  // }

  render() {
    const { includeExchangeTransactions, includeTrades } = this.state

    return (
      <>
        <FormControlCustom component="fieldset">
          <Grid
            container
            justify="space-between"
            alignItems="center"
            style={{ marginBottom: '.75rem' }}
          >
            <TypographyShowHide>Show Deposit / Withdrawal</TypographyShowHide>
            <CheckboxShowHide
              checked={includeExchangeTransactions}
              onChange={this.handleChangeShowHideOptions('includeExchangeTransactions')}
              value="includeExchangeTransactions"
            />
          </Grid>
          <Grid container justify="space-between" alignItems="center">
            <TypographyShowHide>Show Trades</TypographyShowHide>
            <CheckboxShowHide
              checked={includeTrades}
              onChange={this.handleChangeShowHideOptions('includeTrades')}
              value="includeTrades"
            />
          </Grid>
        </FormControlCustom>
      </>
    )
  }
}

export default CheckboxesGroup
