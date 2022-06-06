import useMobileSize from '@webhooks/useMobileSize'
import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { WhiteButton } from '@sb/compositions/Chart/components/TokenNotAdded'
import {
  StyledPaperMediumWidth,
  Title,
} from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles'
import {
  FeeInfo,
  RedButton,
} from '@sb/compositions/Twamm/components/StopOrderPopup/StopOrderPopup.styles'

import { stripByAmount } from '@core/utils/chartPageUtils'

import CloseIcon from '@icons/closeIcon.svg'

const Popup = ({
  onClose,
  open,
  onStop,
  cancellingFee,
  baseSymbol,
}: {
  onClose: () => void
  open: boolean
  onStop: () => void
  cancellingFee: number
  baseSymbol: string
}) => {
  const isMobile = useMobileSize()
  const [feedbackData, setFeedbackData] = useState({
    messagge: '',
    contact: '',
  })

  const [isProblemReport, setIsProblemReport] = useState(true)

  const isDisabled = isProblemReport
    ? feedbackData.messagge === '' || feedbackData.contact === ''
    : feedbackData.messagge === ''

  return (
    <DialogWrapper
      PaperComponent={StyledPaperMediumWidth}
      fullScreen={false}
      onClose={onClose}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer
        style={{ marginBottom: '3.5rem' }}
        justify={isMobile ? 'center' : 'space-between'}
      >
        <Title>Stop order</Title>
        <SvgIcon
          onClick={() => onClose()}
          src={CloseIcon}
          style={{ cursor: 'pointer', display: isMobile ? 'none' : 'auto' }}
          width="2rem"
          height="2rem"
        />
      </RowContainer>
      <RowContainer
        style={{ marginBottom: '3rem' }}
        justify={isMobile ? 'center' : 'space-between'}
      >
        <Text>
          A fee of 0.0005% of the order amount is charged for stopping the
          order.
        </Text>
      </RowContainer>
      <RowContainer
        style={{ marginBottom: '3rem' }}
        justify={isMobile ? 'center' : 'space-between'}
      >
        <FeeInfo>
          <Text>Stopping fee</Text>
          <Text fontFamily="Avenir Next Demi" color="#45AC14" fontSize="1.3rem">
            {stripByAmount(cancellingFee)} {baseSymbol}
          </Text>
        </FeeInfo>
      </RowContainer>

      {/* {!hasRinForFee && <RowContainer */}
      {/*  style={{ marginBottom: '3rem' }} */}
      {/*  justify={isMobile ? 'center' : 'space-between'} */}
      {/* > */}
      {/*  <FeeInfo> */}
      {/*    <Text> */}
      {/*      Insufficient RIN balance to stop the order. */}
      {/*    </Text> */}
      {/*  </FeeInfo> */}
      {/* </RowContainer> } */}
      <RowContainer justify="space-between">
        <WhiteButton
          style={{
            width: '48%',
          }}
          onClick={onClose}
        >
          Cancel
        </WhiteButton>
        <RedButton width="48%" fontSize="1.2rem" onClick={onStop}>
          Stop Order
        </RedButton>
      </RowContainer>
    </DialogWrapper>
  )
}

export const StopOrderPopup = Popup
