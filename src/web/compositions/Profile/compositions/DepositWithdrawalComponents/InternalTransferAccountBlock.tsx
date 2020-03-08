import React from 'react'
import { Grid, Typography } from '@material-ui/core'

import {
  AccountOption,
  AccountSingleValue,
} from '@sb/components/ReactSelectComponents/AccountOption'

import SelectPortfolio from '@core/components/SelectPortfolio/SelectPortfolio'
import SelectKeyList from '@core/components/SelectKeyList/SelectKeyList'
import { StyledTypography } from './AccountBlock.styles'

const InternalTransferAccountBlock = ({
  selectedKeyFrom,
  selectedKeyTo,
  selectedPortfolioFrom,
  selectedPortfolioTo,
}: any) => (
  <Grid
    id="left_block"
    container
    direction="column"
    justify="center"
    style={{ width: '35%', borderRight: '1px solid #E0E5EC' }}
    spacing={32}
  >
    <Grid item id="portfolio_from_block">
      <StyledTypography>From</StyledTypography>
      <Grid
        style={{ height: '6rem', padding: '1rem 0 0 0', overflow: 'hidden' }}
      >
        <SelectKeyList
          classNamePrefix="custom-select-box"
          components={{
            Option: AccountOption,
            SingleValue: AccountSingleValue,
            DropdownIndicator: undefined,
          }}
          isSearchable={false}
          menuPortalTarget={document.body}
          menuPortalStyles={{
            zIndex: 11111,
          }}
          menuStyles={{
            fontSize: '1.4rem',
            fontWeight: 'bold',
            padding: '0',
            borderRadius: '1.5rem',
            textAlign: 'center',
            background: 'white',
            position: 'relative',
            boxShadow: 'none',
            border: 'none',
          }}
          menuListStyles={{
            height: '16rem',
          }}
          optionStyles={{
            height: '4rem',
            background: 'transparent',
            fontSize: '1.4rem',
            textTransform: 'uppercase',
            padding: '0',

            '&:hover': {
              borderRadius: '0.8rem',
              color: '#16253D',
              background: '#E7ECF3',
            },
          }}
          clearIndicatorStyles={{
            padding: '2px',
          }}
          inputStyles={{
            fontSize: '1.4rem',
            marginLeft: '0',
          }}
          valueContainerStyles={{
            border: '2px solid #E0E5EC',
            borderRadius: '8px',
            background: '#fff',
            paddingLeft: '15px',
            height: '5rem',
            '&:hover': {
              borderColor: '#165BE0',
            },
          }}
          noOptionsMessageStyles={{
            textAlign: 'left',
          }}
          singleValueStyles={{
            color: '#16253D',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            height: '100%',
            padding: '0.5rem 0',
          }}
          placeholderStyles={{
            color: '#16253D',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        />
      </Grid>
      <Grid
        style={{ height: '6rem', padding: '1rem 0 0 0', overflow: 'hidden' }}
      >
        <SelectPortfolio
          isClearable={false}
          value={
            selectedPortfolio
              ? [
                  {
                    label: selectedPortfolio.label,
                    value: selectedPortfolio.value,
                  },
                ]
              : null
          }
          onChange={this.onChangePortfolio}
          menuPortalTarget={document.body}
          menuPortalStyles={{
            zIndex: 11111,
          }}
          menuStyles={{
            fontSize: '1.4rem',
            fontWeight: 'bold',
            padding: '0',
            borderRadius: '1.5rem',
            textAlign: 'center',
            background: 'white',
            position: 'relative',
            boxShadow: 'none',
            border: 'none',
          }}
          menuListStyles={{
            height: '16rem',
          }}
          optionStyles={{
            height: '4rem',
            background: 'transparent',
            fontSize: '1.4rem',
            textTransform: 'uppercase',
            padding: '0',

            '&:hover': {
              borderRadius: '0.8rem',
              color: '#16253D',
              background: '#E7ECF3',
            },
          }}
          clearIndicatorStyles={{
            padding: '2px',
          }}
          inputStyles={{
            fontSize: '1.4rem',
            marginLeft: '0',
          }}
          valueContainerStyles={{
            border: '2px solid #E0E5EC',
            borderRadius: '8px',
            background: '#fff',
            paddingLeft: '15px',
            height: '5rem',
            '&:hover': {
              borderColor: '#165BE0',
            },
          }}
          noOptionsMessageStyles={{
            textAlign: 'left',
          }}
          singleValueStyles={{
            color: '#16253D',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            height: '100%',
            padding: '0.5rem 0',
          }}
          placeholderStyles={{
            color: '#16253D',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        />
      </Grid>
    </Grid>
    <Grid item id="portfolio_to_block">
      <StyledTypography>To</StyledTypography>
      <Grid
        style={{ height: '6rem', padding: '1rem 0 0 0', overflow: 'hidden' }}
      >
        <SelectPortfolio
          isClearable={false}
          value={
            selectedPortfolio
              ? [
                  {
                    label: selectedPortfolio.label,
                    value: selectedPortfolio.value,
                  },
                ]
              : null
          }
          onChange={this.onChangePortfolio}
          menuPortalTarget={document.body}
          menuPortalStyles={{
            zIndex: 11111,
          }}
          menuStyles={{
            fontSize: '1.4rem',
            fontWeight: 'bold',
            padding: '0',
            borderRadius: '1.5rem',
            textAlign: 'center',
            background: 'white',
            position: 'relative',
            boxShadow: 'none',
            border: 'none',
          }}
          menuListStyles={{
            height: '16rem',
          }}
          optionStyles={{
            height: '4rem',
            background: 'transparent',
            fontSize: '1.4rem',
            textTransform: 'uppercase',
            padding: '0',

            '&:hover': {
              borderRadius: '0.8rem',
              color: '#16253D',
              background: '#E7ECF3',
            },
          }}
          clearIndicatorStyles={{
            padding: '2px',
          }}
          inputStyles={{
            fontSize: '1.4rem',
            marginLeft: '0',
          }}
          valueContainerStyles={{
            border: '2px solid #E0E5EC',
            borderRadius: '8px',
            background: '#fff',
            paddingLeft: '15px',
            height: '5rem',
            '&:hover': {
              borderColor: '#165BE0',
            },
          }}
          noOptionsMessageStyles={{
            textAlign: 'left',
          }}
          singleValueStyles={{
            color: '#16253D',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            height: '100%',
            padding: '0.5rem 0',
          }}
          placeholderStyles={{
            color: '#16253D',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        />
      </Grid>
      <Grid
        style={{ height: '6rem', padding: '1rem 0 0 0', overflow: 'hidden' }}
      >
        <SelectKeyList
          classNamePrefix="custom-select-box"
          components={{
            Option: AccountOption,
            SingleValue: AccountSingleValue,
            DropdownIndicator: undefined,
          }}
          isSearchable={false}
          menuPortalTarget={document.body}
          menuPortalStyles={{
            zIndex: 11111,
          }}
          menuStyles={{
            fontSize: '1.4rem',
            fontWeight: 'bold',
            padding: '0',
            borderRadius: '1.5rem',
            textAlign: 'center',
            background: 'white',
            position: 'relative',
            // overflowY: 'auto',
            boxShadow: 'none',
            border: 'none',
          }}
          menuListStyles={{
            height: '16rem',
            // overflowY: '',
          }}
          optionStyles={{
            height: '4rem',
            background: 'transparent',
            fontSize: '1.4rem',
            textTransform: 'uppercase',
            padding: '0',

            '&:hover': {
              borderRadius: '0.8rem',
              color: '#16253D',
              background: '#E7ECF3',
            },
          }}
          clearIndicatorStyles={{
            padding: '2px',
          }}
          inputStyles={{
            fontSize: '1.4rem',
            marginLeft: '0',
          }}
          valueContainerStyles={{
            border: '2px solid #E0E5EC',
            borderRadius: '8px',
            background: '#fff',
            paddingLeft: '15px',
            height: '5rem',
            '&:hover': {
              borderColor: '#165BE0',
            },
          }}
          noOptionsMessageStyles={{
            textAlign: 'left',
          }}
          singleValueStyles={{
            color: '#16253D',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            height: '100%',
            padding: '0.5rem 0',
          }}
          placeholderStyles={{
            color: '#16253D',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        />
      </Grid>
    </Grid>
  </Grid>
)

export default InternalTransferAccountBlock
