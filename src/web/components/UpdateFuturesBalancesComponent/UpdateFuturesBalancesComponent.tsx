import React from 'react'
import { Grid } from '@material-ui/core'
import SvgIcon from '@sb/components/SvgIcon'
import { TooltipCustom } from '@sb/components/index'

import { IProps } from './UpdateFuturesBalancesComponent.types'

import Reimport from '@icons/reimport.svg'

export const UpdateFuturesBalancesComponent = ({ ...props }: IProps) => {
  const { keyId, updateFuturesBalancesHandler } = props

  return (
    <Grid style={{ cursor: 'pointer' }}>
      <TooltipCustom
        PopperProps={{ disablePortal: false }}
        withSpan={true}
        title="Update your futures balances"
        component={
          <SvgIcon
            alt="Update your futures balances"
            src={Reimport}
            width="26px"
            height="17px"
            onClick={async () => await updateFuturesBalancesHandler(keyId)}
          />
        }
      />
    </Grid>
  )
}
