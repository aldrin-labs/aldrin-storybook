/* eslint-disable no-prototype-builtins */
import { Connection } from '@solana/web3.js'
import { COLORS } from '@variables/variables'
import React, { useEffect, useState } from 'react'

import { StyledTitle } from '@sb/components/TradingTable/TradingTable.styles'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { closeOrder } from '@sb/dexUtils/twamm/closeOrder'
import { getParsedPairSettings } from '@sb/dexUtils/twamm/getParsedPairSettings'
import { getParsedRunningOrders } from '@sb/dexUtils/twamm/getParsedRunningOrders'
import { PairSettings, TwammOrder } from '@sb/dexUtils/twamm/types'
import { WalletAdapter } from '@sb/dexUtils/types'
import { toMap } from '@sb/utils'

import { secondsToHms } from '@core/utils/dateUtils'

import { RedButton } from '../../styles'

export const runningOrdersColumnNames = [
  { label: 'Pair/Side', id: 'pairSide' },
  { label: 'Total Order Amount', id: 'amount' },
  { label: 'Filled %', id: 'filled' },
  { label: 'Average Filled Price', id: 'avgFilledPrice' },
  { label: 'Sent', id: 'sent' },
  { label: 'Received', id: 'received' },
  { label: 'Remaining Amount', id: 'remainingAmount' },
  { label: 'Remaining Time', id: 'remainingTime' },
  { label: 'Actions', id: 'actions' },
]

export const combineRunningOrdersTable = ({
  wallet,
  connection,
  getDexTokensPricesQuery,
}: {
  wallet: WalletAdapter
  connection: Connection
  getDexTokensPricesQuery: { getDexTokensPricesQuery: DexTokensPrices[] }
}) => {
  const [runningOrders, setRunningOrders] = useState<TwammOrder[]>([])
  const [pairData, setPairData] = useState<PairSettings[]>([])

  const [userTokensData, refreshUserTokensData] = useUserTokenAccounts()

  useEffect(() => {
    const getRunningOrdersData = async () => {
      const runningOrdersArray = await getParsedRunningOrders({
        connection,
        wallet,
      })
      const pairSettingsData = await getParsedPairSettings({
        connection,
        wallet,
      })
      setRunningOrders(runningOrdersArray)
      setPairData(pairSettingsData)
    }
    getRunningOrdersData()
  }, [wallet.publicKey])

  const pairsDataMap = toMap(pairData, (p) => p?.publicKey)

  const runningOrdersArray =
    runningOrders
      ?.flat()
      .filter((order) => order?.signer === wallet?.publicKey?.toString()) || []

  console.log({ runningOrdersArray, pairData })

  return runningOrdersArray?.map((runningOrder) => {
    const pairSettingsAddress = runningOrder?.pair || ''
    const currentPairSettings = pairsDataMap.get(pairSettingsAddress) || null

    if (!currentPairSettings) {
      return null
    }

    console.log({ currentPairSettings })
    const base =
      getTokenNameByMintAddress(currentPairSettings?.baseTokenMint) ||
      currentPairSettings?.baseTokenMint

    const quote =
      getTokenNameByMintAddress(currentPairSettings?.quoteTokenMint) ||
      currentPairSettings?.quoteTokenMint

    const side = runningOrder.side.ask ? 'Sell' : 'Buy'

    const remainingAmount = +runningOrder?.amount - +runningOrder?.amountFilled

    const avgFilledPrice =
      runningOrder.amountFilled / runningOrder.tokensSwapped || 0

    const remainingTime = (runningOrder.endTime - Date.now() / 1000) * -1

    const filledPers =
      (runningOrder.amountFilled * 100) / runningOrder.amountToFill

    const sent = runningOrder?.amount * filledPers

    const received =
      sent *
      getDexTokensPricesQuery?.getDexTokensPricesQuery?.getDexTokensPrices?.find(
        (runningOrder) => runningOrder.symbol === quote
      )?.price

    const { address: userBaseTokenAccount } = getTokenDataByMint(
      userTokensData,
      currentPairSettings.baseTokenMint
    )

    const { address: userQuoteTokenAccount } = getTokenDataByMint(
      userTokensData,
      currentPairSettings.quoteTokenMint
    )

    console.log({ userBaseTokenAccount, userQuoteTokenAccount })

    return {
      // id: el.pair,
      pairSide: {
        render: (
          <RowContainer direction="column" align="flex-start">
            <StyledTitle color={COLORS.main} fontSize="1.5rem">
              {`${base} / ${quote}`}
            </StyledTitle>
            <StyledTitle
              fontSize="1.5rem"
              color={side === 'Buy' ? COLORS.success : COLORS.errorAlt}
            >
              {side} {base}
            </StyledTitle>
          </RowContainer>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      amount: {
        render: (
          <StyledTitle color={COLORS.main} fontSize="1.5rem">
            {el.amount} {base}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      filled: {
        render: (
          <StyledTitle color={COLORS.success} fontSize="1.5rem">
            {filledPers} %
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      avgFilledPrice: {
        render: (
          <StyledTitle color={COLORS.main} fontSize="1.5rem">
            {avgFilledPrice} {quote}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      sent: {
        render: (
          <StyledTitle color={COLORS.success} fontSize="1.5rem">
            {sent} {base}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      received: {
        render: (
          <StyledTitle color={COLORS.success} fontSize="1.5rem">
            {received} {quote}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      remainingAmount: {
        render: (
          <StyledTitle color={COLORS.main} fontSize="1.5rem">
            {remainingAmount} {base}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      remainingTime: {
        render: (
          <StyledTitle color={COLORS.main} fontSize="1.5rem">
            {secondsToHms(remainingTime)}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      actions: {
        render: (
          <RedButton
            onClick={async () => {
              const result = await closeOrder({
                wallet,
                connection,
                pairSettings: currentPairSettings,
                userBaseTokenAccount,
                userQuoteTokenAccount,
                order: runningOrder,
              })
            }}
          >
            Stop
          </RedButton>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
    }
  })
}
