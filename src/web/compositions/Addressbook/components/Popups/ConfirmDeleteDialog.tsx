import React, { useState } from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { Dialog, Paper } from '@material-ui/core'

import {
  TypographyTitle,
  StyledDialogContent,
  ClearButton,
  StyledDialogTitle,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import { Input } from '../../index'
import { Loading } from '@sb/components/index'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { deleteContact } from '@core/graphql/mutations/chart/deleteContact'
import { deleteContactCoin } from '@core/graphql/mutations/chart/deleteContactCoin'

import { notify } from '@sb/dexUtils/notifications'
import { encrypt, createHash } from '../../index'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 55rem;
`

const ConfirmDeleteDialog = ({
  theme,
  open,
  data,
  title,
  isContact,
  handleClose,
  contactPublicKey,
  publicKey,
  localPassword,
  getUserAddressbookQueryRefetch,
  deleteContactMutation,
  deleteContactCoinMutation,
}) => {
  const [showLoader, updateShowLoader] = useState(false)

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      style={{
        width: '85rem',
        margin: 'auto',
      }}
      fullScreen={false}
      onClose={handleClose}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <StyledDialogTitle
        disableTypography
        theme={theme}
        style={{
          justifyContent: 'center',
          background: theme.palette.grey.input,
          border: `0.1rem solid ${theme.palette.text.white}`,
        }}
      >
        <span
          style={{
            fontSize: '1.8rem',
            color: theme.palette.text.light,
            fontFamily: 'Avenir Next Demi',
          }}
        >
          {title}
        </span>
      </StyledDialogTitle>
      <StyledDialogContent
        style={{ background: theme.palette.grey.input, textAlign: 'center' }}
        theme={theme}
        id="share-dialog-content"
      >
          <BtnCustom
            disabled={showLoader}
            needMinWidth={false}
            btnWidth="15rem"
            height="4.5rem"
            fontSize="1.4rem"
            padding="1rem 2rem"
            borderRadius=".8rem"
            borderColor={theme.palette.blue.serum}
            btnColor={'#fff'}
            backgroundColor={theme.palette.blue.serum}
            textTransform={'none'}
            margin={'2.4rem 0 0 0'}
            transition={'all .4s ease-out'}
            onClick={async () => {
              await updateShowLoader(true)

              const mutation = isContact ? deleteContactMutation : deleteContactCoinMutation

              const variables = isContact ? {
                publicKey: createHash(publicKey, localPassword),
                contactPublicKey: contactPublicKey,
              } : {
                publicKey: createHash(publicKey, localPassword),
                contactPublicKey: contactPublicKey,
                address: data.address,
              }

              // encrypt each field
              const result = await mutation({
                variables
              })

              const resultData = isContact ? result.data.deleteContact : result.data.deleteContactCoin

              await getUserAddressbookQueryRefetch()

              notify({
                type:
                resultData.status === 'ERR'
                    ? 'error'
                    : 'success',
                message: resultData.message,
              })

              await updateShowLoader(false)
              await handleClose()
            }}
          >
            {showLoader ? (
              <Loading
                color={'#fff'}
                size={16}
                height={'16px'}
                style={{ height: '16px' }}
              />
            ) : (
              'Confirm'
            )}
          </BtnCustom>
      </StyledDialogContent>
    </DialogWrapper>
  )
}

// add mutation with graphql
export default compose(
  graphql(deleteContact, { name: 'deleteContactMutation' }),
  graphql(deleteContactCoin, { name: 'deleteContactCoinMutation' }),
)(ConfirmDeleteDialog)
