import React from 'react'
import { withStyles } from '@material-ui/styles'

import { Fab } from '@material-ui/core'

const FabStyled = withStyles((theme) => ({
  root: {
    marginLeft: '1.12rem',
    height: 38,
    background: 'transparent',
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    boxShadow: 'none',
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
}))(Fab)

export default ({
  onClick,
  children,
  className,
}: {
  onClick: () => void
  children: React.ReactChildren | string
  className?: string
}) => (
  <FabStyled
    data-e2e="mainChart__typeOfChartSwitcher"
    size="small"
    onClick={onClick}
    variant="extended"
    className={className}
  >
    {children}
  </FabStyled>
)
