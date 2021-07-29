import React, { useState, useEffect, useCallback } from 'react'
import { Theme } from '@material-ui/core'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'

import { swap } from '@sb/dexUtils/pools'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader } from '@sb/compositions/Pools/components/Popups/index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components'

import GreenCheckMark from '@icons/greenDoneMark.svg'
import RedCross from '@icons/Cross.svg'

import {
  RebalancePopupStep,
  MarketData,
  TokensMapType,
  TransactionType,
  TokensDiff,
} from '../../Rebalance.types'
import { WalletAdapter } from '@sb/dexUtils/types'
import { sendAndConfirmTransactionViaWallet } from '@sb/dexUtils/token/utils/send-and-confirm-transaction-via-wallet'
import { StyledPaper } from './styles'

import { MOCKED_MINTS_MAP } from '@sb/compositions/Rebalance/Rebalance.mock'
import { RawMarketData, useAllMarketsList } from '@sb/dexUtils/markets'
import { ReloadTimer } from '../ReloadTimer'
import { getPoolsSwaps, getSwapsChunks } from '@sb/compositions/Rebalance/utils'
import { TransactionComponent } from './TransactionComponent'
import { PopupFooter } from './PopupFooter'
import { REBALANCE_CONFIG } from '../../Rebalance.config'
import { getTransactionsListWithPrices } from '../../utils/getTransactionsListWithPrices'
import { getVariablesForPlacingOrder } from '../../utils/marketOrderProgram/getVariablesForPlacingOrder'
import { placeOrderForEachTransaction } from '../../utils/marketOrderProgram/placeAllOrders'
import { loadMarketOrderProgram } from '../../utils/marketOrderProgram/loadProgram'

export const RebalancePopup = ({
  rebalanceStep,
  changeRebalanceStep,
  theme,
  open,
  close,
  tokensMap,
  marketsData,
  wallet,
  connection,
  refreshRebalance,
  setLoadingRebalanceData,
}: {
  rebalanceStep: RebalancePopupStep
  changeRebalanceStep: (step: RebalancePopupStep) => void
  theme: Theme
  open: boolean
  close: () => void
  tokensMap: TokensMapType
  marketsData: MarketData[]
  wallet: WalletAdapter
  connection: Connection
  refreshRebalance: () => void
  setLoadingRebalanceData: (loadingState: boolean) => void
}) => {
  const [pendingStateText, setPendingStateText] = useState('Pending')
  const [rebalanceTransactionsList, setRebalanceTransactionsList] = useState<
    TransactionType[]
  >([])

  const allMarketsMap = useAllMarketsList()

  const tokensDiff: TokensDiff = Object.values(tokensMap)
    .map((el) => ({
      symbol: el.symbol,
      amountDiff: +(el.targetAmount - el.amount).toFixed(el.decimals),
      decimalCount: el.decimals,
      price: el.price || 0,
    }))
    .filter((el) => el.amountDiff !== 0)

  const updateTransactionsList = useCallback(
    async ({
      connection,
      marketsData,
      tokensDiff,
      tokensMap,
      allMarketsMap,
    }: {
      connection: Connection
      marketsData: MarketData[]
      tokensDiff: TokensDiff
      tokensMap: TokensMapType
      allMarketsMap: Map<string, RawMarketData>
    }) => {
      // transactions with all prices
      const rebalanceAllTransactionsListWithPrices = await getTransactionsListWithPrices(
        {
          connection,
          marketsData,
          tokensDiff,
          tokensMap,
          allMarketsMap,
        }
      )

      setRebalanceTransactionsList(rebalanceAllTransactionsListWithPrices)

      return rebalanceAllTransactionsListWithPrices
    },
    [JSON.stringify([...allMarketsMap.values()])]
  )

  // only on markets update
  useEffect(() => {
    updateTransactionsList({
      connection,
      marketsData,
      tokensDiff,
      tokensMap,
      allMarketsMap,
    })
  }, [updateTransactionsList])

  const totalFeesUSD = rebalanceTransactionsList.reduce(
    (acc, el) => el.feeUSD + acc,
    0
  )

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer
        justify={'space-between'}
        style={{
          borderBottom: '0.1rem solid #383B45',
          padding: '0 2rem 2rem 2rem',
        }}
      >
        <BoldHeader>Rebalance</BoldHeader>
        <Row style={{ flexWrap: 'nowrap' }}>
          <ReloadTimer
            duration={20}
            callback={() => {
              // if rebalance didn't start
              if (rebalanceStep === 'initial') {
                updateTransactionsList({
                  connection,
                  marketsData,
                  tokensDiff,
                  tokensMap,
                  allMarketsMap,
                })
              }
            }}
          />
          <SvgIcon
            style={{ cursor: 'pointer' }}
            onClick={() => close()}
            src={Close}
          />
        </Row>
      </RowContainer>
      <RowContainer style={{ maxHeight: '40rem', overflowY: 'scroll' }}>
        {rebalanceTransactionsList.map((el) => (
          <TransactionComponent
            key={`${el.symbol}${el.side}${el.price}${el.slippage}${el.total}${el.amount}`}
            symbol={el.symbol}
            slippage={el.slippage}
            price={el.price}
            side={el.side}
            theme={theme}
          />
        ))}
      </RowContainer>
      <RowContainer
        style={{ borderTop: '1px solid #383B45' }}
        height={'15rem'}
        padding={'2rem'}
      >
        {rebalanceStep === 'initial' && (
          <RowContainer direction={'column'}>
            <PopupFooter theme={theme} totalFeesUSD={totalFeesUSD} />
            <RowContainer justify={'space-between'}>
              <BtnCustom
                theme={theme}
                onClick={() => {
                  close()
                  changeRebalanceStep('initial')
                }}
                needMinWidth={false}
                btnWidth="calc(50% - 1rem)"
                height="auto"
                fontSize="1.4rem"
                padding="1.5rem 8rem"
                borderRadius="1.1rem"
                borderColor={'#f2fbfb'}
                btnColor={'#fff'}
                backgroundColor={'none'}
                textTransform={'none'}
                margin={'4rem 0 0 0'}
                transition={'all .4s ease-out'}
                style={{ whiteSpace: 'nowrap' }}
              >
                Cancel{' '}
              </BtnCustom>
              <BtnCustom
                theme={theme}
                onClick={async () => {
                  changeRebalanceStep('pending')

                  try {
                    // refresh data right before rebalance
                    const transactionsList = await updateTransactionsList({
                      connection,
                      marketsData,
                      tokensDiff,
                      tokensMap,
                      allMarketsMap,
                    })

                    // const transactionsVariables = await Promise.all(
                    //   transactionsList.map((transaction) => {
                    //     const symbol = transaction.symbol
                    //     const [base, quote] = symbol.split('_')

                    //     const tokenAccountA = tokensMap[base].address
                    //     const tokenAccountB = tokensMap[quote].address

                    //     return getVariablesForPlacingOrder({
                    //       wallet,
                    //       connection,
                    //       side: transaction.side,
                    //       market: transaction.loadedMarket,
                    //       tokenAccountA: new PublicKey(tokenAccountA),
                    //       tokenAccountB: new PublicKey(tokenAccountB),
                    //     })
                    //   })
                    // )

                    const marketOrderProgram = loadMarketOrderProgram({
                      wallet,
                      connection,
                    })

                    await placeOrderForEachTransaction({
                      wallet,
                      connection,
                      marketOrderProgram,
                      tokensMap,
                      transactions: transactionsList,
                    }).then(() => {
                      changeRebalanceStep('done')
                      setLoadingRebalanceData(true)
                      setTimeout(() => {
                        refreshRebalance()
                      }, 7500)
                    })

                    // console.log('transactionsVariables', transactionsVariables)

                    // const swaps = getPoolsSwaps({
                    //   wallet,
                    //   connection,
                    //   transactionsList: rebalanceTransactionsList,
                    //   tokensMap,
                    // })

                    // try {
                    //   setPendingStateText('Creating swaps...')
                    //   const promisedSwaps = await Promise.all(
                    //     swaps.map((el) => swap(el))
                    //   )
                    //   const swapsTransactions = promisedSwaps.map((el) => el[0])

                    //   const swapTransactionsGroups = getSwapsChunks(
                    //     swapsTransactions,
                    //     REBALANCE_CONFIG.SWAPS_PER_TRANSACTION_LIMIT
                    //   )
                    //   console.log(
                    //     'swapTransactionsGroups: ',
                    //     swapTransactionsGroups
                    //   )

                    //   await Promise.all(
                    //     swapTransactionsGroups.map(
                    //       async (swapTransactionGroup) => {
                    //         setPendingStateText('Creating transaction...')
                    //         const commonTransaction = new Transaction().add(
                    //           ...swapTransactionGroup
                    //         )
                    //         setPendingStateText(
                    //           'Awaitng for Rebalance confirmation...'
                    //         )
                    //         await sendAndConfirmTransactionViaWallet(
                    //           wallet,
                    //           connection,
                    //           commonTransaction
                    //         )
                    //       }
                    //     )
                    //   )

                    // After all completed
                  } catch (e) {
                    console.log('e: ', e)
                    changeRebalanceStep('failed')
                  }

                  // await setTimeout(() => {
                  //   changeRebalanceStep('initial')
                  // }, 5000)
                }}
                needMinWidth={false}
                btnWidth="calc(50% - 1rem)"
                height="auto"
                fontSize="1.4rem"
                padding="1.5rem 8rem"
                borderRadius="1.1rem"
                borderColor={theme.palette.blue.serum}
                btnColor={'#fff'}
                backgroundColor={theme.palette.blue.serum}
                textTransform={'none'}
                margin={'4rem 0 0 0'}
                transition={'all .4s ease-out'}
                style={{ whiteSpace: 'nowrap' }}
              >
                Start Rebalance
              </BtnCustom>
            </RowContainer>
          </RowContainer>
        )}
        {rebalanceStep === 'pending' && (
          <RowContainer
            style={{ height: '100%', alignItems: 'center', display: 'flex' }}
            direction={'column'}
          >
            {' '}
            <Loading color={'#F29C38'} size={42} />
            <Text color={'#F29C38'} style={{ marginTop: '1rem' }}>
              {pendingStateText}
            </Text>
          </RowContainer>
        )}
        {rebalanceStep === 'done' && (
          <RowContainer
            style={{ height: '100%', alignItems: 'center', display: 'flex' }}
            direction={'column'}
          >
            <SvgIcon src={GreenCheckMark} width={'3rem'} height={'3rem'} />{' '}
            <Text color={'#A5E898'} style={{ marginTop: '1rem' }}>
              Done
            </Text>
          </RowContainer>
        )}
        {rebalanceStep === 'failed' && (
          <RowContainer
            style={{ height: '100%', alignItems: 'center', display: 'flex' }}
            direction={'column'}
          >
            <SvgIcon src={RedCross} width={'3rem'} height={'3rem'} />{' '}
            <Text color={'#fff'} style={{ marginTop: '1rem' }}>
              Failed
            </Text>
          </RowContainer>
        )}
      </RowContainer>
    </DialogWrapper>
  )
}
