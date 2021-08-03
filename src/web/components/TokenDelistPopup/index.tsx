import React, { useState } from 'react'
import dayjs, { utc } from 'dayjs'

import { Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import Warning from '@icons/newWarning.svg'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { StyledPaper, Title, BlueButton } from './styles'

dayjs.extend(utc)

export const TokenDelistPopup = ({
  theme,
  onClose,
  open,
  tokenName,
  delistTimestamp,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
  tokenName: string
  delistTimestamp: number
}) => {
  const [isUserConfident, userConfident] = useState(false)
  const delistTimeToFormat = dayjs.unix(delistTimestamp).utc()

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={isUserConfident ? onClose : () => {}}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '2rem' }} justify={'space-between'}>
        <Title style={{ fontSize: '1.7rem' }}>
          This project is high risk due to suspicious trading activity.
        </Title>
        <SvgIcon src={Warning} width={'10%'} height={'auto'} />
      </RowContainer>
      <RowContainer direction={'column'} style={{ margin: '2rem 0' }}>
        <WhiteText theme={theme}>
          You have 24 hours to close the open orders. The {tokenName} token will
          be delisted on{' '}
          {`${delistTimeToFormat.format(
            'MMMM D'
          )} at ${delistTimeToFormat.format('hh:mm')} UTC.`}
        </WhiteText>
      </RowContainer>
      <RowContainer justify="space-between" margin="2rem 0 2rem 0">
        <Row
          width={'calc(45%)'}
          justify="flex-start"
          style={{ flexWrap: 'nowrap' }}
        >
          <SCheckbox
            id={'delist_warning_checkbox'}
            style={{ padding: 0, marginRight: '1rem' }}
            onChange={() => {
              userConfident(!isUserConfident)
            }}
            checked={isUserConfident}
          />
          <label htmlFor={'delist_warning_checkbox'}>
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
          theme={theme}
          onClick={onClose}
        >
          Ok
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
