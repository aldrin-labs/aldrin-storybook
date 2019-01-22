import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import { Button } from '@material-ui/core'

const ButtonStyled = withStyles((theme) => ({
  root: {
    marginLeft: '0.7rem',
    height: 38,
    background: 'transparent',
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    boxShadow: 'none',
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
}))(Button)

export default ({
  onClick,
  children,
  className,
}: {
  onClick: () => void
  children: React.ReactChildren | string
  className?: string
}) => (
  <ButtonStyled
    data-e2e="mainChart__typeOfChartSwitcher"
    size="small"
    onClick={onClick}
    variant="extendedFab"
    className={className}
  >
    {children}
  </ButtonStyled>
)
