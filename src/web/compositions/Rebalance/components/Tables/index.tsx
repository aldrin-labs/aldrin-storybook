import React, { useState } from 'react'
import copy from 'clipboard-copy'
import { notify } from '@sb/dexUtils/notifications'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  TableHeader,
  TableRow,
  Table,
  TableBody,
  BorderButton,
  RowTd,
  TextColumnContainer,
} from '@sb/compositions/Pools/components/Tables/index.styles'

import { BlockTemplate } from '@sb/compositions/Pools/index.styles'

import TooltipIcon from '@icons/TooltipImg.svg'

import { Text } from '@sb/compositions/Addressbook/index'
import SvgIcon from '@sb/components/SvgIcon'
import { TokenIconsContainer } from '@sb/compositions/Pools/components/Tables/components'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import Slider from '@sb/components/Slider/Slider'

import MockedToken from '@icons/ccaiToken.svg'
import { Theme } from '@material-ui/core'
import { isEqual, throttle, debounce } from 'lodash'
import { formatSymbol } from '@sb/components/AllocationBlock/DonutChart/utils'
import { TokenIcon } from '@sb/components/TokenIcon'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'
import { AddCoinPopup } from '../AddCoinPopup'
import { Loading } from '@sb/components'
import AddTokenDialog from '../AddTokensPopup/AddTokensPopup'

const tooltipTexts = {
  'no pool':
    "It's currently impossible to buy or sell this token because no pools available for such token. Although, you can create a pool or deposit liquidity to the existing one and earn fees from each transaction through this pool.",
  'no price':
    "It's currently impossible to buy or sell this token because this token is not supported.",
  'no liquidity in pool':
    "It's currently impossible to buy or sell this token due to a lack of liquidity. Although, you can create a pool or deposit liquidity to the existing one and earn fees from each transaction through this pool.",
}

const HeaderRow = ({
  theme,
  openAddCoinPopup,
  loadingRebalanceData,
}: {
  theme: Theme
  openAddCoinPopup: (arg: boolean) => {}
  loadingRebalanceData: boolean
}) => (
  <RowContainer
    height={'10rem'}
    padding="2rem"
    justify={'space-between'}
    align="center"
    style={{ borderBottom: '0.1rem solid #383B45' }}
  >
    <RowContainer style={{ width: '30%' }} align="center" justify="end">
      <Text theme={theme}>Set up your allocation </Text>

      {loadingRebalanceData && (
        <Loading size={22} margin="auto auto auto 2rem" />
      )}
    </RowContainer>

    <BtnCustom
      theme={theme}
      onClick={() => {
        openAddCoinPopup(true)
      }}
      needMinWidth={false}
      btnWidth="auto"
      height="auto"
      fontSize="1.4rem"
      padding="1rem 2.5rem"
      borderRadius="1.7rem"
      borderColor={theme.palette.blue.serum}
      btnColor={'#fff'}
      backgroundColor={theme.palette.blue.serum}
      textTransform={'none'}
      transition={'all .4s ease-out'}
      style={{ whiteSpace: 'nowrap' }}
    >
      Add Coin{' '}
    </BtnCustom>
  </RowContainer>
)

const FooterRow = ({ theme }: { theme: Theme }) => (
  <RowContainer
    height={'5rem'}
    padding="0 2rem"
    justify={'space-between'}
    align="center"
    style={{ borderTop: '0.1rem solid #383B45' }}
  >
    <Text theme={theme}>
      Want to earn fees from Rebalance transactions? Add liquidity!{' '}
    </Text>
    <a
      href={'/pools'}
      style={{
        textDecoration: 'none',
        fontFamily: 'Avenir Next Medium',
        fontSize: '1.5rem',
        textAlign: 'right',
        letterSpacing: '-0.523077px',
        color: '#A5E898',
      }}
    >
      View Pools
      <svg
        style={{ marginLeft: '1rem' }}
        width="13"
        height="8"
        viewBox="0 0 13 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.3536 4.35355C12.5488 4.15829 12.5488 3.84171 12.3536 3.64645L9.17157 0.464467C8.97631 0.269205 8.65973 0.269205 8.46447 0.464467C8.2692 0.659729 8.2692 0.976311 8.46447 1.17157L11.2929 4L8.46447 6.82843C8.2692 7.02369 8.2692 7.34027 8.46447 7.53553C8.65973 7.7308 8.97631 7.7308 9.17157 7.53553L12.3536 4.35355ZM-4.37114e-08 4.5L12 4.5L12 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
          fill="#A5E898"
        />
      </svg>
    </a>
  </RowContainer>
)

export const TokenSymbolColumn = ({ symbol }: { symbol: string }) => (
  <RowTd>
    <Row justify={'flex-start'}>
      <TokenIcon
        mint={getTokenMintAddressByName(symbol)}
        width={'2rem'}
        height={'2rem'}
        margin={'0 1rem 0 0'}
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
        fontSize={'2rem'}
        fontFamily={'Avenir Next Medium'}
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
  theme,
}: {
  symbol: string
  amount: number
  tokenValue: number
  theme: Theme
}) => (
  <RowTd>
    <TextColumnContainer>
      <Text
        theme={theme}
        style={{
          whiteSpace: 'nowrap',
          paddingBottom: '1rem',
        }}
      >
        {amount} {formatSymbol({ symbol })}
      </Text>
      <Text
        theme={theme}
        color={theme.palette.grey.new}
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
  theme,
}: {
  symbol: string
  targetAmount: number
  targetTokenValue: number
  theme: Theme
}) => (
  <RowTd style={{ minWidth: '25rem' }}>
    <TextColumnContainer>
      <Text
        theme={theme}
        style={{
          whiteSpace: 'nowrap',
          paddingBottom: '1rem',
        }}
      >
        {targetAmount} {formatSymbol({ symbol })}
      </Text>
      <Text
        theme={theme}
        color={theme.palette.grey.new}
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
  theme,
  el,
  setTokensMap,
  tokensMap,
  leftToDistributeValue,
  setLeftToDistributeValue,
  totalTokensValue,
}) => {
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

    token.targetPercentage =
      token.targetPercentage - stepCount * token.stepInPercentageToken
    token.targetAmount = +(
      token.targetAmount -
      stepCount * token.stepInAmountToken
    ).toFixed(token.decimalCount)
    token.targetTokenValue =
      token.targetTokenValue - stepCount * token.stepInValueToken

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
        theme={theme}
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
          thumbBackground={el.disabled ? '#93A0B2' : '#165BE0'}
          borderThumb="2px solid #f2fbfb"
          trackAfterBackground={'#383B45'}
          trackBeforeBackground={el.disabled ? '#93A0B2' : '#366CE5'}
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
        theme={theme}
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
  // handleSliderChange,
  allTokensData,
  setTokensMap,
  tokensMap,
  leftToDistributeValue,
  setLeftToDistributeValue,
  totalTokensValue,
  softRefresh,
  loadingRebalanceData,
}: {
  theme: Theme
  data
  softRefresh
  setTokensMap
  tokensMap
  leftToDistributeValue
  setLeftToDistributeValue
  totalTokensValue
  allTokensData
  loadingRebalanceData: boolean
}) => {
  const [isAddCoinPopupOpen, openAddCoinPopup] = useState(false)

  return (
    <RowContainer height={'80%'} align={'flex-end'}>
      <BlockTemplate
        width={'100%'}
        height={'100%'}
        align={'flex-end'}
        theme={theme}
        direction={'column'}
        justify={'end'}
      >
        <MemoizedHeaderRow
          loadingRebalanceData={loadingRebalanceData}
          openAddCoinPopup={async (...args) => {
            openAddCoinPopup(...args)
          }}
          theme={theme}
        />
        <RowContainer
          align="flex-start"
          style={{ height: 'calc(100% - 15rem)', overflow: 'scroll' }}
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
        <MemoizedFooterRow theme={theme} />
      </BlockTemplate>
      <AddTokenDialog
        theme={theme}
        open={isAddCoinPopupOpen}
        userTokens={data}
        allTokensData={allTokensData}
        softRefresh={softRefresh}
        onClose={() => openAddCoinPopup(false)}
      />
    </RowContainer>
  )
}

export default RebalanceTable
