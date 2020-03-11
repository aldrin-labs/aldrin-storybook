import React from 'react'
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'

import { Checkbox } from '@material-ui/core'

import {
  InputContainer,
  SmallGrayText,
  TextLinkSpan,
  SubmitLoginButton,
  FormContainer,
  DialogTitleText,
} from '@sb/compositions/Login/Login.styles'

export default ({
  open,
  onClose,
  confirmHandler,
  isAgreeWithRules,
  toggleAgreementCheckbox,
  toggleTermsOfUse,
  togglePrivacyPolicy,
  showTermsOfUse,
  showPrivacyPolicy,
}: {
  open: boolean
  onClose: () => void
  confirmHandler: () => any
  isAgreeWithRules: boolean
  toggleAgreementCheckbox: () => void
  toggleTermsOfUse: (toggledState: boolean) => void
  togglePrivacyPolicy: (toggledState: boolean) => void
  showTermsOfUse: boolean
  showPrivacyPolicy: boolean
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    scroll={'paper'}
    aria-labelledby="scroll-dialog-title"
  >
    <DialogTitle disableTypography={true} id="scroll-dialog-title">
      <DialogTitleText>Review the Terms to sign up</DialogTitleText>
    </DialogTitle>
    <DialogContent>
      <FormContainer
        action=""
        onSubmit={(e: React.ChangeEvent<HTMLFormElement>) => {
          e.preventDefault()
          confirmHandler()
        }}
      >
        <InputContainer container justify="center" alignItems="center">
          <Checkbox
            required
            checked={isAgreeWithRules}
            onChange={() => toggleAgreementCheckbox()}
          />
          <SmallGrayText>
            I agree to cryptocurrencies.ai{' '}
            <TextLinkSpan
              small={true}
              onClick={() => toggleTermsOfUse(!showTermsOfUse)}
            >
              Terms of Use,{' '}
            </TextLinkSpan>
            <TextLinkSpan
              small={true}
              onClick={() => togglePrivacyPolicy(!showPrivacyPolicy)}
            >
              Privacy Policy,{' '}
            </TextLinkSpan>
            and I’m over 18 years old.
          </SmallGrayText>
        </InputContainer>
        <SubmitLoginButton
          padding={'2rem 8rem'}
          variant="contained"
          color="secondary"
          type="submit"
        >
          Continue to sign up
        </SubmitLoginButton>
      </FormContainer>
    </DialogContent>
  </Dialog>
)
