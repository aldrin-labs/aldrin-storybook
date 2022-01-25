import { Theme } from '@material-ui/core'
import React, { useState } from 'react'
import NumberFormat from 'react-number-format'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Cell } from '@sb/components/Layout'
import SvgIcon from '@sb/components/SvgIcon'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { LIQUIDITY_RATIO } from '@sb/compositions/BorrowLending/config'
import {
  BlueButton,
  StyledPaper,
  Title,
} from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles'
import { removeTrailingZeros } from '@sb/dexUtils/borrow-lending/U192-converting'

import CloseIcon from '@icons/closeIcon.svg'

import { Reserve } from '../../../../dexUtils/borrow-lending/types'
import {
  ButtonCategory,
  TitleBlock,
  SupplyCard,
  BlockSupply,
  AmountCard,
  MaxAmount,
} from '../../Supply/components/ActionsPopup.styles'

const ActionsPopup = ({
  theme,
  onClose,
  open,
  reserve,
  reserveObligationCollateral,
  token,
  tokenPrice,
  walletBalance,
  tokenDecimals,
  depositAmount,
  collateralDeposit,
  collateralWorth,
  reserveBorrowedLiquidity,
  reserveAvailableLiquidity,
  mintedCollateralTotal,
  liquidationThreshold,
  remainingBorrow,
  calcCollateralWorth,
  borrowApy,
  borrowedAmount,
  borrowedAmountWorth,
  riskFactor,
  unhealthyBorrowValue,
  handleBorrowObligationLiquidity,
  handleRepayObligationLiquidity,
  allowToBorrowTokens,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
  reserve: Reserve
  reserveObligationCollateral: any
  token: string
  tokenPrice: string
  walletBalance: number
  tokenDecimals: number
  depositAmount: number
  collateralDeposit: number
  collateralWorth: number
  allowToBorrowTokens: number
  reserveBorrowedLiquidity: number
  reserveAvailableLiquidity: number
  mintedCollateralTotal: number
  liquidationThreshold: number
  remainingBorrow: number
  calcCollateralWorth: () => void
  borrowApy: number
  borrowedAmount: number
  borrowedAmountWorth: number
  riskFactor: number
  unhealthyBorrowValue: number
  handleBorrowObligationLiquidity: (
    reserve: any,
    amount: number,
    callback: () => void
  ) => void
  handleRepayObligationLiquidity: (
    reserve: any,
    amount: number,
    callback: () => void
  ) => void
}) => {
  const [amount, setAmount] = useState(0)
  const [mode, setMode] = useState(0)

  const handleChange = (values) => {
    let valueToSet = values.floatValue

    if (!mode && +valueToSet > walletBalance) {
      valueToSet = collateralDeposit
    } else if (mode && +valueToSet > +borrowedAmount) {
      valueToSet = +borrowedAmount
    }
    setAmount(valueToSet || 0)
  }

  const handleChangeMode = (modeValue: number) => {
    setMode(modeValue)
    setAmount(0)
  }

  const borrow = () => {
    const callback = () => {
      onClose()
      setAmount(0)
    }

    handleBorrowObligationLiquidity(
      reserve,
      amount * Math.pow(10, tokenDecimals),
      callback
    )
  }

  const repay = () => {
    const callback = () => {
      onClose()
      setAmount(0)
    }

    handleRepayObligationLiquidity(
      reserve,
      amount * Math.pow(10, tokenDecimals),
      callback
    )
  }

  const ballanceAfterBorrow = removeTrailingZeros(
    (+walletBalance + amount).toFixed(tokenDecimals)
  )
  const ballanceAfterRepay = removeTrailingZeros(
    (+walletBalance - amount).toFixed(tokenDecimals)
  )

  const collateralWorthAfterBorrow =
    collateralWorth -
    calcCollateralWorth(
      amount,
      reserveBorrowedLiquidity,
      reserveAvailableLiquidity,
      mintedCollateralTotal,
      tokenPrice
    )
  const collateralWorthAfterRepay =
    collateralWorth +
    calcCollateralWorth(
      amount,
      reserveBorrowedLiquidity,
      reserveAvailableLiquidity,
      mintedCollateralTotal,
      tokenPrice
    )

  const borrowedAmountAfterBorrow =
    borrowedAmount * Math.pow(10, tokenDecimals) +
    amount * Math.pow(10, tokenDecimals)
  const borrowedWorthAfterBorrow =
    (borrowedAmountAfterBorrow * tokenPrice) / Math.pow(10, tokenDecimals)

  const borrowedAmountAfterRepay =
    borrowedAmount * Math.pow(10, tokenDecimals) -
    amount * Math.pow(10, tokenDecimals)
  const borrowedWorthAfterRepay =
    (borrowedAmountAfterRepay * tokenPrice) / Math.pow(10, tokenDecimals)
  console.log(
    'borrowedAmountAfterBorrow',
    collateralWorth,
    borrowedAmount,
    borrowedAmountAfterBorrow,
    tokenPrice,
    borrowedWorthAfterBorrow,
    unhealthyBorrowValue
  )

  const remainingBorrowAfterBorrow =
    (reserve.config.loanToValueRatio.percent / 100) *
    (collateralWorthAfterBorrow - borrowedWorthAfterBorrow)
  const remainingBorrowAfterRepay =
    (reserve.config.loanToValueRatio.percent / 100) *
    (collateralWorthAfterRepay - borrowedWorthAfterRepay)

  const riskFactorAfterBorrow =
    (borrowedWorthAfterBorrow / unhealthyBorrowValue) * 100
  const riskFactorAfterRepay =
    (borrowedWorthAfterRepay / unhealthyBorrowValue) * 100

  let MAX_VAL = 0
  if (mode) {
    MAX_VAL = parseFloat(borrowedAmount).toFixed(tokenDecimals)
  } else {
    MAX_VAL = parseFloat(
      (collateralDeposit / LIQUIDITY_RATIO - borrowedAmount).toFixed(
        tokenDecimals
      )
    )
  }
  const withValueLimit = ({ floatValue }) => floatValue <= MAX_VAL

  const activeStyle = { borderTopColor: 'green', color: 'green' }

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      PaperProps={{ width: '110rem', height: '80rem' }}
      maxWidth="lg"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer
        style={{ marginBottom: '1rem' }}
        justify="space-between"
        align="flex-start"
      >
        <Title>{token}</Title>
        <SvgIcon
          onClick={() => onClose()}
          src={CloseIcon}
          style={{ cursor: 'pointer' }}
          width="2rem"
          height="2rem"
        />
      </RowContainer>

      {/* <RowContainer> */}
      {/*    <button onClick={() => handleDepositLiq(reserve, 10)}>Deposit liquidity</button> */}
      {/*    <button disabled={reserveObligationCollateral?.collateral.inner.depositedAmount.toString()} onClick={() => handleWithdrawLiquidity(reserve, 600)}>Withdraw liquidity</button> */}
      {/*    <button disabled={ typeof reserveObligationCollateral?.collateral.inner.depositedAmount === 'undefined' ? true : false} onClick={() => handleWithdrawCollateral(reserve, 10)}>Withdraw collateral</button> */}
      {/* </RowContainer> */}
      <RowContainer>
        <ButtonCategory
          onClick={() => handleChangeMode(0)}
          style={mode === 0 ? activeStyle : {}}
        >
          Borrow
        </ButtonCategory>
        <ButtonCategory
          onClick={() => handleChangeMode(1)}
          style={mode ? activeStyle : {}}
        >
          Repay
        </ButtonCategory>
      </RowContainer>

      <RowContainer>
        <Cell col={12} colLg={10}>
          <SupplyCard>
            <RowContainer>
              <Cell col={12} colLg={3}>
                <BlockSupply>
                  <TitleBlock>Mark Price</TitleBlock>${tokenPrice}
                </BlockSupply>
              </Cell>
              <Cell col={12} colLg={3}>
                <BlockSupply>
                  <TitleBlock>Borrow APY</TitleBlock>
                  {borrowApy % 1 !== 0 ? borrowApy.toFixed(2) : borrowApy}%
                </BlockSupply>
              </Cell>
              <Cell col={12} colLg={3}>
                <BlockSupply>
                  <TitleBlock>Borrow Fees</TitleBlock>
                  {(parseInt(reserve.config.fees.borrowFee.toString()) /
                    Math.pow(10, 18)) *
                    100}
                  %
                </BlockSupply>
              </Cell>
              <Cell col={12} colLg={3}>
                <BlockSupply>
                  <TitleBlock>Liquidation LTV</TitleBlock>
                  {liquidationThreshold}%
                </BlockSupply>
              </Cell>
            </RowContainer>
          </SupplyCard>
        </Cell>
      </RowContainer>

      <RowContainer>
        <Cell col={12} colLg={6} style={{ padding: '15px' }}>
          <SupplyCard>
            <RowContainer>
              <Cell col={6}>
                <BlockSupply>
                  <TitleBlock>Wallet Balance</TitleBlock>
                  {walletBalance}{' '}
                  <a
                    href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                    target="_blank"
                    style={{ display: 'block' }}
                    rel="noreferrer"
                  >
                    Token name
                  </a>
                </BlockSupply>
                <BlockSupply>
                  <TitleBlock>Deposited Amount</TitleBlock>
                  {depositAmount}{' '}
                  <a
                    href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                    target="_blank"
                    style={{ display: 'block' }}
                    rel="noreferrer"
                  >
                    Token name
                  </a>
                </BlockSupply>
                <BlockSupply>
                  <TitleBlock>Risk Factor</TitleBlock>
                  {removeTrailingZeros(parseFloat(riskFactor).toFixed(2))}%
                </BlockSupply>
                <BlockSupply>
                  <TitleBlock>Remaining Borrow</TitleBlock>
                  <NumberFormat
                    value={remainingBorrow}
                    displayType="text"
                    decimalScale={2}
                    fixedDecimalScale
                    thousandSeparator
                    prefix="$"
                  />
                </BlockSupply>
              </Cell>
              <Cell col={6}>
                <BlockSupply>
                  <TitleBlock>Wallet Balance</TitleBlock>
                  {mode
                    ? ballanceAfterRepay < 0
                      ? 0
                      : ballanceAfterRepay
                    : ballanceAfterBorrow < 0
                    ? 0
                    : ballanceAfterBorrow}
                  <a
                    href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                    target="_blank"
                    style={{ display: 'block' }}
                    rel="noreferrer"
                  >
                    Token name
                  </a>
                </BlockSupply>
                <BlockSupply>
                  <TitleBlock>Deposited Amount</TitleBlock>
                  {depositAmount}{' '}
                  <a
                    href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                    target="_blank"
                    style={{ display: 'block' }}
                    rel="noreferrer"
                  >
                    Token name
                  </a>
                </BlockSupply>
                <BlockSupply>
                  <TitleBlock>Risk Factor</TitleBlock>
                  {mode
                    ? removeTrailingZeros(riskFactorAfterRepay.toFixed(2))
                    : removeTrailingZeros(riskFactorAfterBorrow.toFixed(2))}
                  %
                </BlockSupply>
                <BlockSupply>
                  <TitleBlock>Remaining Borrow</TitleBlock>
                  {mode ? (
                    <NumberFormat
                      value={remainingBorrowAfterRepay}
                      displayType="text"
                      decimalScale={2}
                      fixedDecimalScale
                      thousandSeparator
                      prefix="$"
                    />
                  ) : (
                    <NumberFormat
                      value={remainingBorrowAfterBorrow}
                      displayType="text"
                      decimalScale={2}
                      fixedDecimalScale
                      thousandSeparator
                      prefix="$"
                    />
                  )}
                </BlockSupply>
              </Cell>
            </RowContainer>
          </SupplyCard>
        </Cell>

        <Cell col={12} colLg={6} style={{ padding: '15px' }}>
          <SupplyCard>
            <BlockSupply>
              {mode ? (
                <TitleBlock>How much would you like to repay?</TitleBlock>
              ) : (
                <TitleBlock>How much would you like to borrow?</TitleBlock>
              )}
              <AmountCard>
                <RowContainer>
                  <Cell col={6}>
                    <TitleBlock>Amount</TitleBlock>
                    <NumberFormat
                      value={amount}
                      onValueChange={(values) => handleChange(values)}
                    />
                  </Cell>
                  <Cell col={6}>
                    <a
                      href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                      target="_blank"
                      style={{ display: 'block' }}
                      rel="noreferrer"
                    >
                      Token name
                    </a>
                  </Cell>
                </RowContainer>
              </AmountCard>
              <div style={{ textAlign: 'left', marginTop: '0.3rem' }}>
                {mode ? (
                  <MaxAmount>
                    Max Amount:{' '}
                    {parseFloat(borrowedAmount).toFixed(tokenDecimals)}
                  </MaxAmount>
                ) : (
                  <MaxAmount>
                    Max Amount:
                    {removeTrailingZeros(
                      allowToBorrowTokens.toFixed(tokenDecimals)
                    )}
                  </MaxAmount>
                )}
              </div>
              {/* <CustomSlider */}
              {/*    value={amount} */}
              {/*    min={0} */}
              {/*    max={100} */}
              {/*    step={10} */}
              {/*    onChange={handleChange} */}
              {/* /> */}
              {mode ? (
                <BlueButton
                  theme={theme}
                  btnWidth="calc(50% - 1rem)"
                  style={{ alignSelf: 'center', marginTop: '2rem' }}
                  disabled={amount === 0 || borrowedAmount === 0}
                  onClick={() => repay()}
                >
                  Confirm
                </BlueButton>
              ) : (
                <>
                  <BlueButton
                    theme={theme}
                    width="calc(50% - .5rem)"
                    style={{ alignSelf: 'center', marginTop: '2rem' }}
                    disabled={amount === 0}
                    onClick={() => borrow()}
                  >
                    Confirm
                  </BlueButton>
                </>
              )}
            </BlockSupply>
          </SupplyCard>
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

export default ActionsPopup
