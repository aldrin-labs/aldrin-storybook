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
  StyledPaper,
  SubmitButton,
  TextField,
  Title,
  StyledTextArea,
} from '../Inputs/SelectWrapper/SelectWrapperStyles'
import { notify } from '@sb/dexUtils/notifications'

export const FeedbackPopup = ({
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
    messagge: '',
    contact: '',
  })

  const setData = ({ fieldName, value }) => {
    return setFeedbackData({ ...feedbackData, [fieldName]: value })
  }

  const handleSubmit = (e) => {
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'usersFeedback',
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

  const isDisabled = feedbackData.messagge === ''

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      onEnter={() => {
        submitFeedback(false)
        setFeedbackData({
          messagge: '',
          contact: '',
        })
      }}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '2rem' }} justify={'space-between'}>
        <Title>
          {isFeedbackSubmitted
            ? 'Feedback Submitted'
            : 'We value your feedback!'}
        </Title>
        <SvgIcon
          onClick={() => onClose()}
          src={CloseIcon}
          style={{ cursor: 'pointer' }}
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
          name="usersFeedback"
          data-netlify="true"
          method={'post'}
          action="/success"
        >
          <input type="hidden" name="form-name" value="usersFeedback" />
          <RowContainer margin={'1rem 0'}>
            <RowContainer wrap="nowrap">
              <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
                Tell us how we can improve{' '}
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <StyledTextArea
                height={'20rem'}
                type="text"
                name="messagge"
                id="messagge"
                autoComplete="off"
                theme={theme}
                placeholder={'Message'}
                value={feedbackData.messagge}
                onChange={(e) =>
                  setData({
                    fieldName: 'messagge',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </RowContainer>
          <RowContainer margin={'1rem 0'}>
            <RowContainer wrap="nowrap">
              <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
                Would you like a representative to contact you? (optional){' '}
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <TextField
                type="text"
                name="contact"
                id="contact"
                autoComplete="off"
                theme={theme}
                placeholder={'Specify a way to contact you'}
                value={feedbackData.contact}
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
