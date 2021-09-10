import React from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader } from '@sb/compositions/Pools/components/Popups/index.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { withTheme } from '@material-ui/styles'

import { Text } from '@sb/compositions/Addressbook/index'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import Warning from '@icons/newWarning.svg'
import Paper from '@material-ui/core/Paper'
import { compose } from 'recompose'

const StyledPaper = styled(({ ...props }) => <Paper {...props} />)`
  height: auto;
  padding: 2rem 4rem;
  width: 55rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
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
  document.addEventListener('keydown', function(event) {
    if (event.code == 'KeyB' && (event.ctrlKey || event.metaKey)) {
      close()
    }
  })

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={() => {}}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <Row justify={'space-between'} width={'100%'}>
        <BoldHeader>Warning!</BoldHeader>
        <SvgIcon width="4rem" height="4rem" src={Warning} onClick={close} />
      </Row>
      <RowContainer margin={'3rem 0'} align={'start'} direction={'column'}>
        <BoldHeader style={{ textAlign: 'left', marginBottom: '6rem' }}>
          Hello, this page is for developers only.
        </BoldHeader>
        <Text>
          To avoid loss of funds or cunfusing situations, please leave it. You
          probably wanted to get to
          <a
            style={{
              padding: '0 0 0 0.5rem',
              color: '#A5E898',
              textDecoration: 'none',
            }}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://dex.aldrin.com/'}
          >
            dex.aldrin.com
          </a>
          .
        </Text>
      </RowContainer>
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <a
          style={{ textDecoration: 'none', width: '100%' }}
          target="_blank"
          rel="noopener noreferrer"
          href={'https://dex.aldrin.com/'}
        >
          {' '}
          <BlueButton
            style={{
              width: '100%',
              fontFamily: 'Avenir Next Medium',
              textTransform: 'none',
            }}
            isUserConfident={true}
            theme={theme}
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
