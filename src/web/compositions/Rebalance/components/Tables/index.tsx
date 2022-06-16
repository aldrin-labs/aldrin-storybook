import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import copy from 'clipboard-copy'
import { throttle } from 'lodash-es'
import React, { useState } from 'react'
import { DefaultTheme, useTheme } from 'styled-components'

import { Loading } from '@sb/components'
import { formatSymbol } from '@sb/components/AllocationBlock/DonutChart/utils'
import { Button } from '@sb/components/Button'
import Slider from '@sb/components/Slider/Slider'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { REBALANCE_CONFIG } from '../../Rebalance.config'
import { TokenInfoWithTargetData, TokensMapType } from '../../Rebalance.types'
import AddTokenDialog from '../AddTokensPopup/AddTokensPopup'
import {
  RowTd,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TextColumnContainer,
} from './styles'

const tooltipTexts = {
  'no market':
    "It's currently impossible to buy or sell this token because no markets available for such token.",
  'no price':
    "It's currently impossible to buy or sell this token because this token is not supported.",
}

const HeaderRow = ({
  openAddCoinPopup,
  loadingRebalanceData,
  resetTargetAllocation,
}: {
  openAddCoinPopup: (arg: boolean) => {}
  loadingRebalanceData: boolean
  resetTargetAllocation: () => void
}) => {
  const theme = useTheme()
  return (
    <RowContainer
      height="10rem"
      padding="2rem"
      justify="space-between"
      align="center"
      style={{ borderBottom: `0.1rem solid ${theme.colors.gray5}` }}
    >
      <Row width="30%" align="center" justify="flex-start">
        <Text>Set up your allocation </Text>

        {loadingRebalanceData && (
          <Loading size={22} margin="auto auto auto 2rem" />
        )}
      </Row>
      <Row>
        <Button
          $variant="link"
          $padding="lg"
          $fontSize="sm"
          $color="primary"
          onClick={resetTargetAllocation}
        >
          Reset to current allocation
        </Button>
        <Button
          onClick={() => {
            openAddCoinPopup(true)
          }}
          $variant="primary"
          $padding="lg"
          $fontSize="sm"
        >
          Add Coin
        </Button>
      </Row>
    </RowContainer>
  )
}

const FooterRow = ({
  resetTargetAllocation,
}: {
  resetTargetAllocation: () => void
}) => (
  <RowContainer
    height="5rem"
    padding="0 2rem"
    justify="space-between"
    align="center"
    style={{ borderTop: '0.1rem solid #383B45' }}
  />
)

export const TokenSymbolColumn = ({ symbol }: { symbol: string }) => (
  <RowTd>
    <Row justify="flex-start">
      <TokenIcon
        mint={getTokenMintAddressByName(symbol)}
        size={32}
        margin="0 1rem 0 0"
      />
      <Text
        onClick={() => {
          if (symbol.length > 15) {
            copy(symbol)
            notify({
              type: 'success',
              message: 'Copied!',
            })
          }
        }}
        fontSize="2rem"
        fontFamily="Avenir Next Medium"
      >
        {formatSymbol({ symbol })}
      </Text>
    </Row>
  </RowTd>
)

export const TokenAmountColumn = ({
  symbol,
  amount,
  tokenValue,
}: {
  symbol: string
  amount: number
  tokenValue: number
}) => (
  <RowTd>
    <TextColumnContainer>
      <Text
        style={{
          whiteSpace: 'nowrap',
          paddingBottom: '1rem',
        }}
      >
        {amount} {formatSymbol({ symbol })}
      </Text>
      <Text
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        ${tokenValue.toFixed(2)}
      </Text>
    </TextColumnContainer>
  </RowTd>
)

export const TokenTargetAmountColumn = ({
  symbol,
  targetAmount,
  targetTokenValue,
}: {
  symbol: string
  targetAmount: number
  targetTokenValue: number
}) => (
  <RowTd style={{ minWidth: '25rem' }}>
    <TextColumnContainer>
      <Text
        style={{
          whiteSpace: 'nowrap',
          paddingBottom: '1rem',
        }}
      >
        {targetAmount} {formatSymbol({ symbol })}
      </Text>
      <Text
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        ${targetTokenValue.toFixed(2)}
      </Text>
    </TextColumnContainer>
  </RowTd>
)

export const MemoizedTokenSymbolColumn = React.memo(TokenSymbolColumn)
export const MemoizedTokenAmountColumn = React.memo(TokenAmountColumn)
export const MemoizedTokenTargetAmountColumn = React.memo(
  TokenTargetAmountColumn
)

export const TableMainRow = ({
  el,
  setTokensMap,
  tokensMap,
  leftToDistributeValue,
  setLeftToDistributeValue,
  totalTokensValue,
}: {
  el: TokenInfoWithTargetData
  setTokensMap: (tokensMap: TokensMapType) => void
  tokensMap: TokensMapType
  leftToDistributeValue: number
  setLeftToDistributeValue: (n: number) => void
  totalTokensValue: number
}) => {
  const theme = useTheme()
  const handleSliderChange = (e, value) => {
    // console.log('value: ', value)
    const token = tokensMap[el.symbol]

    // console.log('token: ', token)

    const oldTargetPercentage = token.targetPercentage
    const oldTargetTokenValue = token.targetTokenValue
    const oldLeftToDistributedValue = leftToDistributeValue

    const maxDistributedValue =
      oldTargetPercentage + (oldLeftToDistributedValue * 100) / totalTokensValue

    // console.log('maxDistributedValue: ', maxDistributedValue)
    const newAmount = (value * totalTokensValue) / 100 / el.price

    const isSOLAmountLessThanMin = el.amount < REBALANCE_CONFIG.MIN_SOL_AMOUNT
    const minSOLAmount = isSOLAmountLessThanMin
      ? el.amount
      : REBALANCE_CONFIG.MIN_SOL_AMOUNT

    if (
      el.mint === WRAPPED_SOL_MINT.toString() &&
      (newAmount < minSOLAmount ||
        (newAmount < el.amount && isSOLAmountLessThanMin))
    ) {
      token.targetAmount = minSOLAmount
      token.targetTokenValue = token.targetAmount * token.price
      token.targetPercentage = (token.targetTokenValue / totalTokensValue) * 100

      // Here we are handling case when undistributed value might be negative
      const leftToDistributeRaw =
        oldLeftToDistributedValue +
        ((oldTargetPercentage - token.targetPercentage) / 100) *
          totalTokensValue
      // console.log('leftToDistributeRaw: ', leftToDistributeRaw)
      const leftToDistributeNew =
        leftToDistributeRaw < 0 ? 0 : leftToDistributeRaw
      setLeftToDistributeValue(leftToDistributeNew)

      setTokensMap({ ...tokensMap })

      return
    }

    // Only for zero case
    if (value <= 0) {
      token.targetPercentage = 0
      token.targetAmount = 0
      token.targetTokenValue = 0

      // Here we are handling case when undistributed value might be negative
      const leftToDistributeRaw =
        oldLeftToDistributedValue +
        ((oldTargetPercentage - token.targetPercentage) / 100) *
          totalTokensValue
      // console.log('leftToDistributeRaw: ', leftToDistributeRaw)
      const leftToDistributeNew =
        leftToDistributeRaw < 0 ? 0 : leftToDistributeRaw
      setLeftToDistributeValue(leftToDistributeNew)

      setTokensMap({ ...tokensMap })

      return
    }

    // Handling max value
    if (value >= maxDistributedValue) {
      token.targetTokenValue = (maxDistributedValue * totalTokensValue) / 100
      token.targetPercentage = maxDistributedValue
      token.targetAmount = stripDigitPlaces(
        (token.targetTokenValue / token.price).toFixed(token.decimalCount),
        token.decimalCount
      )

      // Here we are handling case when undistributed value might be negative
      const leftToDistributeRaw =
        oldLeftToDistributedValue +
        ((oldTargetPercentage - token.targetPercentage) / 100) *
          totalTokensValue
      // console.log('leftToDistributeRaw: ', leftToDistributeRaw)
      // console.log('maxvalue case')
      const leftToDistributeNew =
        leftToDistributeRaw < 0 ? 0 : leftToDistributeRaw
      setLeftToDistributeValue(leftToDistributeNew)

      setTokensMap({ ...tokensMap })

      return
    }

    const percentageDiff = token.targetPercentage - value
    // const stepCount = Math.trunc(percentageDiff / token.stepInPercentageToken) + 1
    const stepCount = Math.trunc(percentageDiff / token.stepInPercentageToken)

    token.targetPercentage -= stepCount * token.stepInPercentageToken

    token.targetAmount = +(
      token.targetAmount -
      stepCount * token.stepInAmountToken
    ).toFixed(token.decimalCount)

    token.targetTokenValue -= stepCount * token.stepInValueToken

    // if based on calculations we have little number with negative sign
    // TODO: check for little positive numbers
    if (token.targetTokenValue < 0) {
      token.targetTokenValue = 0
    }

    // Handling case with reverting back to initial value of token, amount, percentage & etc.
    const percentageDiffWithInitialPercentage = Math.abs(
      token.percentage - token.targetPercentage
    )
    if (percentageDiffWithInitialPercentage <= 0.3) {
      // console.log('percentageDiffWithInitialPercentage: ', percentageDiffWithInitialPercentage)
      token.targetPercentage = token.percentage
      token.targetAmount = token.amount
      token.targetTokenValue = token.tokenValue
    }

    // Here we are handling case when undistributed value might be negative
    const leftToDistributeRaw =
      oldLeftToDistributedValue +
      ((oldTargetPercentage - token.targetPercentage) / 100) * totalTokensValue

    // console.log('general case leftToDistributeRaw: ', leftToDistributeRaw)
    const leftToDistributeNew =
      leftToDistributeRaw < 0 ? 0 : leftToDistributeRaw

    setTokensMap({ ...tokensMap })

    // console.log('leftToDistributeNew: ', leftToDistributeNew)
    // console.log('stepCount: ', stepCount)
    // console.log('token.targetPercentage: ', token.targetPercentage)
    // console.log('token.targetAmount: ', token.targetAmount)
    // console.log('token.targetTokenValue: ', token.targetTokenValue)

    setLeftToDistributeValue(leftToDistributeNew)
  }

  const handleSliderChangeThrottled = throttle(handleSliderChange, 100)
  return (
    <TableRow>
      <MemoizedTokenSymbolColumn symbol={el.symbol} />
      <MemoizedTokenAmountColumn
        symbol={el.symbol}
        amount={el.amount}
        tokenValue={el.tokenValue}
      />
      <RowTd>
        <Slider
          thumbWidth="2.4rem"
          thumbHeight="2.4rem"
          sliderWidth="18rem"
          sliderHeight="1.7rem"
          sliderHeightAfter="2rem"
          borderRadius="3rem"
          borderRadiusAfter="3rem"
          thumbBackground={el.disabled ? '#93A0B2' : '#0E02EC'}
          borderThumb="2px solid #f2fbfb"
          trackAfterBackground={theme.colors.gray5}
          trackBeforeBackground={
            el.disabled ? theme.colors.gray10 : theme.colors.blue5
          }
          value={el.targetPercentage}
          disabled={el.disabled}
          disabledText={tooltipTexts[el.disabledReason]}
          onChange={handleSliderChangeThrottled}
          // onDragEnd={(...args) => {
          //   console.log('onDragEnd args[]', args)
          //   console.log('onDragEnd e.target.value', args[0].target.value)
          // }}
          // step={el.stepInPercentageToken}
          max={100}
        />
      </RowTd>
      <MemoizedTokenTargetAmountColumn
        symbol={el.symbol}
        targetAmount={el.targetAmount}
        targetTokenValue={el.targetTokenValue}
      />
    </TableRow>
  )
}

const TableHeaderRow = () => (
  <TableHeader>
    <RowTd>Asset</RowTd>
    <RowTd>Current Value</RowTd>
    <RowTd>Allocation</RowTd>
    <RowTd>Target Value</RowTd>
  </TableHeader>
)

const MemoizedHeaderRow = React.memo(HeaderRow)
const MemoizedFooterRow = React.memo(FooterRow)
const MemoizedTableMainRow = React.memo(
  TableMainRow,
  (prevProps, nextProps) => {
    // Change it
    // leftToDistributeValue,
    // totalTokensValue,
    // el
    return true
  }
)
const MemoizedTableHeaderRow = React.memo(TableHeaderRow)

const RebalanceTable = ({
  theme,
  data,
  setTokensMap,
  tokensMap,
  leftToDistributeValue,
  setLeftToDistributeValue,
  totalTokensValue,
  softRefresh,
  loadingRebalanceData,
  resetTargetAllocation,
}: {
  theme: DefaultTheme
  data: TokenInfoWithTargetData[]
  softRefresh: () => void
  setTokensMap: (tokensMap: TokensMapType) => void
  tokensMap: TokensMapType
  leftToDistributeValue: number
  setLeftToDistributeValue: (n: number) => void
  totalTokensValue: number
  loadingRebalanceData: boolean
  resetTargetAllocation: () => void
}) => {
  const [isAddCoinPopupOpen, openAddCoinPopup] = useState(false)

  return (
    <RowContainer height="80%" align="flex-end">
      <BlockTemplate
        width="100%"
        height="100%"
        align="flex-end"
        direction="column"
        justify="end"
        color="gray6"
      >
        <MemoizedHeaderRow
          resetTargetAllocation={resetTargetAllocation}
          loadingRebalanceData={loadingRebalanceData}
          resetTargetAllocation={resetTargetAllocation}
          openAddCoinPopup={async (...args) => {
            openAddCoinPopup(...args)
          }}
        />
        <RowContainer
          align="flex-start"
          style={{ height: 'calc(100% - 10rem)', overflow: 'scroll' }}
        >
          <Table>
            <MemoizedTableHeaderRow />
            <TableBody>
              {data.map((el) => (
                <TableMainRow
                  key={el.symbol}
                  theme={theme}
                  el={el}
                  setTokensMap={setTokensMap}
                  tokensMap={tokensMap}
                  leftToDistributeValue={leftToDistributeValue}
                  setLeftToDistributeValue={setLeftToDistributeValue}
                  totalTokensValue={totalTokensValue}
                />
              ))}
            </TableBody>
          </Table>
        </RowContainer>
        {/* <MemoizedFooterRow
          theme={theme}
          resetTargetAllocation={resetTargetAllocation}
        /> */}
      </BlockTemplate>
      <AddTokenDialog
        theme={theme}
        open={isAddCoinPopupOpen}
        userTokens={data}
        softRefresh={softRefresh}
        onClose={() => openAddCoinPopup(false)}
      />
    </RowContainer>
  )
}

export default RebalanceTable
