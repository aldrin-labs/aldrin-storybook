import React from 'react'
import { components } from 'react-select'
import { Grid } from '@material-ui/core'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

type ComponentData = {
  label: string
  name: string
  value: number
}

interface ComponentIProps {
    data: ComponentData
    innerProps: any
    innerRef: any
  }

const AccountContent = ({ data }: { data: ComponentData })  => (
  <>
    <Grid item style={{ alignSelf: 'center' }}>
      {data.label}
    </Grid>
    <Grid
      item
      style={{
        alignSelf: 'flex-end',
        color: '#29AC80',
        fontSize: '1.2rem',
        paddingLeft: '1rem',
      }}
    >{`$ ${stripDigitPlaces(data.value, 2)}`}</Grid>
  </>
)

export const AccountOption = ({
  data,
  innerProps,
  innerRef,
  ...otherProps
}: ComponentIProps) => {
  return (
    <components.Option ref={innerRef} {...otherProps} {...data}>
      <Grid
        {...innerProps}
        container
        style={{ padding: '0 2rem', height: '100%' }}
      >
        <AccountContent data={data} />
      </Grid>
    </components.Option>
  )
}

export const AccountSingleValue = ({
  data,
  innerProps,
  innerRef,
  ...otherProps
}: ComponentIProps) => {
  return (
    <components.SingleValue ref={innerRef} {...otherProps} {...data}>
      <Grid {...innerProps} container style={{ height: '100%' }}>
        <AccountContent data={data} />
      </Grid>
    </components.SingleValue>
  )
}
