import React, { useState } from 'react'
import styled from 'styled-components'
import copy from 'clipboard-copy'

import { Text } from '@sb/compositions/Addressbook/index'
import { Paper, Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { MainTitle } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import CloseIcon from '@icons/closeIcon.svg'
import CoolIcon from '@icons/coolIcon.svg'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import { Loading } from '@sb/components'
import { Line } from '@sb/compositions/Pools/components/Popups/index.styles'
import { notify } from '@sb/dexUtils/notifications'
import { encode } from '@sb/dexUtils/utils'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 60rem;
  height: auto;
  background: #222429;
  border: 0.1rem solid #3a475c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;
`
const Title = styled(({ ...props }) => <MainTitle {...props} />)`
  text-transform: none;
  font-size: 2.5rem;
  margin-bottom: 0;
`
export const BlueButton = styled(
  ({ isUserConfident, showLoader, children, ...props }) => (
    <BtnCustom {...props}>
      {showLoader ? (
        <Loading
          color={'#fff'}
          size={24}
          style={{ display: 'flex', alignItems: 'center', height: '4.5rem' }}
        />
      ) : (
        children
      )}
    </BtnCustom>
  )
)`
  font-size: 1.4rem;
  height: 4.5rem;
  text-transform: capitalize;
  background-color: ${(props) => props.theme.palette.blue.serum};
  border-radius: 1rem;
  border-color: none;
  cursor: pointer;
  color: #f8faff;
  border: none;
`
const TextField = styled.input`
  width: 100%;
  height: 3.5rem;
  background: #383b45;
  border: 1px solid #3a475c;
  border-radius: 0.5rem;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.4rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  outline: none;
  margin-top: 1rem;

  &:focus {
    border: ${(props) => `0.1rem solid ${props.theme.palette.blue.serum}`};
  }
`
const Form = styled.form`
  width: 100%;
`
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
    tokenNameField: '',
    rightCategoryField: '',
    wrongCategoryField: '',
  })

  const setData = ({ fieldName, value }) => {
    return setFeedbackData({ ...feedbackData, [fieldName]: value })
  }

  const handleSubmit = (e, feedbackData) => {
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'marketsCategoriesFeedback',
        ...feedbackData,
      }),
    })
      .then(() => console.log('Success!'))
      .catch((error) => console.log(error))

    e.preventDefault()
  }

  const isButtonDisabled =
    feedbackData.tokenNameField === '' ||
    feedbackData.rightCategoryField === '' ||
    feedbackData.wrongCategoryField === ''

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
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
              submitFeedback(true)
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
                theme={theme}
                placeholder={'Input token name'}
                value={feedbackData.tokenNameField}
                onChange={(e) =>
                  setData({
                    fieldName: 'tokenNameField',
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
                theme={theme}
                placeholder={'Input token name'}
                value={feedbackData.wrongCategoryField}
                onChange={(e) =>
                  setData({
                    fieldName: 'wrongCategoryField',
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
                theme={theme}
                placeholder={'Input token name'}
                value={feedbackData.rightCategoryField}
                onChange={(e) =>
                  setData({
                    fieldName: 'rightCategoryField',
                    value: e.target.value,
                  })
                }
              />
            </RowContainer>
          </RowContainer>
          <RowContainer>
            <BlueButton
              style={{ width: '100%', margin: '3rem 0' }}
              disabled={isButtonDisabled}
              theme={theme}
              type="submit"
              onClick={(e) => {
                submitFeedback(true)
              }}
            >
              Submit
            </BlueButton>
          </RowContainer>
        </Form>
      )}
    </DialogWrapper>
  )
}
