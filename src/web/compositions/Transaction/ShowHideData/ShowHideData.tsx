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
      includeFutures,
      handleChangeShowHideOptions,
    } = this.props

    return (
      <>
        <FormControlCustom component="fieldset">
          <Grid
            container
            justify="space-between"
            alignItems="center"
            style={{
              padding: '.5rem 0',
              borderBottom: '.1rem solid #e0e5ec',
            }}
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
          <Grid
            container
            justify="space-between"
            alignItems="center"
            style={{
              padding: '.5rem 0',
              borderBottom: '.1rem solid #e0e5ec',
            }}
          >
            <TypographyShowHide>Show Trades</TypographyShowHide>
            <CheckboxShowHide
              checked={includeTrades}
              onChange={handleChangeShowHideOptions('includeTrades')}
              value="includeTrades"
            />
          </Grid>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            style={{
              padding: '.5rem 0',
            }}
          >
            <TypographyShowHide>Show Futures</TypographyShowHide>
            <CheckboxShowHide
              checked={includeFutures}
              onChange={handleChangeShowHideOptions('includeFutures')}
              value="includeFutures"
            />
          </Grid>
        </FormControlCustom>
      </>
    )
  }
}

export default CheckboxesGroup
