import { Paper } from '@material-ui/core'
import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components/index'
import {
  CoinOption,
  CoinSingleValue,
} from '@sb/components/ReactSelectComponents/CoinOption'
import SelectCoinList from '@sb/components/SelectCoinList/SelectCoinList'
import {
  StyledDialogContent,
  StyledDialogTitle,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { PasteButton } from '@sb/compositions/Addressbook/components/Popups/NewContactPopup'
import {
  createHash,
  Input,
  encrypt,
  decrypt,
} from '@sb/compositions/Addressbook/index'
import { notify } from '@sb/dexUtils/notifications'

import { editContactCoin } from '@core/graphql/mutations/chart/editContactCoin'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 55rem;
`

const EditContactCoinPopup = ({
  theme,
  open,
  data,
  handleClose,
  contactPublicKey,
  publicKey,
  localPassword,
  editContactCoinMutation,
  getUserAddressbookQueryRefetch,
}) => {
  const [address, updateAddress] = useState(
    decrypt(data.address, localPassword)
  )
  const [showLoader, updateShowLoader] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState({
    label: decrypt(data.symbol, localPassword),
    value: decrypt(data.symbol, localPassword),
  })

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      style={{ width: '85rem', margin: 'auto' }}
      fullScreen={false}
      onClose={handleClose}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <StyledDialogTitle
        disableTypography
        theme={theme}
        style={{
          justifyContent: 'center',
          background: theme.palette.grey.input,
          borderBottom: `.1rem solid ${theme.palette.text.white}`,
        }}
      >
        <span
          style={{
            fontSize: '1.8rem',
            color: theme.palette.text.light,
            fontFamily: 'Avenir Next Demi',
          }}
        >
          Edit coin
        </span>
      </StyledDialogTitle>
      <StyledDialogContent
        style={{ background: theme.palette.grey.input }}
        theme={theme}
        id="share-dialog-content"
      >
        <div style={{ paddingTop: '2.5rem', textAlign: 'center' }}>
          <SelectCoinList
            theme={theme}
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
            isSearchable
            components={{
              Option: CoinOption,
              SingleValue: CoinSingleValue,
            }}
            menuPortalTarget={document.body}
            menuPortalStyles={{
              zIndex: 11111,
            }}
            // menuIsOpen={true}
            // isOpen={true}
            value={selectedCoin}
            needAdditionalFiltering
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
              borderRadius: '0',
              textAlign: 'center',
              background: '#303743',
              position: 'relative',
              boxShadow: '-1px 3px 22px -16px rgba(127,139,148,1)',
              border: `0.1rem solid ${theme.palette.text.white}`,
            }}
            menuListStyles={{
              height: '20rem',
              background: theme.palette.grey.input,
            }}
            optionStyles={{
              color: theme.palette.text.light,
              outline: 'none',
              height: '4rem',
              background: theme.palette.grey.input,
              fontSize: '1.4rem',
              textTransform: 'uppercase',
              padding: '0',
              // borderRadius: '0.4rem',
              margin: '0 0',
              border: `0.1rem solid ${theme.palette.text.white}`,
              width: 'calc(100%)',

              // '&:hover': {
              //   borderRadius: '0.2rem',
              //   color: '#fff',
              //   background: '#424B68',
              // },
            }}
            clearIndicatorStyles={{
              padding: '2px',
            }}
            inputStyles={{
              fontSize: '1.4rem',
              marginLeft: '0',
              marginBottom: '2rem',
              height: '100%',
              '& > div': {
                height: '100%',
              },
              '& > div > input': {
                height: '100%',
              },
            }}
            valueContainerStyles={{
              border: `0.1rem solid ${theme.palette.text.white}`,
              borderRadius: '0.4rem',
              background: theme.palette.grey.input,
              paddingLeft: '15px',
              height: '5rem',
            }}
            noOptionsMessageStyles={{
              textAlign: 'left',
            }}
            singleValueStyles={{
              color: theme.palette.dark.main,
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
              theme={theme}
              style={{
                background: theme.palette.grey.input,
                color: theme.palette.text.light,
                border: `0.1rem solid ${theme.palette.text.white}`,
                outline: 'none',
                paddingRight: '10rem',
              }}
              id="address"
              type="text"
              placeholder={`${selectedCoin.label} Address`}
              value={address}
              onChange={(e) => updateAddress(e.target.value)}
            />
            <PasteButton
              theme={theme}
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
            theme={theme}
            disabled={showLoader}
            needMinWidth={false}
            btnWidth="20rem"
            height="4.5rem"
            fontSize="1.4rem"
            padding="1rem 2rem"
            borderRadius=".8rem"
            borderColor={theme.palette.blue.serum}
            btnColor="#fff"
            backgroundColor={theme.palette.blue.serum}
            textTransform="none"
            margin="1rem 0 0 0"
            transition="all .4s ease-out"
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
                  message: `${selectedCoin.label} address field should not be empty`,
                })

                return
              }

              await updateShowLoader(true)

              // encrypt each field
              const result = await editContactCoinMutation({
                variables: {
                  publicKey: createHash(publicKey, localPassword),
                  symbol: encrypt(selectedCoin.label, localPassword),
                  address: encrypt(address, localPassword),
                  contactPublicKey,
                  prevCoinAddress: data.address,
                },
              })

              await getUserAddressbookQueryRefetch()

              notify({
                type:
                  result.data.editContactCoin.status === 'ERR'
                    ? 'error'
                    : 'success',
                message: result.data.editContactCoin.message,
              })

              await updateShowLoader(false)
              await updateAddress('')
              await setSelectedCoin({ label: 'BTC', value: 'BTC' })
              await handleClose()
            }}
          >
            {showLoader ? (
              <Loading
                color="#fff"
                size={16}
                height="16px"
                style={{ height: '16px' }}
              />
            ) : (
              'Update coin'
            )}
          </BtnCustom>
        </div>
      </StyledDialogContent>
    </DialogWrapper>
  )
}

export default compose(
  graphql(editContactCoin, { name: 'editContactCoinMutation' })
)(EditContactCoinPopup)
