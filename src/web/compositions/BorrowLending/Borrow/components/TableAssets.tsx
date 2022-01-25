import { Theme } from '@material-ui/core'
import BN from 'bn.js'
import React, { useState } from 'react'
import NumberFormat from 'react-number-format'

import ActionsPopup from '@sb/compositions/BorrowLending/Borrow/components/ActionsPopup'
import { LIQUIDITY_RATIO } from '@sb/compositions/BorrowLending/config'
import {
  calculateBorrowApy,
  calculateUtilizationRate,
} from '@sb/compositions/BorrowLending/utils/rates'
import {
  removeTrailingZeros,
  toNumberWithDecimals,
} from '@sb/dexUtils/borrow-lending/U192-converting'

import { Button } from '../../../../components/Button'
import { Obligation, Reserve } from '../../../../dexUtils/borrow-lending/types'
import { TokenInfo } from '../../../../dexUtils/types'
import { Table } from '../../styles'

type TableAssetsProps = {
  theme: Theme
  reserves: Reserve[]
  obligations: Obligation
  walletAccounts: TokenInfo[]
  obligationDetails: Obligation
  calcCollateralWorth: () => void
  unhealthyBorrowValue: number
  handleBorrowObligationLiquidity: (
    reserve: any,
    amount: number,
    callback: () => void
  ) => void
  handleRepayObligationLiquidity: (
    reserve: Reserve,
    amount: number,
    callback: () => void
  ) => void
}

const TableAssets = ({
  theme,
  reserves,
  walletAccounts,
  obligationDetails,
  calcCollateralWorth,
  unhealthyBorrowValue,
  handleBorrowObligationLiquidity,
  handleRepayObligationLiquidity,
}: TableAssetsProps) => {
  const [actionsOpen, setActionsOpen] = useState(false)

  const closeActions = () => {
    setActionsOpen(false)
  }

  const renderRows = () => {
    return reserves.map((reserve, index) => {
      const tokenPrice = toNumberWithDecimals(
        parseInt(reserve.liquidity.marketPrice.toString(), 10),
        5
      )
      let tokenDecimals = 0
      let depositAmount = 0
      let depositWorth = 0
      let walletBalance = 0
      let depositApy = 0
      let walletBalanceWorth = 0

      let reserveObligationBorrow = null
      let borrowApy = 0
      const liquidationThreshold = reserve.config.liquidationThreshold.percent
      let remainingBorrow = 0
      let collateralDeposit = 0

      let reserveBorrowedLiquidity = 0
      let reserveAvailableLiquidity = 0
      let mintedCollateralTotal = 0
      let borrowedAmount = 0
      let borrowedAmountWorth = 0
      let riskFactor = 0

      const remainBorrow = obligationDetails.allowedBorrowValue.sub(
        obligationDetails.borrowedValue
      )

      const allowToBorrowTokens =
        parseInt(remainBorrow.toString(), 10) /
        parseInt(reserve.liquidity.marketPrice.toString(), 10)

      const reserveObligationCollateral = obligationDetails?.reserves.find(
        (reserveObligation) => {
          if (reserveObligation.collateral) {
            return (
              reserve.reserve.toString() ===
              reserveObligation.collateral.inner.depositReserve.toString()
            )
          }
          return false
        }
      )

      const collateralWorthBn = obligationDetails.reserves.reduce(
        (acc, res) => {
          if (res.collateral) {
            return acc.add(res.collateral.inner.marketValue)
          }
          return acc
        },
        new BN(0)
      )

      const collateralWorth =
        parseInt(collateralWorthBn.toString(), 10) / 10 ** 18

      const borrowedAmountWorthBn = obligationDetails.reserves.reduce(
        (acc, res) => {
          if (res.liquidity) {
            return acc.add(res.liquidity.inner.marketValue)
          }
          return acc
        },
        new BN(0)
      )

      const borrowedAmountWorthTotal =
        parseInt(borrowedAmountWorthBn.toString(), 10) / 10 ** 18

      const availableToBorrow = collateralWorth - borrowedAmountWorthTotal

      console.log(
        'availableToBorrow: ',
        collateralWorth,
        borrowedAmountWorthTotal,
        availableToBorrow
      )

      if (walletAccounts && walletAccounts.length > 0) {
        const depositTokenAccount = walletAccounts.find(
          (account) => account.mint === reserve.collateral.mint.toString()
        )
        const tokenAccount = walletAccounts.find(
          (account) => account.mint === reserve.liquidity.mint.toString()
        )
        if (depositTokenAccount) {
          const depositAmountBN = new BN(depositTokenAccount.amount)
          const depositWorthBN =
            reserve.liquidity.marketPrice.mul(depositAmountBN)
          depositAmount = depositTokenAccount.amount
          depositWorth =
            parseInt(depositWorthBN.toString()) /
            Math.pow(10, depositTokenAccount.decimals) /
            LIQUIDITY_RATIO
        }

        if (tokenAccount) {
          tokenDecimals = tokenAccount.decimals
          walletBalance = +tokenAccount.amount
          walletBalanceWorth =
            walletBalance * parseInt(reserve.liquidity.marketPrice.toString())
          const reserveBorrowedAmount = parseInt(
            reserve.liquidity.borrowedAmount.toString()
          )
          const utilizationRate = calculateUtilizationRate(
            reserveBorrowedAmount,
            parseInt(
              reserve.liquidity.borrowedAmount
                .add(reserve.liquidity.availableAmount)
                .toString()
            )
          )

          borrowApy = calculateBorrowApy(
            utilizationRate,
            reserve.config.optimalUtilizationRate.percent / 100,
            reserve.config.optimalBorrowRate.percent / 100,
            reserve.config.minBorrowRate.percent / 100,
            reserve.config.maxBorrowRate.percent / 100
          )
          depositApy = borrowApy * utilizationRate

          reserveBorrowedLiquidity =
            parseInt(reserve.liquidity.borrowedAmount.toString()) /
            Math.pow(10, 18)
          reserveAvailableLiquidity =
            parseInt(reserve.liquidity.availableAmount.toString()) /
            Math.pow(10, tokenDecimals)
          mintedCollateralTotal = parseInt(
            reserve.collateral.mintTotalSupply.toString() /
              Math.pow(10, tokenDecimals)
          )
          // mintedLiquidityTotal = parseInt(reserve.liquidity.mintTotalSupply.toString()/Math.pow(10, tokenDecimals));
          // console.log('mintedLiquidityTotal', mintedLiquidityTotal)

          if (obligationDetails) {
            console.log({
              depositedValue: obligationDetails.depositedValue.toString(),
              borrowedValue: obligationDetails.borrowedValue.toString(),
              allowedBorrowValue:
                obligationDetails.allowedBorrowValue.toString(),
              unhealthyBorrowValue:
                obligationDetails.unhealthyBorrowValue.toString(),
            })
            //
            obligationDetails.reserves.forEach((r) => {
              if (r.collateral) {
                const c = r.collateral.inner
                console.log('col', {
                  depositReserve: c.depositReserve.toString(),
                  depositedAmount: c.depositedAmount.toString(),
                  marketValue: c.marketValue.toString(),
                })
              } else if (r.liquidity) {
                const l = r.liquidity.inner
                console.log('liq', {
                  borrowReserve: l.borrowReserve.toString(),
                  borrowedAmount: l.borrowedAmount.toString(),
                  cumulativeBorrowRate: l.cumulativeBorrowRate.toString(),
                  marketValue: l.marketValue.toString(),
                })
              }
            })

            console.log(
              ' obligationDetails.reserves: ',
              obligationDetails.reserves
            )

            reserveObligationBorrow = obligationDetails.reserves.find(
              (reserveObligation) => {
                if (reserveObligation.liquidity) {
                  console.log(
                    reserve.reserve.toString(),
                    reserveObligation.liquidity.inner.borrowReserve.toString()
                  )
                  return (
                    reserve.reserve.toString() ===
                    reserveObligation.liquidity.inner.borrowReserve.toString()
                  )
                }
                return false
              }
            )

            if (reserveObligationCollateral) {
              collateralDeposit =
                parseInt(
                  reserveObligationCollateral.collateral.inner.depositedAmount.toString()
                ) / Math.pow(10, tokenDecimals)
              // collateralWorth = calcCollateralWorth(collateralDeposit, reserveBorrowedLiquidity, reserveAvailableLiquidity, mintedCollateralTotal, tokenPrice);
            }

            if (reserveObligationBorrow) {
              borrowedAmount =
                parseInt(
                  reserveObligationBorrow.liquidity.inner.borrowedAmount.toString()
                ) / Math.pow(10, 18 + tokenDecimals)
              borrowedAmountWorth =
                parseInt(
                  reserveObligationBorrow.liquidity.inner.marketValue.toString()
                ) / Math.pow(10, 18)
              remainingBorrow =
                (reserve.config.loanToValueRatio.percent / 100) *
                (collateralWorth - borrowedAmountWorth)
              console.log(
                'reserveBorrowedAmount',
                borrowedAmountWorth,
                unhealthyBorrowValue
              )
              riskFactor = (borrowedAmountWorth / unhealthyBorrowValue) * 100
              console.log(riskFactor, 'riskFactor')
              console.log('borrowedAmount', borrowedAmount)
            }
          }
        }
      }

      return (
        <>
          <tr style={{ cursor: 'pointer' }}>
            <td style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <a
                href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                target="_blank"
                style={{ display: 'block' }}
                rel="noreferrer"
              >
                {reserve.liquidity.mint.toString()}
              </a>
              <span>Price: ${tokenPrice}</span>
            </td>
            <td style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <p style={{ margin: 0 }}>
                <strong>{allowToBorrowTokens}</strong>
              </p>
              <span>
                <NumberFormat
                  value={parseInt(remainBorrow.toString(), 10) / 10 ** 18}
                  displayType="text"
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator
                  prefix="$"
                />
              </span>
            </td>
            <td style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <Button
                onClick={() => setActionsOpen(index)}
                style={{ margin: 0 }}
              >
                <strong>
                  {removeTrailingZeros(borrowedAmount.toFixed(2))}
                </strong>

                <div>
                  <NumberFormat
                    value={borrowedAmountWorth}
                    displayType="text"
                    decimalScale={2}
                    fixedDecimalScale
                    thousandSeparator
                    prefix="$"
                  />
                </div>
              </Button>
            </td>
            <td style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <p style={{ margin: 0 }}>
                <strong>{borrowApy.toFixed(2)}%</strong>
              </p>
            </td>
          </tr>
          {walletAccounts && walletAccounts.length > 0 && (
            <ActionsPopup
              theme={theme}
              open={actionsOpen === index}
              onClose={closeActions}
              reserve={reserve}
              allowToBorrowTokens={allowToBorrowTokens}
              tokenPrice={tokenPrice}
              reserveObligationCollateral={reserveObligationCollateral}
              token={reserve.liquidity.mint.toString()}
              walletBalance={walletBalance}
              tokenDecimals={tokenDecimals}
              depositAmount={depositAmount}
              collateralDeposit={collateralDeposit}
              collateralWorth={collateralWorth}
              reserveBorrowedLiquidity={reserveBorrowedLiquidity}
              reserveAvailableLiquidity={reserveAvailableLiquidity}
              mintedCollateralTotal={mintedCollateralTotal}
              liquidationThreshold={liquidationThreshold}
              remainingBorrow={remainingBorrow}
              calcCollateralWorth={calcCollateralWorth}
              borrowApy={borrowApy}
              borrowedAmount={borrowedAmount}
              borrowedAmountWorth={borrowedAmountWorth}
              riskFactor={riskFactor}
              unhealthyBorrowValue={unhealthyBorrowValue}
              handleBorrowObligationLiquidity={handleBorrowObligationLiquidity}
              handleRepayObligationLiquidity={handleRepayObligationLiquidity}
            />
          )}
        </>
      )
    })
  }

  return (
    <Table>
      <thead>
        <tr>
          <th style={{ borderTop: 'none' }}>Asset</th>
          <th style={{ borderTop: 'none' }}>Available for You</th>
          <th style={{ borderTop: 'none' }}>Borrowed Amount</th>
          <th style={{ borderTop: 'none' }}>Borrow APY</th>
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </Table>
  )
}

export default TableAssets
