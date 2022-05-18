import { Paper } from '@material-ui/core'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Loading } from '@sb/components'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import {
  MainTitle,
  WhiteText,
} from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import Warning from '@icons/newWarning.svg'

import { Row } from '../Inputs/PreferencesSelect/index.styles'

export const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 60rem;
  height: auto;
  background: ${(props) => props.theme.colors.gray6};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
`

export const Title = styled(({ ...props }) => <MainTitle {...props} />)`
  text-transform: none;
  font-size: 2.5rem;
  margin-bottom: 0;
`

export const BlueButton = styled(
  ({
    disabled,
    showLoader,
    children,
    textTransform = 'capitalize',
    ...props
  }) => (
    <BtnCustom
      disabled={disabled}
      textTransform={textTransform}
      fontFamily="Avenir Next"
      {...props}
    >
      {showLoader ? (
        <Loading
          color="#fff"
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
  border-radius: 1rem;
  border: none;

  background-color: ${(props) =>
    !props.disabled ? props.theme.colors.blue5 : props.theme.colors.disabled};
  color: #fff;
`

export const WarningPopup = ({
  onClose,
  open,
  isPoolsPage = false,
  isSwapPage = false,
}: {
  onClose: () => void
  open: boolean
  isPoolsPage?: boolean
  isSwapPage?: boolean
}) => {
  const [isUserConfident, userConfident] = useState(false)
  return (
    <DialogWrapper
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={isUserConfident ? onClose : () => {}}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '2rem' }} justify="space-between">
        <Title>Warning!</Title>
        <SvgIcon src={Warning} width="6%" height="auto" />
      </RowContainer>
      <RowContainer direction="column" style={{ marginBottom: '2rem' }}>
        {isSwapPage ? (
          <>
            <WhiteText>
              Anyone can create a token on Solana, it may be fake version of
              existing tokens, or token, that claim to represent projects that
              don't have a token.
            </WhiteText>
            <WhiteText style={{ marginTop: '2rem' }}>
              Always check the quoted price and that the pool has sufficient
              liquidity before trading.
            </WhiteText>
          </>
        ) : isPoolsPage ? (
          <WhiteText>
            On Aldrin.com DEX anyone can create their own market and pool for
            this market. This pool is one of those unofficial custom pools. Use
            at your own risk.
          </WhiteText>
        ) : (
          <WhiteText>
            On Aldrin.com DEX anyone can create their own market and pool for
            this market. This pool is one of those unofficial custom pools. Use
            at your own risk.
          </WhiteText>
        )}
      </RowContainer>
      <RowContainer justify="space-between" style={{ marginBottom: '2rem' }}>
        <Row width="calc(45%)" justify="flex-start" margin="2rem 0 0 0">
          <SCheckbox
            id="warning_checkbox"
            style={{ padding: 0, marginRight: '1rem' }}
            onChange={() => {
              userConfident(!isUserConfident)
            }}
            checked={isUserConfident}
          />
          <label htmlFor="warning_checkbox">
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
          onClick={onClose}
        >
          Ok
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
