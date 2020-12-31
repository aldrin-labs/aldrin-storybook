import React, { useState } from 'react'

import { notify } from '@sb/dexUtils/notifications'
import { confirmValidatorDNS } from '@core/graphql/mutations/chart/confirmValidatorDNS'
import { StyledDialogContent } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import {
  PurpleButton,
  StyledPaper,
  PasteButton,
} from '@sb/compositions/Addressbook/components/Popups/NewCoinPopup'
import { Input, Text } from '@sb/compositions/Addressbook/index'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { RowContainer } from '@sb/compositions/AnalyticsRoute'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import SvgIcon from '@sb/components/SvgIcon'

import blackTwitter from '@icons/blackTwitter.svg'
import lightBird from '@icons/lightBird.svg'
import { TrendingUpRounded } from '@material-ui/icons'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

const TwitterValidatorTweetConfirmPopup = ({
  theme,
  open,
  publicKey,
  handleClose,
  openNextPopup,
  encryptedTweetText,
  confirmValidatorDNSMutation,
}) => {
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
      <StyledDialogContent
        style={{ background: theme.palette.grey.input }}
        theme={theme}
        id="share-dialog-content"
      >
        <div style={{ padding: '3rem 0', textAlign: 'left' }}>
          <RowContainer>
            <Text>
              Your post generated. Share it and paste the tweet link in field
              below.
            </Text>
          </RowContainer>

          <RowContainer>
            <BtnCustom
              theme={theme}
              btnColor={theme.palette.white.main}
              borderColor={theme.palette.purple.main}
              backgroundColor={theme.palette.purple.main}
              hoverBackground={theme.palette.purple.main}
              padding={'1.5rem 0'}
              margin={'1.5rem 0 3rem 0'}
              height={'4.5rem'}
              fontSize={'1.6rem'}
              btnWidth={'70%'}
              textTransform={'none'}
              href={`https://twitter.com/intent/tweet?text=${encryptedTweetText}`}
              rel="noopener noreferrel"
              target={'_blank'}
            >
              <SvgIcon
                src={lightBird}
                width={'2.5rem'}
                height={'2.5rem'}
                style={{ marginRight: '1rem' }}
              />{' '}
              Share
            </BtnCustom>
          </RowContainer>

          <Text>Paste link to your tweet</Text>
          <div style={{ position: 'relative', marginTop: '1.5rem' }}>
            <Input
              style={{
                background: theme.palette.grey.input,
                color: theme.palette.text.light,
                border: `0.1rem solid ${theme.palette.text.white}`,
                outline: 'none',
              }}
              id={'address'}
              type={'text'}
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
          <RowContainer>
            <PurpleButton
              text={'Confirm'}
              showLoader={showLoader}
              width="70%"
              height="4.5rem"
              margin={'1rem 0 0 0'}
              onClick={async () => {
                if (publicKey === '') {
                  notify({
                    message: 'Connect your wallet first',
                    type: 'error',
                  })

                  return
                }

                if (address === '') {
                  notify({
                    type: 'error',
                    message: `Web-server url field should not be empty`,
                  })

                  return
                }

                await updateShowLoader(true)

                const result = await confirmValidatorDNSMutation({
                  variables: {
                    plainTextDNS: address,
                  },
                })

                if (!result.data.confirmValidatorDNS) {
                  notify({
                    type: 'error',
                    message: `Validation of your tweet failed`,
                  })
                }

                await updateShowLoader(false)

                await updateAddress('')
                await openNextPopup()
                await handleClose()
              }}
            />
          </RowContainer>
        </div>
      </StyledDialogContent>
    </DialogWrapper>
  )
}

export default compose(
  graphql(confirmValidatorDNS, { name: 'confirmValidatorDNSMutation' })
)(TwitterValidatorTweetConfirmPopup)
