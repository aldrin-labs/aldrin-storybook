import React from 'react'
import { withRouter } from 'react-router-dom'
import { Grid, Typography, Link } from '@material-ui/core'

import SvgIcon from '@sb/components/SvgIcon'
import checkmarkGreen from '@icons/checkmarkGreen.svg'

const ConfirmWithdrawal = ({ ...props }) => {
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{ height: 'calc(100% - 5rem)' }}
    >
      <Grid
        style={{ width: '40%' }}
        container
        justify="center"
        alignItems="center"
      >
        <Grid
          style={{
            background: '#FFFFFF',
            border: '2px solid #E0E5EC',
            boxShadow: '0px 0px 32px rgba(8, 22, 58, 0.1)',
            borderRadius: '16px',
            padding: '2rem',
          }}
        >
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{
              paddingBottom: '2rem',
            }}
          >
            <SvgIcon src={checkmarkGreen} width="5rem" height="auto" />
          </Grid>
          <Grid
            style={{
              paddingBottom: '2rem',
              textAlign: 'center',
            }}
          >
            <Typography
              style={{
                fontSize: '1.6rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#16253D',
              }}
            >
              Your withdrawal request id is:{' '}
              <span
                style={{
                  fontWeight: 'bold',
                }}
              >
                {props.match.params.withdrawalRequestId}
              </span>
            </Typography>
          </Grid>
          <Grid
            style={{
              textAlign: 'center',
            }}
          >
            <Typography
              style={{
                fontSize: '1.6rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#16253D',
                fontWeight: 'bold',
              }}
            >
              To confirm your withdrawal please contact{' '}
              <Link
                style={{
                  color: '#165BE0',
                }}
                target={'_blank'}
                rel={'noreferrer noopener'}
                href="https://t.me/customer_tech_support"
              >
                our tech support
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default withRouter(ConfirmWithdrawal)
