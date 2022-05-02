import { Connection } from '@solana/web3.js'
import { COLORS } from '@variables/variables'
import React, { useEffect, useState } from 'react'

import { StyledTitle } from '@sb/components/TradingTable/TradingTable.styles'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { StopOrderPopup } from '@sb/compositions/Twamm/components/StopOrderPopup/StopOrderPopup'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { closeOrder } from '@sb/dexUtils/twamm/closeOrder'
import { getParsedPairSettings } from '@sb/dexUtils/twamm/getParsedPairSettings'
import { PairSettings } from '@sb/dexUtils/twamm/types'
import { useRunningOrders } from '@sb/dexUtils/twamm/useRunningOrders'
import { WalletAdapter } from '@sb/dexUtils/types'
import { useInterval } from '@sb/dexUtils/useInterval'
import { toMap } from '@sb/utils'

import { stripByAmount } from '@core/utils/chartPageUtils'
import { estimatedTime } from '@core/utils/dateUtils'

import {
  MIN_ORDER_DURATION_TO_CANCEL,
  ORDER_FILL_THRESHOLD,
} from '../../PlaceOrder/config'
import { BlueButton, RedButton } from '../../styles'

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
  getDexTokensPricesQuery: { getDexTokensPricesQuery },
  getTokenPriceByName,
}: {
  wallet: WalletAdapter
  connection: Connection
  getDexTokensPricesQuery: { getDexTokensPricesQuery: DexTokensPrices[] }
  getTokenPriceByName: (name: string) => number
}) => {
  const [runningOrders, refreshRunningOrders] = useRunningOrders({
    wallet,
    connection,
  })

  const [stopOrderPopupOpen, setStopOrderPopupOpen] = useState(true)

  useInterval(refreshRunningOrders, 10000)

  const [pairData, setPairData] = useState<PairSettings[]>([])

  const [userTokensData, refreshUserTokensData] = useUserTokenAccounts()

  useEffect(() => {
    const getRunningOrdersData = async () => {
      const pairSettingsData = await getParsedPairSettings({
        connection,
        wallet,
      })
      setPairData(pairSettingsData)
    }
    getRunningOrdersData()
  }, [wallet.publicKey])

  const pairsDataMap = toMap(pairData, (p) => p?.publicKey)

  const runningOrdersArray =
    runningOrders
      ?.flat()
      .filter((order) => order?.signer === wallet?.publicKey?.toString()) || []

  return runningOrdersArray
    ?.map((runningOrder, index) => {
      const pairSettingsAddress = runningOrder?.pair || ''
      const currentPairSettings = pairsDataMap.get(pairSettingsAddress) || null

      if (!currentPairSettings) {
        return null
      }

      const handleCloseOrder = async () => {
        setStopOrderPopupOpen(false)
        const result = await closeOrder({
          wallet,
          connection,
          pairSettings: currentPairSettings,
          userBaseTokenAccount,
          userQuoteTokenAccount,
          order: runningOrder,
          side,
        })

        // reload data
        await refreshRunningOrders()

        const isClaim = remainingTime < 0

        // notify
        notify({
          type: result === 'success' ? 'success' : 'error',
          message:
            result === 'success'
              ? `Order ${isClaim ? 'claimed' : 'closed'} successfully.`
              : `Order ${
                  isClaim ? 'claim' : 'close'
                } failed. Please, try a bit later.`,
        })
      }

      const placingFee =
        parseInt(currentPairSettings.fees.placingFeeNumerator.toString()) /
        parseInt(currentPairSettings.fees.placingFeeDenominator.toString())

      const cancellingFee =
        parseInt(currentPairSettings.fees.cancellingFeeNumerator.toString()) /
        parseInt(currentPairSettings.fees.cancellingFeeDenominator.toString())

      const side = runningOrder.side.ask ? 'Sell' : 'Buy'
      const isSellSide = side === 'Sell'
      const [baseTokenMint, quoteTokenMint] = isSellSide
        ? [
            currentPairSettings.baseTokenMint,
            currentPairSettings.quoteTokenMint,
          ]
        : [
            currentPairSettings.quoteTokenMint,
            currentPairSettings.baseTokenMint,
          ]

      const [baseMintDecimals, quoteMintDecimals] = isSellSide
        ? [
            currentPairSettings.baseMintDecimals,
            currentPairSettings.quoteMintDecimals,
          ]
        : [
            currentPairSettings.quoteMintDecimals,
            currentPairSettings.baseMintDecimals,
          ]

      const base = getTokenNameByMintAddress(baseTokenMint) || baseTokenMint

      const quote = getTokenNameByMintAddress(quoteTokenMint) || quoteTokenMint

      const baseTokenPrice = getTokenPriceByName(base)

      const orderAmount = runningOrder.amount / 10 ** baseMintDecimals

      const cancelFeeCalc = (orderAmount / 100) * cancellingFee

      const remainingAmount =
        (runningOrder.amount - +runningOrder?.amountFilled) /
        10 ** baseMintDecimals

      const currentTime = Date.now() / 1000
      const remainingTime = runningOrder.endTime - currentTime

      // reduce fee from amount
      const filledPers =
        (runningOrder.stepsFilled / runningOrder.stepsToFill) * 100

      const sent = runningOrder.amountFilled / 10 ** baseMintDecimals || 0
      const received = runningOrder.tokensSwapped / 10 ** quoteMintDecimals || 0

      const avgFilledPrice = received / sent || 0

      const { address: userBaseTokenAccount } = getTokenDataByMint(
        userTokensData,
        baseTokenMint
      )

      const { address: userQuoteTokenAccount } = getTokenDataByMint(
        userTokensData,
        quoteTokenMint
      )

      // tmin time to pass < current - start
      const isPassedEnoughTimeForCancle =
        currentTime - runningOrder.startTime >
        ((runningOrder.endTime - runningOrder.startTime) / 100) *
          MIN_ORDER_DURATION_TO_CANCEL

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
              {stripByAmount(runningOrder.amount / 10 ** baseMintDecimals)}{' '}
              {base}
            </StyledTitle>
          ),
          contentToSort: '',
          showOnMobile: false,
        },
        filled: {
          render: (
            <StyledTitle color={COLORS.success} fontSize="1.5rem">
              {filledPers >= ORDER_FILL_THRESHOLD
                ? 'Filled'
                : `${stripByAmount(filledPers)} %`}
            </StyledTitle>
          ),
          contentToSort: '',
          showOnMobile: false,
        },
        avgFilledPrice: {
          render: (
            <StyledTitle color={COLORS.main} fontSize="1.5rem">
              {stripByAmount(avgFilledPrice)} {quote}
            </StyledTitle>
          ),
          contentToSort: '',
          showOnMobile: false,
        },
        sent: {
          render: (
            <StyledTitle color={COLORS.success} fontSize="1.5rem">
              {stripByAmount(sent)} {base}
            </StyledTitle>
          ),
          contentToSort: '',
          showOnMobile: false,
        },
        received: {
          render: (
            <StyledTitle color={COLORS.success} fontSize="1.5rem">
              {stripByAmount(received)} {quote}
            </StyledTitle>
          ),
          contentToSort: '',
          showOnMobile: false,
        },
        remainingAmount: {
          render: (
            <StyledTitle color={COLORS.main} fontSize="1.5rem">
              {stripByAmount(remainingAmount)} {base}
            </StyledTitle>
          ),
          contentToSort: '',
          showOnMobile: false,
        },
        remainingTime: {
          render: (
            <StyledTitle color={COLORS.main} fontSize="1.5rem">
              {remainingTime < 0 ? '-' : estimatedTime(remainingTime)}
            </StyledTitle>
          ),
          contentToSort: '',
          showOnMobile: false,
        },
        actions: {
          render: (
            <>
              <StopOrderPopup
                open={stopOrderPopupOpen === index}
                cancellingFee={cancelFeeCalc}
                baseSymbol={base}
                onClose={() => {
                  setStopOrderPopupOpen(false)
                }}
                onStop={handleCloseOrder}
              />
              {remainingTime > 0 ? (
                <RedButton
                  disabled={!isPassedEnoughTimeForCancle}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setStopOrderPopupOpen(index)
                  }}
                >
                  Stop
                </RedButton>
              ) : (
                <BlueButton
                  style={{ cursor: 'pointer' }}
                  onClick={handleCloseOrder}
                >
                  Claim
                </BlueButton>
              )}
            </>
          ),
          contentToSort: '',
          showOnMobile: false,
        },
      }
    })
    .filter((r) => !!r)
}
