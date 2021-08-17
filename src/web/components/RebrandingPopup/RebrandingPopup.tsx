import React from 'react'
import styled from 'styled-components'

import { compose } from 'recompose'
import { withTheme } from '@material-ui/core'

import { Dialog, Paper, Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import MainLogo from '@icons/Aldrin.svg'
import AustronautHelmet from '@icons/austronautHelmet.png'

const DialogWrapper = styled(({ ...props }) => <Dialog {...props} />)`
  border-radius: 100px;
`

const WhiteText = styled.span`
  font-family: Avenir Next;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  letter-spacing: 0.01rem;
  color: #f8faff;
`

const Title = styled(({ ...props }) => <span {...props} />)`
  font-family: Avenir Next Bold;
  line-height: 4rem;
  letter-spacing: 0.01rem;
  color: #f8faff;
  text-transform: none;
  font-size: 2.5rem;
`

const PaperForRebrandingPopup = styled(Paper)`
  border-radius: 2rem;
  height: auto;
  background: #222429;
  border: 0.1rem solid #3a475c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
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
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <Row width={'70%'} direction={'column'} padding={'0 2rem 0 0'}>
        <RowContainer margin={'0 0 3rem 0'} justify={'flex-start'}>
          <Title style={{ fontFamily: 'Avenir Next Bold', fontSize: '2.4rem' }}>
            Cryptocurrencies.Ai is Aldrin now!
          </Title>
        </RowContainer>
        <RowContainer direction={'column'} align={'flex-start'}>
          <WhiteText theme={theme} style={{ color: theme.palette.white.text, marginBottom: '2rem' }}>
            We are happy to announce that we have rebranded CCAI and are ready to present – Aldrin!
          </WhiteText>
          <WhiteText theme={theme} style={{ color: theme.palette.white.text, marginBottom: '2rem' }}>
            The CCAI token has also been renamed to RIN. CCAI tokens in your wallets are automatically changed to RIN.
          </WhiteText>
          <WhiteText theme={theme} style={{ color: theme.palette.white.text, marginBottom: '2rem' }}>
            The new name comes with exciting developments for future holders of tokens and traders like you, so make sure to follow us on twitter as we announce these new features.
          </WhiteText>
          <WhiteText
            style={{
              color: theme.palette.white.text,
              fontFamily: 'Avenir Next Demi',
            }}
          >
            Respectfully, the Aldrin team.
          </WhiteText>
        </RowContainer>

        <RowContainer margin={'4rem 0 0 0'} justify="center">
          <BlueButton
            btnWidth={'100%'}
            disabled={false}
            theme={theme}
            onClick={onClose}
            textTransform={'none'}
          >
            Got it, congrats to you guys!
          </BlueButton>
        </RowContainer>
      </Row>
      <Row
        width={'30%'}
        direction={'column'}
        justify={'space-between'}
        padding={'0 0 0 3rem'}
      >
        <img style={{ width: '100%' }} src={MainLogo} />
        <img style={{ width: '100%' }} src={AustronautHelmet} />
      </Row>
    </DialogWrapper>
  )
}

const RebrandingPopupWithTheme = compose(withTheme())(RebrandingPopup)

export { RebrandingPopupWithTheme as RebrandingPopup }
