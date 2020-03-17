import React, { useState, useForceUpdate } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { Loading } from '@sb/components/index'
import LoginComposition from '@sb/compositions/Login/LoginComposition'

import {
  TypographyCustomHeading,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { DialogContent } from '@sb/styles/Dialog.styles'

interface IProps {
  open: boolean
  handleClose: () => void
  onLoginForWithdrawal: (
    rawProfile: any,
    idToken: any,
    accessToken: string
  ) => Promise<void>
}

const WithdrawalAuthentificatePopup = ({
  open,
  handleClose,
  onLoginForWithdrawal,
}: IProps) => {
  return (
    <>
      <DialogWrapper
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
        open={open}
        maxWidth="md"
        keepMounted={true}
        PaperProps={{
          style: {
            minWidth: '50%',
          },
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
            padding: '3rem',
          }}
        >
          <LoginComposition
            key={`loginCompositionKey-${open}`}
            initialStep={'signIn'}
            onLogin={onLoginForWithdrawal}
            forWithdrawal={true}
          />
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default WithdrawalAuthentificatePopup
