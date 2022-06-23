import { Theme } from '@material-ui/core'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import Warning from '@icons/newWarning.svg'

import { StyledPaper, Title, BlueButton } from './styles'

dayjs.extend(utc)
dayjs.extend(duration)

export const TokenDelistPopup = ({
  theme,
  onClose,
  open,
  tokenToDelist,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
  tokenToDelist: {
    name: string
    timestamp: number
  }
}) => {
  const [isUserConfident, userConfident] = useState(false)

  const { name, timestamp } = tokenToDelist || { name: '', timestamp: 0 }
  const delistTimeToFormat = dayjs.unix(timestamp).utc()
  const delistTimeUnix = delistTimeToFormat.unix()

  const now = dayjs().unix()
  const hours = (delistTimeUnix - now) / 3600

  const isExpired = now > delistTimeUnix

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={isUserConfident ? onClose : () => {}}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '2rem' }} justify="space-between">
        <Title style={{ fontSize: '1.7rem' }}>
          This project is high risk due to suspicious trading activity.
        </Title>
        <SvgIcon src={Warning} width="10%" height="auto" />
      </RowContainer>
      <RowContainer direction="column" align="flex-start" margin="2rem 0">
        {isExpired ? (
          <WhiteText theme={theme}>
            The {name} token will be delisted during next few hours.
          </WhiteText>
        ) : (
          <WhiteText theme={theme}>
            You have {hours.toFixed(0)} hours to close the open orders. The{' '}
            {name} token will be delisted on{' '}
            {`${delistTimeToFormat.format(
              'MMMM D'
            )} at ${delistTimeToFormat.format('hh:mm')} UTC.`}
          </WhiteText>
        )}
      </RowContainer>
      <RowContainer justify="space-between" margin="2rem 0 2rem 0">
        <Row
          width="calc(45%)"
          justify="flex-start"
          style={{ flexWrap: 'nowrap' }}
        >
          <SCheckbox
            id="delist_warning_checkbox"
            style={{ padding: 0, marginRight: '1rem' }}
            onChange={() => {
              userConfident(!isUserConfident)
            }}
            checked={isUserConfident}
          />
          <label htmlFor="delist_warning_checkbox">
            <WhiteText
              style={{
                cursor: 'pointer',
                color: '#F2ABB1',
                fontSize: '1.12rem',
                fontFamily: 'Avenir Next Medium',
                letterSpacing: '0.01rem',
              }}
            >
              I read the post above and I'm not going to buy a compromised
              asset.
            </WhiteText>
          </label>
        </Row>
        <BlueButton
          disabled={!isUserConfident}
          isUserConfident={isUserConfident}
          onClick={onClose}
        >
          Ok
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
