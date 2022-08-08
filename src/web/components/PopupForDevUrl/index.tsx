import { Theme } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { withTheme } from '@material-ui/styles'
import React from 'react'
import { compose } from 'recompose'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { BoldHeader } from '@sb/compositions/Pools/components/Popups/index.styles'

import Warning from '@icons/newWarning.svg'

import { InlineText } from '../Typography'

const StyledPaper = styled(({ ...props }) => <Paper {...props} />)`
  height: auto;
  padding: 2rem 4rem;
  width: 55rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: ${(props) => props.theme.colors.white5};
  border-radius: 0.8rem;
`

const DevUrlPopup = ({
  theme,
  open,
  close,
}: {
  theme: Theme
  open: boolean
  close: () => void
}) => {
  document.addEventListener('keydown', function (event) {
    if (event.code === 'KeyB' && (event.ctrlKey || event.metaKey)) {
      close()
    }
  })

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={() => {}}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <Row justify="space-between" width="100%">
        <BoldHeader>Warning!</BoldHeader>
        <SvgIcon width="4rem" height="4rem" src={Warning} onClick={close} />
      </Row>
      <RowContainer margin="3rem 0" align="start" direction="column">
        <BoldHeader style={{ textAlign: 'left', marginBottom: '6rem' }}>
          Hello, this page is for developers only.
        </BoldHeader>
        <InlineText size="md">
          To avoid loss of funds or confusing situations, please leave it. You
          probably wanted to get to
          <a
            style={{
              padding: '0 0 0 0.5rem',
              color: '#53DF11',
              textDecoration: 'none',
            }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://dex.aldrin.com/"
          >
            dex.aldrin.com
          </a>
          .
        </InlineText>
      </RowContainer>
      <RowContainer justify="space-between" margin="3rem 0 2rem 0">
        <a
          style={{ textDecoration: 'none', width: '100%' }}
          target="_blank"
          rel="noopener noreferrer"
          href="https://dex.aldrin.com/"
        >
          {' '}
          <BlueButton
            style={{
              width: '100%',
              fontFamily: 'Avenir Next Medium',
              textTransform: 'none',
            }}
            isUserConfident
            onClick={() => {}}
          >
            Go to dex.aldrin.com
          </BlueButton>
        </a>
      </RowContainer>
    </DialogWrapper>
  )
}

export default compose(withTheme())(DevUrlPopup)
