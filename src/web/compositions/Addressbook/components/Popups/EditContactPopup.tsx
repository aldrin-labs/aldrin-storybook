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
import { editContact } from '@core/graphql/mutations/chart/editContact'

import { notify } from '@sb/dexUtils/notifications'
import { encrypt, decrypt, createHash } from '../../index'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 55rem;
`

export const PasteButton = styled.button`
  position: absolute;
  font-size: 1.8rem;
  right: 0.5rem;
  background: inherit;
  border: 0;
  color: #7380eb;
  cursor: pointer;
  padding: 1.5rem;
`

const EditContactPopup = ({
  theme,
  open,
  handleClose,
  editContactMutation,
  publicKey,
  localPassword,
  getUserAddressbookQueryRefetch,
  data
}) => {
  

  const [name, updateName] = useState(decrypt(data.name, localPassword))
  const [email, updateEmail] = useState(decrypt(data.email, localPassword))
  const [address, updateAddress] = useState(decrypt(data.publicKey, localPassword))
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
          Edit contact
        </span>
      </StyledDialogTitle>
      <StyledDialogContent
        style={{ background: theme.palette.grey.input }}
        theme={theme}
        id="share-dialog-content"
      >
        <div style={{ paddingTop: '2.5rem', textAlign: 'center' }}>
          <Input
            style={{
              background: theme.palette.grey.input,
              color: theme.palette.text.light,
              border: `0.1rem solid ${theme.palette.text.white}`,
              outline: 'none',
            }}
            type={'text'}
            placeholder={'Name'}
            value={name}
            onChange={(e) => updateName(e.target.value)}
          />
          <Input
            style={{
              background: theme.palette.grey.input,
              color: theme.palette.text.light,
              border: `0.1rem solid ${theme.palette.text.white}`,
              outline: 'none',
            }}
            type={'email'}
            placeholder={'Email'}
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
          />
          <div style={{ position: 'relative' }}>
            <Input
              style={{
                background: theme.palette.grey.input,
                color: theme.palette.text.light,
                border: `0.1rem solid ${theme.palette.text.white}`,
                outline: 'none',
              }}
              id={'address'}
              type={'text'}
              placeholder={'SOL Address'}
              value={address}
              onChange={(e) => updateAddress(e.target.value)}
            />
            <PasteButton
              onClick={() => {
                navigator.clipboard
                  .readText()
                  .then((clipText) => updateAddress(clipText))
              }}
            >
              Paste
            </PasteButton>
          </div>
          <BtnCustom
            disabled={showLoader}
            needMinWidth={false}
            btnWidth="15rem"
            height="4.5rem"
            fontSize="1.4rem"
            padding="1rem 2rem"
            borderRadius=".8rem"
            borderColor={'#7380EB'}
            btnColor={'#fff'}
            backgroundColor={'#7380EB'}
            textTransform={'none'}
            margin={'1rem 0 0 0'}
            transition={'all .4s ease-out'}
            onClick={async () => {
              if (name === '') {
                notify({
                  type: 'error',
                  message: 'Name field should not be empty',
                })

                return
              }

              if (address === '') {
                notify({
                  type: 'error',
                  message: 'SOL address field should not be empty',
                })

                return
              }

              await updateShowLoader(true)

              // encrypt each field
              const result = await editContactMutation({
                variables: {
                  publicKey: createHash(publicKey, localPassword),
                  name: encrypt(name, localPassword),
                  email: email !== '' ? encrypt(email, localPassword) : '',
                  contactPublicKey: encrypt(address, localPassword),
                  prevContactPublicKey: data.publicKey,
                },
              })

              await getUserAddressbookQueryRefetch()

              notify({
                type:
                  result.data.editContact.status === 'ERR'
                    ? 'error'
                    : 'success',
                message: result.data.editContact.message,
              })

              await updateShowLoader(false)
              await updateName('')
              await updateEmail('')
              await updateAddress('')
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
              'Update contact'
            )}
          </BtnCustom>
        </div>
      </StyledDialogContent>
    </DialogWrapper>
  )
}

// add mutation with graphql
export default compose(
  graphql(editContact, { name: 'editContactMutation' })
)(EditContactPopup)
