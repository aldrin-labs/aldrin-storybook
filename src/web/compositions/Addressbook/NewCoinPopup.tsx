import React, { useState } from 'react'
import styled from 'styled-components'
import { Dialog, Paper } from '@material-ui/core'
import { notify } from '@sb/dexUtils/notifications'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'
import {
  CoinOption,
  CoinSingleValue,
} from '@sb/components/ReactSelectComponents/CoinOption'

import {
  TypographyTitle,
  StyledDialogContent,
  ClearButton,
  StyledDialogTitle,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { addContactCoin } from '@core/graphql/mutations/chart/addContactCoin'

import { Input } from './index'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components/index'

import { compose } from 'recompose'
import { graphql } from 'react-apollo'

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

const NewCoinPopup = ({
  theme,
  open,
  handleClose,
  contactPublicKey,
  publicKey,
  password,
  addContactCoinMutation,
  getUserAddressbookQueryRefetch,
}) => {
  const [address, updateAddress] = useState('')
  const [showLoader, updateShowLoader] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState({
    label: 'BTC',
    value: 'BTC',
  })

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
          <SelectCoinList
            dropdownIndicatorStyles={{
              position: 'absolute',
              right: '.5rem',
              display: 'flex',
              width: '3rem',
              height: '3rem',
              color: '#f5f5fb',
              padding: '0',
              marginRight: '2rem',
              '& svg': {
                width: '3rem',
                height: '3rem',
              },
            }}
            classNamePrefix="custom-select-box"
            isSearchable={true}
            components={{
              Option: CoinOption,
              SingleValue: CoinSingleValue,
            }}
            menuPortalTarget={document.body}
            menuPortalStyles={{
              zIndex: 11111,
            }}
            value={selectedCoin}
            needAdditionalFiltering={true}
            additionalFiltering={(a: { symbol: string }) =>
              !a.symbol.endsWith('UP') && !a.symbol.endsWith('DOWN')
            }
            onChange={(optionSelected: { label: string; name: string }) => {
              setSelectedCoin({
                label: optionSelected.label,
                name: optionSelected.name,
              })
            }}
            noOptionsMessage={() => `Start typing to search the coin`}
            menuStyles={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              padding: '0',
              overflowY: 'hidden',
              borderRadius: '0.2rem',
              textAlign: 'center',
              background: '303743',
              position: 'relative',
              boxShadow: '-1px 3px 22px -16px rgba(127,139,148,1)',
              border: 'solid 1px #424b68',
            }}
            menuListStyles={{
              height: '20rem',
            }}
            optionStyles={{
              color: '#f5f5fb',
              outline: 'none',
              height: '4rem',
              background: '#303743',
              fontSize: '1.4rem',
              textTransform: 'uppercase',
              padding: '0',
              borderRadius: '0.4rem',
              margin: '0 0',
              borderBottom: '2px solid #424B68',
              width: 'calc(100%)',

              '&:hover': {
                borderRadius: '0.2rem',
                color: '#fff',
                background: '#424B68',
              },
            }}
            clearIndicatorStyles={{
              padding: '2px',
            }}
            inputStyles={{
              fontSize: '1.4rem',
              marginLeft: '0',
              marginBottom: '2rem',
            }}
            valueContainerStyles={{
              border: '0.1rem solid #424B68',
              borderRadius: '0.4rem',
              background: '#303743',
              paddingLeft: '15px',
              height: '5rem',
            }}
            noOptionsMessageStyles={{
              textAlign: 'left',
            }}
            singleValueStyles={{
              color: '#f5f5fb',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              height: '100%',
              padding: '0.5rem 0',
            }}
            placeholderStyles={{
              color: '#16253D',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          />
          <div style={{ position: 'relative', marginTop: '1.5rem' }}>
            <Input
              style={{}}
              id={'address'}
              type={'text'}
              placeholder={`${selectedCoin.label} Address`}
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
              if (selectedCoin.label === '') {
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

              const result = await addContactCoinMutation({
                variables: {
                  publicKey,
                  password,
                  symbol: selectedCoin.label,
                  address,
                  contactPublicKey,
                },
              })

              await getUserAddressbookQueryRefetch()

              notify({
                type:
                  result.data.addContactCoin.status === 'ERR'
                    ? 'error'
                    : 'success',
                message: result.data.addContactCoin.message,
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
              'Add coin'
            )}
          </BtnCustom>
        </div>
      </StyledDialogContent>
    </DialogWrapper>
  )
}

export default compose(
  graphql(addContactCoin, { name: 'addContactCoinMutation' })
)(NewCoinPopup)
