import React, { useState } from 'react'

import { Text } from '@sb/compositions/Addressbook/index'
import { Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import CloseIcon from '@icons/closeIcon.svg'
import CoolIcon from '@icons/coolIcon.svg'

import { Line } from '@sb/compositions/Pools/components/Popups/index.styles'
import { encode } from '@sb/dexUtils/utils'
import {
  BlueButton,
  Form,
  StyledPaper,
  SubmitButton,
  TextField,
  Title,
  StyledTextArea,
  StyledLabel,
} from '../Inputs/SelectWrapper/SelectWrapperStyles'
import { notify } from '@sb/dexUtils/notifications'
import { SRadio } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

export const ListingRequestPopup = ({
  theme,
  onClose,
  open,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
}) => {
  const [isRequestSubmitted, submitRequest] = useState(false)

  const [requestData, setRequestData] = useState({
    tokenName: '',
    teamName: '',
    aboutProject: '',
    marketID: '',
    contact: '',
  })

  const setData = ({ fieldName, value }) => {
    return setRequestData({ ...requestData, [fieldName]: value })
  }

  const handleSubmit = (e) => {
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'listingRequest',
        ...requestData,
      }),
    })
      .then(() => {
        submitRequest(true)
        console.log('Success!')
      })
      .catch((error) => {
        console.log(error)
        notify({
          type: 'error',
          message: 'Something went wrong, please try again.',
        })
      })

    e.preventDefault()
  }

  const isDisabled =
    requestData.tokenName === '' ||
    requestData.teamName === '' ||
    requestData.aboutProject === '' ||
    requestData.marketID === '' ||
    requestData.contact === ''

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      onEnter={() => {
        submitRequest(false)
        setRequestData({
          tokenName: '',
          teamName: '',
          aboutProject: '',
          marketID: '',
          contact: '',
        })
      }}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '1rem' }} justify={'space-between'}>
        <Title>
          {isRequestSubmitted ? 'Request Submitted!' : 'Request Listing'}
        </Title>
        <SvgIcon
          onClick={() => onClose()}
          src={CloseIcon}
          style={{ cursor: 'pointer' }}
          width={'2rem'}
          height={'2rem'}
        />
      </RowContainer>
      {isRequestSubmitted ? (
        <RowContainer direction={'column'}>
          <SvgIcon
            src={CoolIcon}
            width={'9rem'}
            height={'10rem'}
            style={{ marginTop: '6rem' }}
          />
          <Text
            padding={'0 1rem 0 0'}
            style={{
              width: '50%',
              marginTop: '2rem',
              textAlign: 'center',
              whiteSpace: 'normal',
            }}
          >
            Thank you for your request, we will review it shortly and take
            action.
          </Text>
          <BlueButton
            style={{ width: '100%', margin: '6rem 0 0 0' }}
            disabled={false}
            theme={theme}
            onClick={() => {
              submitRequest(false)
              onClose()
            }}
          >
            Ok
          </BlueButton>
        </RowContainer>
      ) : (
        <Form
          onSubmit={handleSubmit}
          name="listingRequest"
          data-netlify="true"
          method={'post'}
          action="/success"
        >
          <input type="hidden" name="form-name" value="listingRequest" />
          <RowContainer margin={'1rem 0'}>
            <RowContainer wrap="nowrap">
              <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
                Token Name{' '}
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <TextField
                height={'5rem'}
                type="text"
                name="tokenName"
                id="tokenName"
                autoComplete="off"
                theme={theme}
                placeholder={'e.g. RIN'}
                value={requestData.tokenName}
                onChange={(e) =>
                  setData({
                    fieldName: 'tokenName',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </RowContainer>
          <RowContainer margin={'1rem 0'}>
            <RowContainer wrap="nowrap">
              <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
                Who is the team or is it anonymous?
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <TextField
                height="5rem"
                type="text"
                name="teamName"
                id="teamName"
                autoComplete="off"
                theme={theme}
                placeholder={'Paste links or describe in a few words'}
                value={requestData.teamName}
                onChange={(e) =>
                  setData({
                    fieldName: 'teamName',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </RowContainer>
          <RowContainer margin={'1rem 0'}>
            <RowContainer wrap="nowrap">
              <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
                What is the project about?{' '}
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <StyledTextArea
                height="9rem"
                type="text"
                name="aboutProject"
                id="aboutProject"
                autoComplete="off"
                theme={theme}
                placeholder={'Short project description'}
                value={requestData.aboutProject}
                onChange={(e) =>
                  setData({
                    fieldName: 'aboutProject',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </RowContainer>{' '}
          <RowContainer margin={'1rem 0'}>
            <RowContainer wrap="nowrap">
              <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
                Market ID{' '}
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <TextField
                height="5rem"
                type="text"
                name="marketID"
                id="marketID"
                autoComplete="off"
                theme={theme}
                placeholder={
                  'e.g. 7gZNLDbWE73ueAoHuAeFoSu7JqmorwCLpNTBXHtYSFTa'
                }
                value={requestData.marketID}
                onChange={(e) =>
                  setData({
                    fieldName: 'marketID',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </RowContainer>{' '}
          <RowContainer margin={'1rem 0 0 0'}>
            <RowContainer wrap="nowrap">
              <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
                How to contact the team{' '}
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <TextField
                height="5rem"
                type="text"
                name="contact"
                id="contact"
                autoComplete="off"
                theme={theme}
                placeholder={'e.g. contact@aldrin.com'}
                value={requestData.contact}
                onChange={(e) =>
                  setData({
                    fieldName: 'contact',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </RowContainer>
          <RowContainer>
            <SubmitButton
              isDisabled={isDisabled}
              disabled={isDisabled}
              theme={theme}
              type="submit"
            >
              Submit
            </SubmitButton>
          </RowContainer>
        </Form>
      )}
    </DialogWrapper>
  )
}
