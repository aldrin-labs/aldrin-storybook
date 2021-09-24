import React, { useState } from 'react'

import { Text } from '@sb/compositions/Addressbook/index'
import { Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import CloseIcon from '@icons/closeIcon.svg'
import CoolIcon from '@icons/coolIcon.svg'

import { Line } from '@sb/compositions/Pools/components/Popups/index.styles'
import { encode } from '@sb/dexUtils/utils'
import {
  BlueButton,
  Form,
  StyledPaperMediumWidth,
  SubmitButton,
  TextField,
  Title,
} from './SelectWrapperStyles'
import { notify } from '@sb/dexUtils/notifications'

export const MarketsFeedbackPopup = ({
  theme,
  onClose,
  open,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
}) => {
  const [isFeedbackSubmitted, submitFeedback] = useState(false)

  const [feedbackData, setFeedbackData] = useState({
    token: '',
    rightCategory: '',
    wrongCategory: '',
  })

  const setData = ({ fieldName, value }) => {
    return setFeedbackData({ ...feedbackData, [fieldName]: value })
  }

  const handleSubmit = (e) => {
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'marketsCategoriesFeedback',
        ...feedbackData,
      }),
    })
      .then(() => {
        submitFeedback(true)
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

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaperMediumWidth}
      fullScreen={false}
      onClose={onClose}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '2rem' }} justify={'space-between'}>
        <Title>
          {isFeedbackSubmitted
            ? 'Feedback Submitted'
            : 'Is there a catalog mistake?'}
        </Title>
        <SvgIcon
          onClick={() => onClose()}
          src={CloseIcon}
          width={'2rem'}
          height={'2rem'}
        />
      </RowContainer>
      {isFeedbackSubmitted ? (
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
            Thank you for your feedback, we will review it shortly and take
            action.
          </Text>
          <BlueButton
            style={{ width: '100%', margin: '6rem 0 0 0' }}
            disabled={false}
            theme={theme}
            onClick={() => {
              submitFeedback(false)
              onClose()
            }}
          >
            Ok
          </BlueButton>
        </RowContainer>
      ) : (
        <Form
          onSubmit={handleSubmit}
          name="marketsCategoriesFeedback"
          data-netlify="true"
          method={'post'}
          action="/success"
        >
          <input
            type="hidden"
            name="form-name"
            value="marketsCategoriesFeedback"
          />
          <RowContainer margin={'1rem 0'}>
            <RowContainer wrap="nowrap">
              <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
                Token
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <TextField
                type="text"
                name="token"
                id="token"
                autoComplete="off"
                theme={theme}
                placeholder={'Input token name'}
                value={feedbackData.token}
                onChange={(e) =>
                  setData({
                    fieldName: 'token',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </RowContainer>
          <RowContainer margin={'1rem 0'}>
            <RowContainer wrap="nowrap">
              <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
                Stored in category
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <TextField
                type="text"
                name="wrongCategory"
                id="wrongCategory"
                autoComplete="off"
                theme={theme}
                placeholder={'Input category name'}
                value={feedbackData.wrongCategory}
                onChange={(e) =>
                  setData({
                    fieldName: 'wrongCategory',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </RowContainer>
          <RowContainer margin={'1rem 0'}>
            <RowContainer wrap="nowrap">
              <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
                But should be in
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <TextField
                type="text"
                name="rightCategory"
                id="rightCategory"
                autoComplete="off"
                theme={theme}
                placeholder={'Input category name'}
                value={feedbackData.rightCategory}
                onChange={(e) =>
                  setData({
                    fieldName: 'rightCategory',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </RowContainer>
          <RowContainer>
            <SubmitButton theme={theme} type="submit">
              Submit
            </SubmitButton>
          </RowContainer>
        </Form>
      )}
    </DialogWrapper>
  )
}
