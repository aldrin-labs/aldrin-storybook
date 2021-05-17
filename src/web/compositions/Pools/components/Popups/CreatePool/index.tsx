import React, { useState } from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Paper } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, Line } from '../index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { InputWithSelector } from '../components'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { SelectCoinPopup } from '../SelectCoin'

const StyledPaper = styled(Paper)`
  height: auto;
  padding: 2rem;
  width: 55rem;
  box-shadow: 0px 0px 0.8rem 0px rgba(0, 0, 0, 0.45);
  background: #222429;
  border-radius: 0.8rem;
`

export const CreatePoolPopup = ({ theme, open, close }) => {
  const [isSelectCoinPopupOpen, openSelectCoinPopup] = useState(false)
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
      <RowContainer justify={'space-between'}>
        <BoldHeader>Create Pool</BoldHeader>
        <SvgIcon
          style={{ cursor: 'pointer' }}
          onClick={() => close()}
          src={Close}
        />
      </RowContainer>
      <RowContainer margin={'2rem 0'} justify={'space-between'}>
        <Text color={'#93A0B2'}>Market Price:</Text>
        <Text
          fontSize={'2rem'}
          color={'#A5E898'}
          fontFamily={'Avenir Next Demi'}
        >
          1 CCAI = 20 USDT
        </Text>
      </RowContainer>
      <RowContainer>
        <InputWithSelector
          openSelectCoinPopup={() => openSelectCoinPopup(true)}
        />
        <Row>
          <Text fontSize={'4rem'} fontFamily={'Avenir Next Medium'}>
            +
          </Text>
        </Row>
        <InputWithSelector
          openSelectCoinPopup={() => openSelectCoinPopup(true)}
        />
      </RowContainer>{' '}
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Row
          width={'55%'}
          justify="space-between"
          style={{ flexWrap: 'nowrap' }}
        >
          <SCheckbox
            id={'warning_checkbox'}
            style={{ padding: 0, marginRight: '1rem' }}
            onChange={() => {}}
            checked={true}
          />
          <label htmlFor={'warning_checkbox'}>
            {' '}
            <WhiteText
              style={{
                cursor: 'pointer',
                color: '#F2ABB1',
                fontSize: '1.12rem',
                fontFamily: 'Avenir Next Medium',
                letterSpacing: '0.01rem',
              }}
            >
              I understand the risks of providing liquidity, and that I could
              lose money to impermanent loss.{' '}
            </WhiteText>
          </label>
        </Row>
        <BlueButton
          style={{ width: '36%', fontFamily: 'Avenir Next Medium' }}
          disabled={false}
          isUserConfident={true}
          theme={theme}
          onClick={() => {}}
        >
          Add liquidity{' '}
        </BlueButton>
      </RowContainer>{' '}
      <SelectCoinPopup
        theme={theme}
        open={isSelectCoinPopupOpen}
        close={() => openSelectCoinPopup(false)}
      />
    </DialogWrapper>
  )
}
