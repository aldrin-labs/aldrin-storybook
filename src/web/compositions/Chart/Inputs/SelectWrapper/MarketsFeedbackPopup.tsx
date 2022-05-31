import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Line } from '@sb/compositions/Pools/components/Popups/index.styles'
import { notify } from '@sb/dexUtils/notifications'
import { encode } from '@sb/dexUtils/utils'
import { CloseIconContainer } from '@sb/styles/StyledComponents/IconContainers'

import CoolIcon from '@icons/coolIcon.svg'

import {
  BlueButton,
  Form,
  StyledPaperMediumWidth,
  SubmitButton,
  TextField,
  Title,
} from './SelectWrapperStyles'

export const MarketsFeedbackPopup = ({
  onClose,
  open,
}: {
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
      PaperComponent={StyledPaperMediumWidth}
      fullScreen={false}
      onClose={onClose}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '2rem' }} justify="space-between">
        <Title>
          {isFeedbackSubmitted
            ? 'Feedback Submitted'
            : 'Is there a catalog mistake?'}
        </Title>
        <CloseIconContainer
          onClick={() => {
            onClose()
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 18L9.5 9.5M18 1L9.5 9.5M9.5 9.5L18 18L1 1"
              stroke="#F5F5FB"
              strokeWidth="2"
            />
          </svg>
        </CloseIconContainer>
      </RowContainer>
      {isFeedbackSubmitted ? (
        <RowContainer direction="column">
          <SvgIcon
            src={CoolIcon}
            width="9rem"
            height="10rem"
            style={{ marginTop: '6rem' }}
          />
          <Text
            padding="0 1rem 0 0"
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
          method="post"
          action="/success"
        >
          <input
            type="hidden"
            name="form-name"
            value="marketsCategoriesFeedback"
          />
          <RowContainer margin="1rem 0">
            <RowContainer wrap="nowrap">
              <Text fontSize="1.5em" padding="0 1rem 0 0" whiteSpace="nowrap">
                Token
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify="space-between">
              <TextField
                type="text"
                name="token"
                id="token"
                autoComplete="off"
                placeholder="Input token name"
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
          <RowContainer margin="1rem 0">
            <RowContainer wrap="nowrap">
              <Text fontSize="1.5em" padding="0 1rem 0 0" whiteSpace="nowrap">
                Stored in category
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify="space-between">
              <TextField
                type="text"
                name="wrongCategory"
                id="wrongCategory"
                autoComplete="off"
                placeholder="Input category name"
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
          <RowContainer margin="1rem 0">
            <RowContainer wrap="nowrap">
              <Text fontSize="1.5em" padding="0 1rem 0 0" whiteSpace="nowrap">
                But should be in
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify="space-between">
              <TextField
                type="text"
                name="rightCategory"
                id="rightCategory"
                autoComplete="off"
                placeholder="Input category name"
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
            <SubmitButton type="submit">Submit</SubmitButton>
          </RowContainer>
        </Form>
      )}
    </DialogWrapper>
  )
}
