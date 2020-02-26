import React, { useState } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'
import { Loading } from '@sb/components/index'

import {
  TypographyCustomHeading,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

interface IProps {
  open: boolean
  handleClose: () => void
  goToProfileSettingsHandler: () => Promise<void>
}

const WithdrawalEnableMfaPopup = ({ open, handleClose, goToProfileSettingsHandler }: IProps) => {
  const [loading, setLoading] = useState(false)

  return (
    <>
      <DialogWrapper
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
        open={open}
        style={{
          borderRadius: '50%',
          paddingTop: 0,
        }}
      >
        <DialogTitleCustom id="customized-dialog-title">
          <TypographyCustomHeading
            fontWeight={'700'}
            style={{
              textAlign: 'center',
              fontSize: '1.4rem',
              letterSpacing: '1.5px',
              color: '#16253D',
            }}
          >
            2-factor authentication
          </TypographyCustomHeading>
        </DialogTitleCustom>
        <DialogContent
          justify="center"
          style={{
            padding: '0 3rem 3rem',
          }}
        >
          <Grid>
            <Grid>
              <Typography
                style={{
                  textAlign: 'center',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#7284A0',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  padding: '3rem 0',
                }}
              >
                You need enable 2FA to process withdrawal
              </Typography>
            </Grid>
            <Grid container justify="center" alignItems="center">
              <BtnCustom
                disabled={loading === true}
                btnWidth={'38%'}
                borderRadius={'8px'}
                btnColor={'#165BE0'}
                borderWidth={'2px'}
                fontWeight={'bold'}
                fontSize={'1.2rem'}
                height={'4rem'}
                onClick={async () => {
                  setLoading(true)
                  await goToProfileSettingsHandler()
                  setLoading(false)
                }}
              >
                {loading ? (
                  <Loading size={16} style={{ height: '16px' }} />
                ) : (
                  `Go to profile settings page`
                )}
              </BtnCustom>
            </Grid>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default WithdrawalEnableMfaPopup
