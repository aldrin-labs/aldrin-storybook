import * as React from 'react'

import { Typography, Link } from '@material-ui/core'

import { withFormik } from 'formik'
import Yup from 'yup'

import { toPairs } from 'lodash-es'

import { compose } from 'recompose'

import {
  Wrapper,
  StyledTypography,
  ContentContainer,
  SubHeader,
  StyledBeginButton,
  ButtonContainer,
  ImportContent,
  InputTextField,
  FormContainer,
  HelpContent,
  HelpStepContainer,
} from './styles'

class ImportHelp extends React.Component {
  render() {
    const {
      changePage,
    } = this.props

    return (
      <Wrapper>
        <Typography
          variant="h5"
          color="secondary"
          align="center"
        >
          Import Keys
        </Typography>
        <HelpContent>
          <SubHeader>
            <StyledTypography
                color="inherit"
                align="center"
                variant="h6"
            >
              Follow these instructions to import keys form Binance.
            </StyledTypography>
          </SubHeader>
          <ContentContainer>
          <HelpStepContainer>
          <StyledTypography
                color="inherit"
                align="left"
            >
              1. Log into your account at https://binance.com
            </StyledTypography>
            </HelpStepContainer>
            <HelpStepContainer>
            <StyledTypography
                color="inherit"
                align="left"
            >
              2. Navigate to account setting
            </StyledTypography>
            </HelpStepContainer>
            <HelpStepContainer>
            <StyledTypography
                color="inherit"
                align="left"
            >
              3. Locate to API saction and click 'Enable'
            </StyledTypography>
            </HelpStepContainer>
            <StyledTypography
                color="inherit"
                align="left"
            >
              4. Copy keys
            </StyledTypography>

          </ContentContainer>
          <ButtonContainer>
          <StyledBeginButton onClick={() => changePage('ImportKey')}>
            Back
          </StyledBeginButton>
        </ButtonContainer>
        </HelpContent>
      </Wrapper>
    )
  }
}


export default ImportHelp
