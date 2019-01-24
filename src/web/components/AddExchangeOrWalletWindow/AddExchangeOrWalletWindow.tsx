import React from 'react'
import { Link } from 'react-router-dom'

import { IProps } from './AddExchangeOrWalletWindow.types'
import {
  SAddIcon,
  SButton,
  STypographyButtonText,
  STypography,
  PTextBox,
  PTWrapper,
} from '@storybook/styles/walletWindows.styles'

const MyLinkToUserSettings = (props: object) => <Link to="/user" {...props} />

export default class AddExchangeOrWalletWindow extends React.Component<IProps> {
  render() {
    const { theme } = this.props

    return (
      <PTWrapper>
        <PTextBox backgroundColor={theme.palette.background.default}>
          <STypography color="default" variant="h4">
            Add an exchange or wallet
          </STypography>
          <SButton
            component={MyLinkToUserSettings}
            backgroundColor={theme.palette.background.default}
            borderColor={theme.palette.secondary.light}
          >
            <STypographyButtonText> Add </STypographyButtonText>
            <SAddIcon />
          </SButton>
        </PTextBox>
      </PTWrapper>
    )
  }
}
