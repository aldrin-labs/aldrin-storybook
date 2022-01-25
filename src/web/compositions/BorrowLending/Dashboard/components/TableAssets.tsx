import { Theme } from '@material-ui/core'
import React, { useState } from 'react'

import BalancesPopup from '@sb/compositions/BorrowLending/Dashboard/components/BalancesPopup'
import {
  calculateBorrowApy,
  calculateUtilizationRate,
} from '@sb/compositions/BorrowLending/utils/rates'
import { toNumberWithDecimals } from '@sb/dexUtils/borrow-lending/U192-converting'

import { Reserve } from '../../../../dexUtils/borrow-lending/types'
import { useUserTokenAccounts } from '../../../../dexUtils/token/hooks'
import { Table } from '../../styles'

type TableAssetsProps = {
  theme: Theme
  reserves: Reserve[]
}

const TableAssets = ({ theme, reserves }: TableAssetsProps) => {
  const [balancesOpen, setBalancesOpen] = useState(false)
  const [walletAccounts] = useUserTokenAccounts()

  const closeBalances = () => {
    setBalancesOpen(false)
  }

  const renderRows = () => {
    return reserves.map((reserve, index) => {
      let tokenPrice = 0
      let depositAmount = 0
      let depositAmountUI = 0
      let depositWorth = 0

      // BalancesPopup values
      let walletBalance = 0
      let borrowApy = 0
      let depositApy = 0

      if (walletAccounts && walletAccounts.length > 0) {
        const depositTokenAccount = walletAccounts.find(
          (account) => account.mint === reserve.collateral.mint.toString()
        )
        const tokenAccount = walletAccounts.find(
          (account) => account.mint === reserve.liquidity.mint.toString()
        )
        if (depositTokenAccount) {
          tokenPrice = toNumberWithDecimals(
            parseInt(reserve.liquidity.marketPrice.toString(), 10),
            5
          )
          depositAmount = depositTokenAccount.amount
          depositAmountUI = depositTokenAccount.amount
          depositWorth =
            parseInt(reserve.liquidity.marketPrice.toString(), 10) *
            depositAmount
        }

        if (tokenAccount) {
          console.log('reserve: ', reserve)
          walletBalance = tokenAccount.amount
          const reserveBorrowedAmount = parseInt(
            reserve.liquidity.borrowedAmount.toString(),
            10
          )
          const utilizationRate = calculateUtilizationRate(
            reserveBorrowedAmount,
            parseInt(
              reserve.liquidity.borrowedAmount
                .add(reserve.liquidity.availableAmount)
                .toString(),
              10
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
        }
      }

      return (
        <>
          <tr
            onClick={() => setBalancesOpen(index)}
            style={{ cursor: 'pointer' }}
            key={index}
          >
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
                <strong>{depositAmountUI}</strong>
              </p>
              <span>${toNumberWithDecimals(depositWorth, 2)}</span>
            </td>
            <td style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <p style={{ margin: 0 }}>
                <strong>tba</strong>
              </p>
              <span>tba</span>
            </td>
            <td style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <p style={{ margin: 0 }}>
                <strong>0</strong>
              </p>
              <span>$0.00</span>
            </td>
          </tr>
          <BalancesPopup
            theme={theme}
            open={balancesOpen === index}
            onClose={closeBalances}
            walletBalance={walletBalance}
            borrowApy={borrowApy}
            depositApy={depositApy}
            depositAmountUI={depositAmountUI}
          />
        </>
      )
    })
  }

  return (
    <Table>
      <thead>
        <tr>
          <th style={{ borderTop: 'none' }}>Asset</th>
          <th style={{ borderTop: 'none' }}>Deposit Value</th>
          <th style={{ borderTop: 'none' }}>Borrow Value</th>
          <th style={{ borderTop: 'none' }}>Claimable Rewards</th>
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </Table>
  )
}

export default TableAssets
