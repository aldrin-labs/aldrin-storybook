import React from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Label } from '@sb/components/Label/Label'
import SvgIcon from '@sb/components/SvgIcon'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  Title,
  StyledPaper,
  BlueButton,
} from '@sb/compositions/Chart/components/WarningPopup'

import CloseIcon from '@icons/closeIcon.svg'

const PaperForMeetRebalancePopup = styled(StyledPaper)`
  width: 50rem;
`

export const MeetRebalancePopup = ({
  onClose,
  open,
}: {
  onClose: () => void
  open: boolean
}) => {
  return (
    <DialogWrapper
      PaperComponent={PaperForMeetRebalancePopup}
      fullScreen={false}
      onClose={onClose}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '3rem' }} justify="space-between">
        <Row>
          <Title>Meet Rebalance </Title>
          <Label style={{ marginLeft: '1.5rem' }} />
        </Row>
        <SvgIcon
          src={CloseIcon}
          width="2rem"
          height="auto"
          style={{ cursor: 'pointer' }}
        />
      </RowContainer>
      <RowContainer direction="column" style={{ marginBottom: '3rem' }}>
        <WhiteText>
          This is a public beta of the Rebalance feature. It may occasionally be
          unstable. Errors found can be reported using the feedback button in
          the upper left corner.
        </WhiteText>
      </RowContainer>
      <RowContainer justify="center">
        <BlueButton disabled={false} onClick={onClose}>
          Got It
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
