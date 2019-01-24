import React from 'react'

import { IProps } from './SelectExchangeOrWalletWindow.types'
import {
  SAddIcon,
  SButton,
  STypographyButtonText,
  STypography,
  PTextBox,
  PTWrapper,
} from '@storybook/styles/walletWindows.styles'

export default class SelectExchangeOrWalletWindow extends React.Component<
  IProps
> {
  render() {
    const { theme, toggleWallets } = this.props

    return (
      <PTWrapper background={theme.palette.background.paper}>
        <PTextBox backgroundColor={theme.palette.background.default}>
          <STypography color="default" variant="h4">
            Select an exchange or wallet
          </STypography>
          <SButton
            backgroundColor={theme.palette.background.default}
            borderColor={theme.palette.secondary.light}
            onClick={toggleWallets}
          >
            <STypographyButtonText> Select </STypographyButtonText>
            <SAddIcon />
          </SButton>
        </PTextBox>
      </PTWrapper>
    )
  }
}
