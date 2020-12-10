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

import { Input } from './index'
import { Loading } from '@sb/components/index'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { addWalletContact } from '@core/graphql/mutations/chart/addWalletContact'

import { notify } from '@sb/dexUtils/notifications'
import { encrypt, createHash } from './index'

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

const NewContactPopup = ({
  theme,
  open,
  handleClose,
  addWalletContactMutation,
  publicKey,
  localPassword,
  getUserAddressbookQueryRefetch,
}) => {
  const [name, updateName] = useState('')
  const [email, updateEmail] = useState('')
  const [address, updateAddress] = useState('')
  const [showLoader, updateShowLoader] = useState(false)

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      style={{ width: '85rem', margin: 'auto' }}
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
          background: '#303743',
          borderBottom: '.1rem solid #424b68',
        }}
      >
        <span
          style={{
            fontSize: '1.8rem',
            color: '#fff',
            fontFamily: 'Avenir Next Demi',
          }}
        >
          Add new contact
        </span>
      </StyledDialogTitle>
      <StyledDialogContent
        style={{ background: '#303743' }}
        theme={theme}
        id="share-dialog-content"
      >
        <div style={{ paddingTop: '2.5rem', textAlign: 'center' }}>
          <Input
            type={'text'}
            placeholder={'Name'}
            value={name}
            onChange={(e) => updateName(e.target.value)}
          />
          <Input
            type={'email'}
            placeholder={'Email'}
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
          />
          <div style={{ position: 'relative' }}>
            <Input
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
            // disable={!enableEdit}
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
                  message: 'Name field should not be empty'
                })

                return
              }

              if (address === '') {
                notify({
                  type: 'error',
                  message: 'SOL address field should not be empty'
                })

                return
              }

              await updateShowLoader(true)

              // encrypt each field
              const result = await addWalletContactMutation({
                variables: {
                  publicKey: createHash(publicKey, localPassword),
                  name: encrypt(name, localPassword),
                  email: email !== '' ? encrypt(email, localPassword) : '',
                  contactPublicKey: encrypt(address, localPassword),
                  contactPublicKeyHash: encrypt(address, localPassword),
                  symbol: encrypt("SOL", localPassword),
                },
              })

              await getUserAddressbookQueryRefetch()

              notify({
                type: result.data.addWalletContact.status === 'ERR' ? 'error' : 'success',
                message: result.data.addWalletContact.message,
              })

              await updateShowLoader(false)
              await updateName('')
              await updateEmail('')
              await updateAddress('')
              await handleClose()
            }}
          >
            {showLoader ? <Loading color={'#fff'} size={16} height={'16px'} style={{ height: '16px' }} /> : 'Add contact'}
          </BtnCustom>
        </div>
      </StyledDialogContent>
    </DialogWrapper>
  )
}

// add mutation with graphql
export default compose(
  graphql(addWalletContact, { name: 'addWalletContactMutation' })
)(NewContactPopup)
