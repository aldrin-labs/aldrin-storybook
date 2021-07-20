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
import Paper from '@material-ui/core/Paper'
import SunLogo from '@icons/SunLogo.svg'
import { compose } from 'recompose'

const StyledPaper = styled(({ ...props }) => <Paper {...props} />)`
  height: auto;
  padding: 2rem 4rem;
  width: 65rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
`

const WalletMigrationPopup = ({
  theme,
  open,
  close,
}: {
  theme: Theme
  open: boolean
  close: () => void
}) => {
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
        <BoldHeader>CCAI Wallet is SunWallet now!</BoldHeader>
        <SvgIcon width="15rem" height="auto" src={SunLogo} />
      </Row>
      <RowContainer margin={'3rem 0'} align={'start'} direction={'column'}>
        <Text style={{ margin: '1.5rem 0' }}>
          Our wallet has changed its name and moved to a new domain:
          SunWallet.io
        </Text>{' '}
        <Text style={{ margin: '1.5rem 0' }}>
          For old users almost nothing will change, your accounts and seed
          phrases will remain the same. The old domain will redirect to the new
          domain.
        </Text>{' '}
        <Text style={{ margin: '1.5rem 0' }}>
          Stay tuned for more updates! Let’s build the best DeFi experience
          together!
        </Text>
      </RowContainer>
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <BlueButton
          style={{
            width: '48%',
            fontFamily: 'Avenir Next Medium',
            textTransform: 'none',
          }}
          isUserConfident={true}
          theme={theme}
          onClick={() => {
            close()
            localStorage.setItem('isWalletMigrationToNewUrlPopupDone', 'true')
          }}
        >
          Got it!{' '}
        </BlueButton>
        <a
          style={{ textDecoration: 'none', width: '48%' }}
          target="_blank"
          rel="noopener noreferrer"
          href={''}
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
            Open SunWallet{' '}
          </BlueButton>
        </a>
      </RowContainer>
    </DialogWrapper>
  )
}

export default compose(withTheme())(WalletMigrationPopup)
