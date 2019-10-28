import React from 'react'
import { CardContent, Typography } from '@material-ui/core'

import { StyledDialog, StyledCard, MdLockStyled } from './index.styles'
import { IProps } from './index.types'

const LoginCard = ({ open }: IProps) => (
  <StyledDialog open={open} BackdropProps={{ style: { display: 'none' } }}>
    <StyledCard>
      <CardContent>
        <Typography align="center" variant="h1" gutterBottom={true}>
          <MdLockStyled />
        </Typography>
        <Typography
          color="textPrimary"
          align="center"
          variant="h4"
          gutterBottom={true}
        >
          Hello there, welcome to cryptocurrencies.ai
        </Typography>
        <Typography
          color="textSecondary"
          align="center"
          variant="h6"
          gutterBottom={true}
        >
          You must login to view this page
        </Typography>
      </CardContent>
    </StyledCard>
  </StyledDialog>
)

export default LoginCard
