import React, { useState } from 'react'
import styled from 'styled-components'

import { Paper, Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import {
  MainTitle,
  WhiteText,
  WhiteButton,
} from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import Warning from '@icons/newWarning.svg'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { Row } from '../Inputs/PreferencesSelect/index.styles'
import { Loading } from '@sb/components'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 60rem;
  height: auto;
  background: #222429;
  border: 0.1rem solid #3a475c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;
`
const Title = styled(({ ...props }) => <MainTitle {...props} />)`
  text-transform: none;
  font-size: 2.5rem;
  margin-bottom: 0;
`
export const BlueButton = styled(
  ({ isUserConfident, showLoader, children, ...props }) => (
    <BtnCustom {...props}>
      {showLoader ? (
        <Loading
          color={'#fff'}
          size={24}
          style={{ display: 'flex', alignItems: 'center', height: '4.5rem' }}
        />
      ) : (
        children
      )}
    </BtnCustom>
  )
)`
  font-size: 1.4rem;
  height: 4.5rem;
  text-transform: capitalize;
  background-color: ${(props: { isUserConfident: boolean; theme: Theme }) =>
    props.isUserConfident
      ? props.theme.palette.blue.serum
      : props.theme.palette.grey.title};
  border-radius: 1rem;
  border-color: none;
  cursor: pointer;
  color: ${(props: { isUserConfident: boolean }) =>
    props.isUserConfident ? '#f8faff' : '#fff'};
  border: none;
`

export const WarningPopup = ({
  theme,
  onClose,
  open,
  isPoolsPage = false,
  isSwapPage = false,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
  isPoolsPage?: boolean
  isSwapPage?: boolean
}) => {
  const [isUserConfident, userConfident] = useState(false)
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
        <Title>Warning!</Title>
        <SvgIcon src={Warning} width={'10%'} height={'auto'} />
      </RowContainer>
      <RowContainer direction={'column'} style={{ marginBottom: '2rem' }}>
        {isSwapPage ? (
          <>
            <WhiteText theme={theme}>
              Anyone can create a token on Solana, it may be fake version of
              existing tokens, or token, that claim to represent projects that
              don't have a token.
            </WhiteText>
            <WhiteText style={{ marginTop: '2rem' }} theme={theme}>
              Always check the quoted price and that the pool has sufficient
              liquidity before trading.
            </WhiteText>
          </>
        ) : isPoolsPage ? (
          <WhiteText theme={theme}>
            On Cryptocurrencies.Ai DEX anyone can create their own market and
            pool for this market. This pool is one of those unofficial custom
            pools. Use at your own risk.
          </WhiteText>
        ) : (
          <WhiteText theme={theme}>
            On Cryptocurrencies.Ai DEX anyone can create their own market and
            pool for this market. This pool is one of those unofficial custom
            pools. Use at your own risk.
          </WhiteText>
        )}
      </RowContainer>
      <RowContainer justify="space-between" style={{ marginBottom: '2rem' }}>
        <Row width={'calc(45%)'} justify="flex-start" margin="2rem 0 0 0">
          <SCheckbox
            id={'warning_checkbox'}
            style={{ padding: 0, marginRight: '1rem' }}
            onChange={() => {
              userConfident(!isUserConfident)
            }}
            checked={isUserConfident}
          />
          <label htmlFor={'warning_checkbox'}>
            <WhiteText
              style={{
                cursor: 'pointer',
                color: '#F2ABB1',
                fontSize: '1.12rem',
                fontFamily: 'Avenir Next Medium',
                whiteSpace: 'nowrap',
                letterSpacing: '0.01rem',
              }}
            >
              {isSwapPage
                ? 'I am aware of the risks'
                : 'I am confident in the reliability of this market.'}
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
