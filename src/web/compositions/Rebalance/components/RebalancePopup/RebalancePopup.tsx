import { Connection } from '@solana/web3.js'
import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'styled-components'

import { Loading } from '@sb/components'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import AttentionComponent from '@sb/components/AttentionBlock'
import { Button } from '@sb/components/Button'
import SvgIcon from '@sb/components/SvgIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { Placeholder } from '@sb/components/TraidingTerminal/styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader } from '@sb/compositions/Pools/components/Popups/index.styles'
import {
  MarketsMap,
  useAllMarketsList,
  useAllMarketsMapById,
} from '@sb/dexUtils/markets'
import { WalletAdapter } from '@sb/dexUtils/types'
import { RINProviderURL } from '@sb/dexUtils/utils'
import { CloseIconContainer } from '@sb/styles/StyledComponents/IconContainers'

import RedCross from '@icons/Cross.svg'
import GreenCheckMark from '@icons/greenDoneMark.svg'
import Info from '@icons/inform.svg'

import {
  RebalancePopupStep,
  TokensMapType,
  TransactionType,
} from '../../Rebalance.types'
import { getTransactionsListWithPrices } from '../../utils/getTransactionsListWithPrices'
import { getTransactionState } from '../../utils/getTransactionState'
import { isTransactionWithError } from '../../utils/isTransactionWithError'
import { loadMarketOrderProgram } from '../../utils/marketOrderProgram/loadProgram'
import { placeAllOrders } from '../../utils/marketOrderProgram/placeAllOrders'
import { ReloadTimer } from '../ReloadTimer'
import { LoadingWithHint } from './LoadingWithHint'
import { PopupFooter } from './PopupFooter'
import { StyledPaper } from './styles'
import { TransactionComponent } from './TransactionComponent'

export const isWebWallet = (providerUrl: string) => {
  return (
    providerUrl === RINProviderURL || providerUrl === 'https://www.sollet.io'
  )
}

export const RebalancePopup = ({
  open,
  close,
  tokensMap,
  wallet,
  connection,
  refreshRebalance,
  setLoadingRebalanceData,
}: {
  open: boolean
  close: () => void
  tokensMap: TokensMapType
  wallet: WalletAdapter
  connection: Connection
  refreshRebalance: () => void
  setLoadingRebalanceData: (loadingState: boolean) => void
}) => {
  const theme = useTheme()
  const allMarketsMapById = useAllMarketsMapById()

  const [rebalanceStep, changeRebalanceStep] =
    useState<RebalancePopupStep>('pending')

  const [rebalanceTransactionsLoaded, setRebalanceTransactionsLoaded] =
    useState(false)

  const [numberOfCompletedTransactions, setNumberOfCompletedTransactions] =
    useState(0)

  const [rebalanceTransactionsList, setRebalanceTransactionsList] = useState<
    TransactionType[]
  >([])

  const allMarketsMap = useAllMarketsList()
  const showConfirmTradeButton = isWebWallet(wallet?._providerUrl?.origin)

  const updateTransactionsList = useCallback(
    async ({
      wallet,
      connection,
      tokensMap,
      allMarketsMap,
    }: {
      wallet: WalletAdapter
      connection: Connection
      tokensMap: TokensMapType
      allMarketsMap: MarketsMap
    }) => {
      // transactions with all prices
      const rebalanceAllTransactionsListWithPrices =
        await getTransactionsListWithPrices({
          wallet,
          connection,
          tokensMap,
          allMarketsMap,
          allMarketsMapById,
        })

      setRebalanceTransactionsList(rebalanceAllTransactionsListWithPrices)
      setRebalanceTransactionsLoaded(true)

      return rebalanceAllTransactionsListWithPrices
    },
    [
      wallet?.publicKey?.toString(),
      JSON.stringify(tokensMap),
      JSON.stringify([...allMarketsMap.values()]),
    ]
  )

  const executeRebalance = async () => {
    changeRebalanceStep('pending')

    try {
      const marketOrderProgram = loadMarketOrderProgram({
        wallet,
        connection,
      })

      await placeAllOrders({
        wallet,
        connection,
        marketOrderProgram,
        tokensMap,
        transactions: rebalanceTransactionsList,
        setNumberOfCompletedTransactions,
      })

      await changeRebalanceStep('done')
      await setLoadingRebalanceData(true)

      await setTimeout(async () => {
        await refreshRebalance()
        close()
      }, 5000)
    } catch (e) {
      console.log('e: ', e)
      changeRebalanceStep('failed')
      setTimeout(async () => {
        await refreshRebalance()
        close()
      }, 5000)
    }
  }

  useEffect(() => {
    updateTransactionsList({
      wallet,
      connection,
      tokensMap,
      allMarketsMap,
    })
  }, [])

  const currentSOLAmount = tokensMap.SOL.amount
  const targetSOLAmount = tokensMap.SOL.targetAmount

  const totalFeesUSD = rebalanceTransactionsList.reduce(
    (acc, el) => el.feeUSD + acc,
    0
  )

  const totalFeesSOL = rebalanceTransactionsList.reduce((acc, el, i, arr) => {
    const placeOrderAndSettleFee = 0.00001

    // if we have two transactions on one market without user's openOrders account,
    // we'll create it only once
    const isNeedToCreateOpenOrdersAccount =
      arr.findIndex(
        (transaction) =>
          transaction.symbol === el.symbol &&
          transaction.openOrders?.length === 0
      ) === i

    const createOpenOrdersAccountFee = isNeedToCreateOpenOrdersAccount
      ? 0.0239
      : 0

    return acc + placeOrderAndSettleFee + createOpenOrdersAccountFee
  }, 0)

  const isNotEnoughSOL =
    totalFeesSOL > currentSOLAmount || totalFeesSOL > targetSOLAmount

  const isDisabled =
    !rebalanceTransactionsLoaded ||
    isNotEnoughSOL ||
    rebalanceTransactionsList.length === 0

  return (
    <DialogWrapper
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
      id="rebalancePopup"
      onEnter={() => {
        changeRebalanceStep('initial')
        setRebalanceTransactionsLoaded(false)
        setNumberOfCompletedTransactions(0)
        setRebalanceTransactionsList([])
      }}
    >
      <RowContainer
        justify="space-between"
        style={{
          borderBottom: '0.1rem solid #383B45',
          padding: '0 2rem 2rem 2rem',
        }}
      >
        <BoldHeader>Rebalance</BoldHeader>
        <Row style={{ flexWrap: 'nowrap' }}>
          {rebalanceStep === 'initial' && rebalanceTransactionsLoaded && (
            <ReloadTimer
              duration={20}
              callback={() => {
                updateTransactionsList({
                  wallet,
                  connection,
                  tokensMap,
                  allMarketsMap,
                })
              }}
            />
          )}
          <CloseIconContainer
            onClick={() => {
              close()
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 18L9.5 9.5M18 1L9.5 9.5M9.5 9.5L18 18L1 1"
                stroke="#F5F5FB"
                strokeWidth="2"
              />
            </svg>
          </CloseIconContainer>
        </Row>
      </RowContainer>
      <RowContainer style={{ maxHeight: '40rem', overflowY: 'scroll' }}>
        {rebalanceTransactionsList.map((el, i, arr) => {
          const numberOfFailedTransactionsBeforeCurrent = arr.filter(
            (el, subIndex) => isTransactionWithError(el) && subIndex <= i
          ).length

          const isTransactionCompleted =
            numberOfCompletedTransactions +
              numberOfFailedTransactionsBeforeCurrent >=
            i + 1

          const transactionState = getTransactionState({
            rebalanceStep,
            isTransactionCompleted,
          })

          return (
            <TransactionComponent
              key={`${el.symbol}${el.side}${el.price}${el.slippage}${el.total}${el.amount}`}
              symbol={el.symbol}
              slippage={el.slippage}
              price={el.price}
              amount={el.amount}
              total={el.total}
              side={el.side}
              market={el.loadedMarket}
              transactionState={transactionState}
              isNotEnoughLiquidity={el.isNotEnoughLiquidity}
              isLastTransaction={i === arr.length - 1}
            />
          )
        })}
      </RowContainer>
      <RowContainer>
        {rebalanceStep === 'initial' && (
          <RowContainer direction="column">
            {rebalanceTransactionsLoaded ? (
              <RowContainer padding="2rem 2rem 2rem 2rem" direction="column">
                <PopupFooter
                  totalFeesUSD={totalFeesUSD}
                  totalFeesSOL={totalFeesSOL}
                />
                <RowContainer margin="2rem 0 0 0">
                  <AttentionComponent text="You will need to confirm multiple transactions in pop-ups from your wallet." />
                </RowContainer>
              </RowContainer>
            ) : (
              <LoadingWithHint
                hintTextStyles={{ minHeight: '6rem' }}
                loadingText="Your transactions are being processed. It may take up to 30 seconds."
              />
            )}
            <RowContainer padding="3rem 2rem 0 2rem" justify="space-between">
              <Button
                onClick={() => {
                  close()
                  changeRebalanceStep('initial')
                }}
                $variant="primary"
                $padding="lg"
                $fontSize="md"
              >
                Cancel
              </Button>
              {isNotEnoughSOL ? (
                <DarkTooltip
                  title={
                    <>
                      <p>
                        Insufficient{' '}
                        {currentSOLAmount < totalFeesSOL ? '' : 'target'} SOL
                        balance to complete the rebalance.
                      </p>
                      <p>
                        Deposit some SOL to your wallet for successful
                        transactions.
                      </p>
                    </>
                  }
                >
                  <Row width="calc(50% - 1rem)">
                    <Placeholder height="6rem">
                      Insufficient{' '}
                      {currentSOLAmount < totalFeesSOL ? '' : 'target'} SOL
                      balance.
                      <SvgIcon src={Info} width="2rem" />
                    </Placeholder>
                  </Row>
                </DarkTooltip>
              ) : (
                <Button
                  onClick={executeRebalance}
                  disabled={isDisabled}
                  $variant="primary"
                  $padding="lg"
                  $fontSize="md"
                >
                  Start Rebalance
                </Button>
              )}
            </RowContainer>
          </RowContainer>
        )}

        {rebalanceStep === 'pending' && (
          <RowContainer>
            {showConfirmTradeButton ? (
              <RowContainer height="100%" direction="column">
                <RowContainer direction="column" margin="0 0 2rem 0">
                  <AttentionComponent text="You will need to confirm multiple transactions in pop-ups from your wallet. If a pop-up didn’t appear – press the button below. After signing a transaction click outside the pop-up. Repeat until the last transaction." />
                  <Button
                    onClick={() => {
                      window.open('', 'child')
                    }}
                    $variant="primary"
                    $padding="lg"
                    $fontSize="md"
                  >
                    Confirm Transaction
                  </Button>
                </RowContainer>
                <RowContainer direction="column" margin="2rem 0">
                  <Loading color="#F29C38" size="6rem" />
                  <Text style={{ marginTop: '1rem' }} color="#F29C38">
                    Pending...
                  </Text>
                </RowContainer>
              </RowContainer>
            ) : (
              <RowContainer margin="2rem 0 0 0">
                <AttentionComponent text="You will need to confirm multiple transactions in pop-ups from your wallet." />
              </RowContainer>
            )}
          </RowContainer>
        )}
        {rebalanceStep === 'done' && (
          <RowContainer height="100%" margin="4rem 0" direction="column">
            <SvgIcon src={GreenCheckMark} width="3rem" height="3rem" />{' '}
            <Text color={theme.colors.green7} style={{ marginTop: '1rem' }}>
              Done
            </Text>
          </RowContainer>
        )}
        {rebalanceStep === 'failed' && (
          <RowContainer height="100%" margin="4rem 0" direction="column">
            <SvgIcon src={RedCross} width="3rem" height="3rem" />{' '}
            <Text color={theme.palette.red3} style={{ marginTop: '1rem' }}>
              Failed
            </Text>
          </RowContainer>
        )}
      </RowContainer>
    </DialogWrapper>
  )
}
