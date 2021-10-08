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
import { notify } from '@sb/dexUtils/notifications'
import useMobileSize from '@webhooks/useMobileSize'
import { SRadio } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import {
  BlueButton,
  Form,
  SubmitButton,
  TextField,
  Title,
  StyledTextArea,
  StyledRowContainer,
  StyledLabel,
  StyledPaperMediumWidth,
} from '../Inputs/SelectWrapper/SelectWrapperStyles'
import { WhiteButton } from './TokenNotAdded'

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
  const isMobile = useMobileSize()
  const [feedbackData, setFeedbackData] = useState({
    messagge: '',
    contact: '',
  })

  const [isProblemReport, setIsProblemReport] = useState(true)
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

  const isDisabled = isProblemReport
    ? feedbackData.messagge === '' || feedbackData.contact === ''
    : feedbackData.messagge === ''

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaperMediumWidth}
      fullScreen={false}
      onClose={onClose}
      onEnter={() => {
        submitFeedback(false)
        setFeedbackData({
          messagge: '',
          contact: '',
        })
      }}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer
        style={{ marginBottom: '2rem' }}
        justify={isMobile ? 'center' : 'space-between'}
      >
        <Title>
          {isFeedbackSubmitted
            ? 'Feedback Submitted'
            : 'We value your feedback!'}
        </Title>
        <SvgIcon
          onClick={() => onClose()}
          src={CloseIcon}
          style={{ cursor: 'pointer', display: isMobile ? 'none' : 'auto' }}
          width="2rem"
          height="2rem"
        />
      </RowContainer>
      {isFeedbackSubmitted ? (
        <RowContainer
          direction="column"
          justify={isMobile ? 'space-around' : 'center'}
        >
          <SvgIcon
            src={CoolIcon}
            width={isMobile ? '17rem' : '9rem'}
            height={isMobile ? '19rem' : '10rem'}
            style={{ marginTop: isMobile ? '15rem' : '6rem' }}
          />
          <Text
            padding="0 1rem 0 0"
            style={{
              width: '50%',
              marginTop: isMobile ? '6rem' : '2rem',
              textAlign: 'center',
              whiteSpace: 'normal',
              fontSize: isMobile ? '2rem' : '1.5rem',
            }}
          >
            {isProblemReport
              ? 'Thank you for your feedback, please allow support team 24 hours to respond.'
              : 'Thank you for your feedback, we will review it shortly and take action.'}
          </Text>
          <BlueButton
            isMobile={isMobile}
            style={{
              width: '100%',
              margin: isMobile ? '15rem 0 0 0' : '6rem 0 0 0',
            }}
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
          method="post"
          action="/success"
        >
          <input type="hidden" name="form-name" value="usersFeedback" />
          <RowContainer>
            <Row justify="flex-start" width="50%">
              <SRadio
                checked={isProblemReport}
                onChange={() => {
                  setIsProblemReport(true)
                }}
                id="problem-report-btn"
                style={{ padding: '1rem 1rem 1rem 0' }}
              />
              <StyledLabel htmlFor="problem-report-btn">
                I want to report a problem.
              </StyledLabel>
            </Row>
            <Row justify="flex-end" width="50%">
              <SRadio
                checked={!isProblemReport}
                onChange={() => {
                  setIsProblemReport(false)
                }}
                id="idea-suggest-btn"
                style={{ padding: '1rem 1rem 1rem 0' }}
              />
              <StyledLabel htmlFor="idea-suggest-btn">
                I want to suggest an idea.
              </StyledLabel>
            </Row>
          </RowContainer>

          <StyledRowContainer margin="1rem 0">
            <RowContainer wrap="nowrap">
              <Text padding="0 1rem 0 0" whiteSpace="nowrap">
                {isProblemReport
                  ? 'Tell us your problem'
                  : 'Tell us how we can improve'}
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify="space-between">
              <StyledTextArea
                height="20rem"
                type="text"
                name="messagge"
                id="messagge"
                autoComplete="off"
                theme={theme}
                placeholder="Message"
                value={feedbackData.messagge}
                onChange={(e) =>
                  setData({
                    fieldName: 'messagge',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </StyledRowContainer>
          <RowContainer margin="1rem 0">
            <RowContainer wrap="nowrap">
              <Text padding="0 1rem 0 0" whiteSpace="nowrap">
                {isProblemReport
                  ? 'How we can contact you to help?'
                  : 'Would you like a representative to contact you? (optional)'}{' '}
              </Text>
              <Line />
            </RowContainer>
            <RowContainer justify="space-between">
              <TextField
                type="text"
                name="contact"
                id="contact"
                autoComplete="off"
                theme={theme}
                placeholder="Specify a way to contact you"
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
          <RowContainer justify="space-between">
            {isMobile ? (
              <WhiteButton
                style={{
                  width: '48%',
                  height: '9.5rem',
                  marginTop: '4rem',
                  fontSize: '2.3rem',
                }}
                theme={theme}
                onClick={onClose}
              >
                Cancel
              </WhiteButton>
            ) : null}
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
