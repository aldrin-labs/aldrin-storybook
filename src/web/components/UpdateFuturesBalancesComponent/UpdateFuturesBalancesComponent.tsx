import React, { useState } from 'react'
import { Grid } from '@material-ui/core'

import { Loading, TooltipCustom, SvgIcon } from '@sb/components'

import { IProps } from './UpdateFuturesBalancesComponent.types'

import Reimport from '@icons/reimport.svg'

export const UpdateFuturesBalancesComponent = ({ ...props }: IProps) => {
  const [loading, setLoading] = useState(false)
  const { keyId, updateFuturesBalancesHandler } = props

  return (
    <div style={{ position: 'absolute', right: '1rem', cursor: 'pointer' }}>
      {loading ? (
        <Loading size={16} style={{ height: '16px' }} />
      ) : (
        <Grid>
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
                onClick={async () => {
                  setLoading(true)
                  await updateFuturesBalancesHandler(keyId)
                  setLoading(false)
                }}
              />
            }
          />
        </Grid>
      )}
    </div>
  )
}
