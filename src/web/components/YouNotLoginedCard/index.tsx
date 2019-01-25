import React, { PureComponent } from 'react'
import { CardContent, Typography } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import { StyledDialog, StyledCard, MdLockStyled } from './index.styles'
import { Login } from '@core/containers/Login'
import { IProps, IState } from './index.types'


class LoginCard extends PureComponent<IProps, IState> {
  state = {
    showModal: false,
  }

  render() {
    const {
      showModalAfterDelay,
      theme: {
        palette: { secondary },
      },
      open,
    } = this.props
    const { showModal } = this.state

    showModalAfterDelay && showModalAfterDelay > 0
      ? setTimeout(() => {
          this.setState({ showModal: true })
        }, showModalAfterDelay)
      : null

    return (
      <>
        {showModal ? (
          <Login mainColor={secondary.main} isShownModal={true} />
        ) : null}
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
                color="textPrimary"
                align="center"
                variant="h4"
                gutterBottom={true}
              >
                Hello there, welcome to cryptocurrencies.ai👐
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
      </>
    )
  }
}


export default withTheme()(LoginCard)
