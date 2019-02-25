import React, { PureComponent } from 'react'
import { CardContent, Typography } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import { StyledDialog, StyledCard, MdLockStyled } from './index.styles'
import { IProps } from './index.types'

class AuthErrorCard extends PureComponent<IProps> {
  render() {
    const { open } = this.props

    return (
      <>
        <StyledDialog
          open={open}
          BackdropProps={{ style: { display: 'none' } }}
        >
          <StyledCard>
            <CardContent>
              <Typography align="center" variant="h1" gutterBottom={true}>
                <MdLockStyled />
              </Typography>
              <Typography
                color="textSecondary"
                align="center"
                variant="h6"
                gutterBottom={true}
              >
                You must confirm your email
              </Typography>
            </CardContent>
          </StyledCard>
        </StyledDialog>
      </>
    )
  }
}

export default withTheme()(AuthErrorCard)
