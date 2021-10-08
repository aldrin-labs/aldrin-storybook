import React from 'react'
import styled from 'styled-components'
import { Paper } from '@material-ui/core'

import { StyledDialogContent } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import Warning from '@icons/newWarning.svg'
import { SvgIcon } from '@sb/components'
import Timer from 'react-compound-timer/build'
import { CCAIListingTime } from '@sb/dexUtils/utils'
import { VioletButton, Text } from './TokenNotAdded'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 60rem;
`

const TradingBlocked = ({ open, onClose, theme }) => {
  const initial = CCAIListingTime * 1000 - Date.now()

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      style={{ width: '85rem', margin: 'auto' }}
      fullScreen={false}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <StyledDialogContent
        style={{
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
          background: theme.palette.grey.input,
        }}
        theme={theme}
        id="share-dialog-content"
      >
        <Row width="70%" direction="column" padding="2rem 0">
          <RowContainer justify="space-between" margin="0 0 6rem 0">
            <Text style={{ fontSize: '2.4rem' }}>Announcement!</Text>
            <SvgIcon height="5rem" width="5rem" src={Warning} />
          </RowContainer>
          <RowContainer
            direction="column"
            align="flex-start"
            justify="flex-start"
          >
            <Text style={{ fontSize: '1.6rem', textAlign: 'left' }}>
              CCAI/USDC trading will start today at 2:00pm UTC.
            </Text>
            <Text
              style={{
                fontFamily: 'Avenir Next',
                fontSize: '1.6rem',
                textAlign: 'left',
                marginTop: '1rem',
              }}
            >
              To start trading refresh page at 2:00pm UTC.
            </Text>
            <Text
              style={{
                fontFamily: 'Avenir Next',
                fontSize: '1.6rem',
                textAlign: 'left',
                marginTop: '1rem',
              }}
            >
              Time left:{' '}
              <span style={{ color: theme.palette.green.main }}>
                <Timer direction="backward" initialTime={initial}>
                  <Timer.Hours formatValue={(v) => (v < 10 ? `0${v}` : v)} />:
                  <Timer.Minutes formatValue={(v) => (v < 10 ? `0${v}` : v)} />:
                  <Timer.Seconds formatValue={(v) => (v < 10 ? `0${v}` : v)} />
                </Timer>
              </span>
            </Text>
          </RowContainer>
          <RowContainer justify="space-between" margin="6rem 0 0rem 0">
            <VioletButton
              theme={theme}
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: '100%' }}
              onClick={() => location.reload(true)}
            >
              Refresh page
            </VioletButton>
          </RowContainer>
        </Row>
      </StyledDialogContent>
    </DialogWrapper>
  )
}

export default TradingBlocked
