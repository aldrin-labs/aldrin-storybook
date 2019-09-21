import React from 'react'
import { Grid } from '@material-ui/core'
import {
  TypographyShowHide,
  CheckboxShowHide,
  FormControlCustom,
} from './ShowHideData.style'

class CheckboxesGroup extends React.Component {
  render() {
    const {
      includeExchangeTransactions,
      includeTrades,
      handleChangeShowHideOptions,
    } = this.props

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
              onChange={handleChangeShowHideOptions(
                'includeExchangeTransactions'
              )}
              value="includeExchangeTransactions"
            />
          </Grid>
          <Grid container justify="space-between" alignItems="center">
            <TypographyShowHide>Show Trades</TypographyShowHide>
            <CheckboxShowHide
              checked={includeTrades}
              onChange={handleChangeShowHideOptions('includeTrades')}
              value="includeTrades"
            />
          </Grid>
        </FormControlCustom>
      </>
    )
  }
}

export default CheckboxesGroup
