import { Theme } from '@material-ui/core'
import React from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Cell } from '@sb/components/Layout'
import SvgIcon from '@sb/components/SvgIcon'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'


import {
    BlueButton,
    StyledPaper,
    Title,
} from "@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles";

import {toNumberWithDecimals} from "@sb/dexUtils/borrow-lending/U192-converting";
import CloseIcon from '@icons/closeIcon.svg'
import {
  DescriptionBlock,
  TextBlock,
  TitleBlock,
} from './BalancesPopup.styles'

const BalancesPopup = ({
  theme,
  onClose,
  open,
  walletBalance,
  depositApy,
  borrowApy,
  depositAmountUI,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
  walletBalance: number
  depositApy: number
  borrowApy: number
  depositAmountUI: number
}) => {
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      PaperProps={{ width: '90rem', height: '70rem' }}
      maxWidth="lg"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer
        style={{ marginBottom: '1rem' }}
        justify="space-between"
        align="flex-start"
      >
        <Title>Reserve Status & Configuration</Title>
        <SvgIcon
          onClick={() => onClose()}
          src={CloseIcon}
          style={{ cursor: 'pointer' }}
          width="2rem"
          height="2rem"
        />
      </RowContainer>
      <RowContainer>
        <Cell col={12} colLg={3}>
          <TextBlock>
            <TitleBlock>Wallet Balance</TitleBlock>
            <DescriptionBlock>{walletBalance}</DescriptionBlock>
          </TextBlock>
        </Cell>
        <Cell col={12} colLg={3}>
          <TextBlock>
            <TitleBlock>Deposit APY</TitleBlock>
            <DescriptionBlock>{depositApy.toFixed(2)}%</DescriptionBlock>
          </TextBlock>
        </Cell>
        <Cell col={12} colLg={6}>
          <TextBlock>
            <TitleBlock>Deposited Amount</TitleBlock>
            <DescriptionBlock>{depositAmountUI}</DescriptionBlock>
          </TextBlock>
        </Cell>
      </RowContainer>

      <RowContainer justify="flex-start">
        <Cell col={12} colLg={3}>
          <TextBlock>
            <TitleBlock>Remained Borrow</TitleBlock>
            <DescriptionBlock>24242</DescriptionBlock>
          </TextBlock>
        </Cell>
        <Cell col={12} colLg={3}>
          <TextBlock>
            <TitleBlock>Borrow APY</TitleBlock>
            <DescriptionBlock>{borrowApy.toFixed(2)}%</DescriptionBlock>
          </TextBlock>
        </Cell>
        <Cell col={12} colLg={6}>
          <TextBlock>
            <TitleBlock>Borrowed Amount</TitleBlock>
            <DescriptionBlock>24242</DescriptionBlock>
          </TextBlock>
        </Cell>
      </RowContainer>

      <RowContainer justify="flex-start">
        <Cell col={12} colLg={3}>
          <TextBlock>
            <TitleBlock>Port in Wallet</TitleBlock>
            <DescriptionBlock>24242</DescriptionBlock>
          </TextBlock>
        </Cell>
        <Cell col={12} colLg={3}>
          <TextBlock>
            <TitleBlock>Reward APY</TitleBlock>
            <DescriptionBlock>24242</DescriptionBlock>
          </TextBlock>
        </Cell>
        <Cell col={12} colLg={6}>
          <TextBlock>
            <TitleBlock>Claimable Reward</TitleBlock>
            <DescriptionBlock>24242</DescriptionBlock>
          </TextBlock>
        </Cell>
      </RowContainer>

      <RowContainer width="90%" justify="flex-end" margin="2rem 0 0 0">
        <BlueButton theme={theme} width="calc(50% - .5rem)" onClick={onClose}>
          OK
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}

export default BalancesPopup
