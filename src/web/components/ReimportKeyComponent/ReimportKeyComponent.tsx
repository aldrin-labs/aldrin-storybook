import React from 'react'
import { Grid } from '@material-ui/core'
import SvgIcon from '@sb/components/SvgIcon'
import { TooltipCustom } from '@sb/components/index'
import { Tooltip } from '@material-ui/core'

import { IProps } from './ReimportKeyComponent.types'

import Reimport from '@icons/reimport.svg'

export const ReimportKeyComponent = ({ ...props }: IProps) => {
  const { keyId, reimportKeyHandler } = props

  return (
    <Grid style={{ cursor: 'pointer' }}>
      <TooltipCustom
        PopperProps={{ disablePortal: false }}
        withSpan={true}
        title="Reimport your key assets"
        component={
          <SvgIcon
            alt="Reimport your key assets"
            src={Reimport}
            width="26px"
            height="17px"
            onClick={async () => await reimportKeyHandler(keyId)}
          />
        }
      />
    </Grid>
  )
}
