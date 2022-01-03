import React, { useState } from 'react'

import { Text } from '@sb/compositions/Addressbook/index'
import { Theme, withTheme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import CloseIcon from '@icons/closeIcon.svg'
import CoolIcon from '@icons/coolIcon.svg'

import { Line } from '@sb/compositions/Pools/components/Popups/index.styles'
import { encode } from '@sb/dexUtils/utils'

import { notify } from '@sb/dexUtils/notifications'
import useMobileSize from '@webhooks/useMobileSize'
import { SRadio } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import {
  StyledPaperMediumWidth,
  SubmitButton,
  Title
} from "@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles";
import { WhiteButton } from '@sb/compositions/Chart/components/TokenNotAdded'
import {FeeInfo, RedButton} from "@sb/compositions/Twamm/components/StopOrderPopup/StopOrderPopup.styles";
import {stripByAmount} from "@core/utils/chartPageUtils";

const Popup = ({
  theme,
  onClose,
  open,
  onStop,
  cancellingFee,
  hasRinForFee
}: {
  theme: Theme
  onClose: () => void
  open: boolean,
  onStop: () => void,
  cancellingFee: number,
  hasRinForFee: boolean
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
      theme={theme}
      PaperComponent={StyledPaperMediumWidth}
      fullScreen={false}
      onClose={onClose}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer
        style={{ marginBottom: '3.5rem' }}
        justify={isMobile ? 'center' : 'space-between'}
      >
        <Title>
          Stop order
        </Title>
        <SvgIcon
          onClick={() => onClose()}
          src={CloseIcon}
          style={{ cursor: 'pointer', display: isMobile ? 'none' : 'auto' }}
          width={'2rem'}
          height={'2rem'}
        />
      </RowContainer>
      <RowContainer
        style={{ marginBottom: '3rem' }}
        justify={isMobile ? 'center' : 'space-between'}
      >
        <Text>
          A fee of 0.0005% of the order amount is charged for stopping the order. The fee is charged in RIN tokens.
        </Text>
      </RowContainer>
      <RowContainer
        style={{ marginBottom: '3rem' }}
        justify={isMobile ? 'center' : 'space-between'}
      >
        <FeeInfo>
          <Text>
            Stopping fee
          </Text>
          <Text fontFamily="Avenir Next Demi" color="#45AC14" fontSize="1.3rem">
            {stripByAmount(cancellingFee)} RIN
          </Text>
        </FeeInfo>
      </RowContainer>

      {!hasRinForFee && <RowContainer
        style={{ marginBottom: '3rem' }}
        justify={isMobile ? 'center' : 'space-between'}
      >
        <FeeInfo>
          <Text>
            Insufficient RIN balance to stop the order.
          </Text>
        </FeeInfo>
      </RowContainer> }
      <RowContainer justify="space-between">
        <WhiteButton
          style={{
            width: '48%',
          }}
          theme={theme}
          onClick={onClose}
        >
          Cancel
        </WhiteButton>
        <RedButton
          disabled={!hasRinForFee}
          width="48%"
          theme={theme}
          fontSize="1.2rem"
          onClick={onStop}
        >
          Stop Order
        </RedButton>
      </RowContainer>
    </DialogWrapper>
  )
}

export const StopOrderPopup = withTheme()(Popup)
