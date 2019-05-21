import * as React from 'react'
import { Redirect } from 'react-router'

import {
  ConfirmContainer,
  ContentGrid,
  StyledTypography,
  ConfirmText,
  ConfirmTextContainer,
  StyledLaunchButton,
} from './styles'

const Inputs = (props) => {
  if (props.wrongToken) {
    return <Redirect to="/" />
  }
  return (
    <ContentGrid item>
      <ConfirmContainer>
        <StyledTypography variant="h4">
          {props.name},
        </StyledTypography>
        <ConfirmTextContainer>
          <ConfirmText>
            We can't  wait to show you our platform
          </ConfirmText>
        </ConfirmTextContainer>
        <ConfirmTextContainer>
          <ConfirmText>
            You should have received a confirmation email to complete the rgistration process.
          </ConfirmText>
        </ConfirmTextContainer>
        <StyledLaunchButton
          href="/"
          disabled={!props.registred}
        >
          {props.registred ? 'launch': 'loading'}
        </StyledLaunchButton>
      </ConfirmContainer>
    </ContentGrid>
  )
}

export default Inputs
