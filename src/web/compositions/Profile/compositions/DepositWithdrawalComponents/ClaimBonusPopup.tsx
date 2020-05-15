import React, { useState } from 'react'
import { Grid, Typography, Link } from '@material-ui/core'
import { Loading } from '@sb/components/index'
import SvgIcon from '@sb/components/SvgIcon'
import checkmarkGreen from '@icons/checkmarkGreen.svg'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { DialogContent } from '@sb/styles/Dialog.styles'

interface IProps {
  open: boolean
  handleClose: () => void
  claimRequestLoading: boolean
  claimRequestStatus: 'ERR' | 'OK' | string
  claimBonusId: string
  claimRequestErrorText: string
}

const ClaimBonusPopup = ({
  open,
  handleClose,
  claimRequestLoading,
  claimRequestStatus,
  claimBonusId,
  claimRequestErrorText,
}: IProps) => {
  return (
    <>
      <DialogWrapper
        aria-labelledby="customized-dialog-title"
        open={open}
        onClose={claimRequestLoading !== true ? handleClose : () => {}}
        PaperProps={{
          style: {
            minWidth: '50%',
            minHeight: '50%',
          },
        }}
      >
        <DialogContent
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '3rem',
            position: 'relative',
          }}
        >
          <Grid container justify="center" alignItems="center">
            {claimRequestLoading ? (
              <Loading size={50} style={{ height: '50px' }} />
            ) : claimRequestStatus === 'ERR' ? (
              <Typography
                style={{
                  fontSize: '1.6rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#16253D',
                }}
              >
                {claimRequestErrorText}
              </Typography>
            ) : null}
          </Grid>
          {claimRequestStatus === 'OK' && !claimRequestLoading && (
            <>
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
                  Your bonus request id is:{' '}
                  <span
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    {claimBonusId}
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
                  It takes up to 24 hrs for your bonus to arrive. If it takes
                  more than 24 hrs and you did not receive your bonus then
                  please contact{' '}
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
            </>
          )}
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default ClaimBonusPopup
