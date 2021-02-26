import React, { useState } from 'react'
import { Grid } from '@material-ui/core'

import { Loading, TooltipCustom, SvgIcon } from '@sb/components'

import { IProps } from './UpdateBalancesComponent.types'

import Reimport from '@icons/reimport.svg'

export const UpdateBalancesComponent = ({ ...props }: IProps) => {
  const [loading, setLoading] = useState(false)
  const { keyId, updateBalancesHandler, marketType } = props

  return (
    <div style={{ position: 'absolute', right: '1rem', cursor: 'pointer' }}>
      {loading ? (
        <Loading size={16} style={{ height: '16px' }} />
      ) : (
        <Grid>
          <TooltipCustom
            PopperProps={{ disablePortal: false }}
            withSpan={true}
            title={`Update your ${marketType === 0 ? 'spot' : 'futures'} balances`}
            component={
              <SvgIcon
                alt={`Update your ${marketType === 0 ? 'spot' : 'futures'} balances`}
                src={Reimport}
                width="26px"
                height="17px"
                onClick={async () => {
                  setLoading(true)
                  await updateBalancesHandler(keyId)
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
