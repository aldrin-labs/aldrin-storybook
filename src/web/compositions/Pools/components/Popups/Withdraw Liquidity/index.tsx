import React from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Paper } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, Line } from '../index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { SimpleInput, InputWithTotal } from '../components'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'

const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem;
  width: 55rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
`

export const WithdrawalPopup = ({ theme, open, close }) => {
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <Row justify={'space-between'} width={'100%'}>
        <BoldHeader>Withdraw Liquidity</BoldHeader>
        <SvgIcon
          style={{ cursor: 'pointer' }}
          onClick={() => close()}
          src={Close}
        />
      </Row>
      <RowContainer>
        <SimpleInput />
        <Row>
          <Text fontSize={'4rem'} fontFamily={'Avenir Next Medium'}>
            +
          </Text>
        </Row>
        <SimpleInput />
        <Line />
        <InputWithTotal />
      </RowContainer>
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <BlueButton
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={false}
          isUserConfident={true}
          theme={theme}
          onClick={() => {}}
        >
          Withdraw{' '}
        </BlueButton>
      </RowContainer>{' '}
    </DialogWrapper>
  )
}
