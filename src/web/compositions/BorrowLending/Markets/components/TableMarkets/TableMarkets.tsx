import { Theme } from '@material-ui/core'
import React, { useState } from 'react'
import NumberFormat from 'react-number-format'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import ReserveStatusPopup from '@sb/compositions/BorrowLending/Markets/components/ReserveStatusPopup/ReserveStatusPopup'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'
import {
  removeTrailingZeros,
  toNumberWithDecimals,
  u192ToBN,
} from '@sb/dexUtils/borrow-lending/U192-converting'

import {
  calculateBorrowApy,
  calculateUtilizationRate,
} from '../../../utils/rates'
import { Table } from '../../../styles'

type TableMarketsProps = {
  theme: Theme
  reserves: any
}

const TableMarkets = ({ theme, reserves }: TableMarketsProps) => {
  const [reserveStatusOpen, setReserveStatusOpen] = useState(false)

  const closeReserveStatus = () => {
    setReserveStatusOpen(false)
  }

  const TableHeaderRow = () => (
    <thead>
      <tr>
        <th>Asset</th>
        <th>Market Size</th>
        <th>Total Borrowed</th>
        <th>Deposit APY</th>
        <th>Borrow APY</th>
      </tr>
    </thead>
  )

  const renderRows = (reservesList) => {
    return reservesList.map((reserve, index) => {
      const tokenPrice = toNumberWithDecimals(
        parseInt(u192ToBN(reserve.liquidity.marketPrice).toString()),
        5
      )
      const reserveMarketPrice =
        parseInt(u192ToBN(reserve.liquidity.marketPrice).toString()) /
        Math.pow(10, 18)
      const tokenSupply =
        parseInt(u192ToBN(reserve.liquidity.borrowedAmount).toString()) /
          Math.pow(10, 18) +
        parseInt(reserve.liquidity.availableAmount.toString())
      const tokenSupplyWorth = tokenSupply * reserveMarketPrice
      const reserveAvailableLiq = parseInt(
        reserve.liquidity.availableAmount.toString()
      )
      const reserveAvailableLiqWorth = reserveAvailableLiq * reserveMarketPrice
      const reserveBorrowedAmount = parseInt(
        u192ToBN(reserve.liquidity.borrowedAmount).toString()
      )
      const reserveBorrowedAmountWorth =
        reserveBorrowedAmount * reserveMarketPrice
      const utilizationRate = calculateUtilizationRate(
        reserveBorrowedAmount,
        parseInt(
          u192ToBN(reserve.liquidity.borrowedAmount)
            .add(reserve.liquidity.availableAmount)
            .toString()
        )
      )

      const borrowApy = calculateBorrowApy(
        utilizationRate,
        reserve.config.optimalUtilizationRate.percent / 100,
        reserve.config.optimalBorrowRate.percent / 100,
        reserve.config.minBorrowRate.percent / 100,
        reserve.config.maxBorrowRate.percent / 100
      )
      const depositApy = borrowApy * utilizationRate
      console.log('borrowApy', borrowApy)
      console.log('depositApy', borrowApy)

      return (
        <>
          <tr
            onClick={() => setReserveStatusOpen(index)}
            style={{ cursor: 'pointer' }}
          >
            <td>
              <a
                href={`https://explorer.solana.com/address/${reserve.liquidity.mint.toString()}`}
                target="_blank"
                style={{ display: 'block' }}
                rel="noreferrer"
              >
                {reserve.liquidity.mint.toString()}
              </a>
              <span>${tokenPrice}</span>
            </td>
            <td>
              <p style={{ margin: 0 }}>
                {removeTrailingZeros(tokenSupply.toFixed(2))}
              </p>
              <span>
                <NumberFormat
                  value={tokenSupplyWorth}
                  displayType="text"
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator
                  prefix="$"
                />
              </span>
            </td>
            <td>
              <p style={{ margin: 0 }}>
                {removeTrailingZeros(
                  toNumberWithDecimals(reserveBorrowedAmount, 2)
                )}
              </p>
              <span>
                ${toNumberWithDecimals(reserveBorrowedAmountWorth, 2)}
              </span>
            </td>
            <td>
              {depositApy % 1 !== 0 ? depositApy.toFixed(2) : depositApy}%
            </td>
            <td>{borrowApy % 1 !== 0 ? borrowApy.toFixed(2) : borrowApy}%</td>
          </tr>
          <ReserveStatusPopup
            theme={theme}
            open={reserveStatusOpen === index}
            onClose={closeReserveStatus}
            availableLiq={reserveAvailableLiq}
            availableLiqWorth={reserveAvailableLiqWorth}
            borrowedAmount={reserveBorrowedAmount}
            borrowedAmountWorth={reserveBorrowedAmountWorth}
            utilization={utilizationRate}
            maxLTV={reserve.config.loanToValueRatio.percent}
            liquidationThreshold={reserve.config.liquidationThreshold.percent}
            liquidationBonus={reserve.config.liquidationBonus.percent}
            depositApy={depositApy}
          />
        </>
      )
    })
  }

  return (
    <RowContainer
      theme={theme}
      height="100%"
      style={{
        minWidth: '1000px',
        overflow: 'auto',
        minHeight: '500px',
      }}
    >
      <RowContainer height="80%" align="flex-end">
        <BlockTemplate
          width="100%"
          height="100%"
          align="flex-end"
          theme={theme}
          direction="column"
          justify="end"
        >
          <RowContainer
            align="flex-start"
            style={{ height: 'calc(100% - 10rem)', overflow: 'scroll' }}
          >
            <Table>
              <TableHeaderRow />
              <tbody>{renderRows(reserves)}</tbody>
            </Table>
          </RowContainer>
        </BlockTemplate>
      </RowContainer>
    </RowContainer>
  )
}

export default TableMarkets
