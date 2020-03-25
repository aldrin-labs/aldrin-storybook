import React from 'react'
import { LinearProgress } from '@material-ui/core'

export const LinearProgressCustom = () => (
  <LinearProgress
    style={{
      position: 'fixed',
      top: 0,
      width: '100vw',
      zIndex: 1009,
    }}
    color="secondary"
  />
)
