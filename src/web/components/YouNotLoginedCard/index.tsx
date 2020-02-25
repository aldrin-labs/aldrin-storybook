import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Typography, Button } from '@material-ui/core'

import { SvgIcon, SignUpButton } from '@sb/components'

import MainLogo from '@icons/Logo.svg'
import PortfolioMainImage from '@sb/images/PortfolioMain.png'
import { IProps } from './index.types'

const SignInLink = (props: any) => <Link to="/signin" {...props} />
const SignUpLink = (props: any) => <Link to="/signup" {...props} />

const LoginCard = ({ open, children }: IProps) =>
  open && (
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{
        height: 'calc(100% - 3rem)',
        backgroundImage: `url(${PortfolioMainImage})`,
        backgroundSize: 'cover',
      }}
    >
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="column"
        style={{ width: '45%', padding: '3rem' }}
      >
        <Grid style={{ paddingBottom: '3rem' }}>
          <SvgIcon src={MainLogo} width="18.5rem" height="auto" />
        </Grid>
        <Grid style={{ paddingBottom: '3rem' }}>
          <Typography
            style={{
              fontWeight: 'bold',
              fontSize: '2.6rem',
              lineHeight: '100%',
              color: '#16253D',
            }}
          >
            You must login to view this page
          </Typography>
        </Grid>
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ padding: '1rem 0' }}
        >
          <Button
            component={SignInLink}
            color="secondary"
            variant="contained"
            className="loginButton"
            style={{
              padding: '1px 16px',
              margin: '0 1rem',
              width: '25%',
              height: '3.9rem',
              textTransform: 'none',
              fontSize: '1.6rem',
            }}
          >
            Log in
          </Button>
          <SignUpButton
            component={SignUpLink}
            color="secondary"
            variant="contained"
            className="loginButton"
            style={{
              padding: '1px 16px',
              margin: '0 1rem',
              width: '25%',
              height: '3.9rem',
              textTransform: 'none',
              fontSize: '1.6rem',
            }}
          >
            Sign Up
          </SignUpButton>
        </Grid>
      </Grid>
    </Grid>
  )

export default LoginCard
