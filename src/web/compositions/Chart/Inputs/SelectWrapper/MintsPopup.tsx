import React, { useState } from 'react'
import styled from 'styled-components'
import copy from 'clipboard-copy'

import { Text } from '@sb/compositions/Addressbook/index'
import { Paper, Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { MainTitle } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import CloseIcon from '@icons/closeIcon.svg'
import CopyIcon from '@icons/copyIcon.svg'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import { Loading } from '@sb/components'
import { Line } from '@sb/compositions/Pools/components/Popups/index.styles'
import LinkToSolanaExp from '../../components/LinkToSolanaExp'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'

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
  background-color: ${(props) => props.theme.palette.blue.serum};
  border-radius: 1rem;
  border-color: none;
  cursor: pointer;
  color: #f8faff;
  border: none;
`
const TextField = styled.div`
  width: 85%;
  height: 3.5rem;
  background: #383b45;
  border: 1px solid #3a475c;
  border-radius: 0.5rem;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.4rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

export const MintsPopup = ({
  theme,
  onClose,
  open,
  symbol = 'CCAI/USDC',
  marketAddress,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
  symbol: string
  marketAddress: string
}) => {
  const [base, quote] = symbol.split('/')

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '2rem' }} justify={'space-between'}>
        <Title>{symbol}</Title>
        <SvgIcon
          src={CloseIcon}
          style={{ cursor: 'pointer' }}
          width={'2rem'}
          height={'2rem'}
          onClick={() => onClose()}
        />
      </RowContainer>
      <RowContainer margin={'1rem 0'}>
        <RowContainer wrap="nowrap">
          <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
            Market ID
          </Text>
          <Line />
        </RowContainer>
        <RowContainer justify={'space-between'}>
          <TextField>{marketAddress}</TextField>
          <Row width={'12%'} justify={'space-between'}>
            <LinkToSolanaExp marketAddress={marketAddress} />
            <SvgIcon
              style={{ cursor: 'pointer' }}
              src={CopyIcon}
              width={'2.5rem'}
              height={'2.5rem'}
              onClick={() => {
                copy(marketAddress)
                notify({ type: 'success', message: 'Copied!' })
              }}
            />
          </Row>
        </RowContainer>
      </RowContainer>
      <RowContainer margin={'1rem 0'}>
        <RowContainer wrap="nowrap">
          <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
            {base} Mint
          </Text>
          <Line />
        </RowContainer>
        <RowContainer justify={'space-between'}>
          <TextField>{getTokenMintAddressByName(base)}</TextField>
          <Row width={'12%'} justify={'space-between'}>
            <LinkToSolanaExp marketAddress={getTokenMintAddressByName(base)} />
            <SvgIcon
              style={{ cursor: 'pointer' }}
              src={CopyIcon}
              width={'2.5rem'}
              height={'2.5rem'}
              onClick={() => {
                copy(getTokenMintAddressByName(base))
                notify({ type: 'success', message: 'Copied!' })
              }}
            />
          </Row>
        </RowContainer>
      </RowContainer>
      <RowContainer margin={'1rem 0'}>
        <RowContainer wrap="nowrap">
          <Text padding={'0 1rem 0 0'} whiteSpace="nowrap">
            {quote} Mint
          </Text>
          <Line />
        </RowContainer>
        <RowContainer justify={'space-between'}>
          <TextField>{getTokenMintAddressByName(quote)}</TextField>
          <Row width={'12%'} justify={'space-between'}>
            <LinkToSolanaExp marketAddress={getTokenMintAddressByName(quote)} />
            <SvgIcon
              style={{ cursor: 'pointer' }}
              src={CopyIcon}
              width={'2.5rem'}
              height={'2.5rem'}
              onClick={() => {
                copy(getTokenMintAddressByName(quote))
                notify({ type: 'success', message: 'Copied!' })
              }}
            />
          </Row>
        </RowContainer>
      </RowContainer>
    </DialogWrapper>
  )
}
