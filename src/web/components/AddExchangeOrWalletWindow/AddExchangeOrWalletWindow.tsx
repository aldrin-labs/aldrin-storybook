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
  Wrapper,
} from '@sb/styles/walletWindows.styles'

const MyLinkToUserSettings = (props: object) => (
  <Link to="/profile" {...props} />
)

export default class AddExchangeOrWalletWindow extends React.Component<IProps> {
  render() {
    const { theme, toggleWallets } = this.props

    return (
      <PTWrapper>
        <PTextBox
          backgroundColor={theme.palette.background.default}
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <Wrapper style={{ borderRight: '2px solid #e0e5ec' }}>
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
          </Wrapper>
          <Wrapper>
            <STypography color="default" variant="h4">
              Or select another portfolio
            </STypography>
            <SButton
              backgroundColor={theme.palette.background.default}
              borderColor={theme.palette.secondary.light}
              onClick={toggleWallets}
            >
              <STypographyButtonText> Select </STypographyButtonText>
              <SAddIcon />
            </SButton>
          </Wrapper>
        </PTextBox>
      </PTWrapper>
    )
  }
}
