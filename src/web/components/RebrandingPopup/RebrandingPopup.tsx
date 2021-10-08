import React from 'react'
import styled from 'styled-components'

import { Theme, withTheme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import {
  Title,
  StyledPaper,
  BlueButton,
} from '@sb/compositions/Chart/components/WarningPopup'
import MainLogo from '@icons/Aldrin.svg'
import AustronautHelmet from '@icons/austronautHelmet.png'
import { compose } from 'recompose'

const PaperForRebrandingPopup = styled(StyledPaper)`
  padding: 4rem;
  width: 80rem;
  flex-direction: row;
  align-items: stretch;
`

const RebrandingPopup = ({
  theme,
  onClose,
  open,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
}) => {
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={PaperForRebrandingPopup}
      fullScreen={false}
      onClose={onClose}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <Row width="70%" direction="column" padding="0 2rem 0 0">
        <RowContainer margin="0 0 3rem 0" justify="flex-start">
          <Title style={{ fontFamily: 'Avenir Next Bold', fontSize: '2.4rem' }}>
            Cryptocurrencies.Ai is Aldrin now!
          </Title>
        </RowContainer>
        <RowContainer direction="column" align="flex-start">
          <WhiteText theme={theme} style={{ color: theme.palette.white.text }}>
            We are happy to announce that we have rebranded after a long and
            painstaking work and are ready to present you our new name – Aldrin!
          </WhiteText>
          <WhiteText
            style={{ marginTop: '5rem', color: theme.palette.white.text }}
          >
            The CCAI token has also been renamed. It is now called RIN. You
            don't need to exchange anything, CCAI tokens in your wallets are
            automatically changed to RIN.
          </WhiteText>
          <WhiteText
            style={{
              marginTop: '5rem',
              color: theme.palette.white.text,
              fontFamily: 'Avenir Next Demi',
            }}
          >
            Respectfully, the Aldrin team.
          </WhiteText>
        </RowContainer>

        <RowContainer margin="4rem 0 0 0" justify="center">
          <BlueButton
            btnWidth="100%"
            disabled={false}
            theme={theme}
            onClick={onClose}
            textTransform="none"
          >
            Got it, congrats to you guys!
          </BlueButton>
        </RowContainer>
      </Row>
      <Row
        width="30%"
        direction="column"
        justify="space-between"
        padding="0 0 0 3rem"
      >
        <img style={{ width: '100%' }} src={MainLogo} />
        <img style={{ width: '100%' }} src={AustronautHelmet} />
      </Row>
    </DialogWrapper>
  )
}

const RebrandingPopupWithTheme = compose(withTheme())(RebrandingPopup)

export { RebrandingPopupWithTheme as RebrandingPopup }
