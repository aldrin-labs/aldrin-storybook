import React, { Ref } from 'react'
import { components } from 'react-select'
import LazyLoad from 'react-lazyload'

import { Grid } from '@material-ui/core'

import SvgIcon from '@sb/components/SvgIcon'
import { importCoinIcon, onErrorImportCoinUrl } from '@core/utils/MarketCapUtils'

type ComponentData = {
  label: string
  name: string
}

interface ComponentIProps {
  data: ComponentData
  innerProps: any
  innerRef: any
}

const CoinContent = ({ data }: { data: ComponentData }) => (
  <>
    <Grid item style={{ display: 'flex', alignSelf: 'center' }}>
      <LazyLoad height={`1.7rem`} once>
        <SvgIcon
          style={{
            marginRight: '.5rem',
          }}
          width={`2rem`}
          height={'2rem'}
          src={importCoinIcon(data.label)}
          onError={onErrorImportCoinUrl}
        />
      </LazyLoad>
    </Grid>
    <Grid item style={{ alignSelf: 'center' }}>
      {data.label}
    </Grid>
    <Grid
      item
      style={{
        transform: 'translateY(25%)',
        alignSelf: 'center',
        color: '#7284A0',
        fontSize: '1rem',
        paddingLeft: '.5rem',
      }}
    >
      {data.name}
    </Grid>
  </>
)

export const CoinOption = ({
  data,
  innerProps,
  innerRef,
  ...otherProps
}: ComponentIProps) => {
  return (
    <components.Option ref={innerRef} {...otherProps} {...data}>
      <Grid
        container
        {...innerProps}
        style={{ padding: '0 2rem', height: '100%' }}
      >
        <CoinContent data={data} />
      </Grid>
    </components.Option>
  )
}

export const CoinSingleValue = ({
  data,
  innerProps,
  innerRef,
  ...otherProps
}: ComponentIProps) => {
  return (
    <components.SingleValue ref={innerRef} {...otherProps} {...data}>
      <Grid container {...innerProps} style={{ height: '100%' }}>
        <CoinContent data={data} />
      </Grid>
    </components.SingleValue>
  )
}
