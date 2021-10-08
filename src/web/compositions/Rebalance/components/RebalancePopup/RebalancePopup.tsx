import React, { useState, useEffect, useCallback } from 'react'
import { Theme } from '@material-ui/core'
import { Connection } from '@solana/web3.js'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader } from '@sb/compositions/Pools/components/Popups/index.styles'

import SvgIcon from '@sb/components/SvgIcon'
import AttentionComponent from '@sb/components/AttentionBlock'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components'

import GreenCheckMark from '@icons/greenDoneMark.svg'
import RedCross from '@icons/Cross.svg'

import { WalletAdapter } from '@sb/dexUtils/types'
import Info from '@icons/inform.svg'
import {
  MarketsMap,
  useAllMarketsList,
  useAllMarketsMapById,
} from '@sb/dexUtils/markets'
import { Placeholder } from '@sb/components/TraidingTerminal/styles'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { CCAIProviderURL } from '@sb/dexUtils/utils'
import {
  RebalancePopupStep,
  TokensMapType,
  TransactionType,
} from '../../Rebalance.types'
import { StyledPaper } from './styles'

import { ReloadTimer } from '../ReloadTimer'
import { TransactionComponent } from './TransactionComponent'
import { PopupFooter } from './PopupFooter'
import { getTransactionsListWithPrices } from '../../utils/getTransactionsListWithPrices'
import { placeAllOrders } from '../../utils/marketOrderProgram/placeAllOrders'
import { loadMarketOrderProgram } from '../../utils/marketOrderProgram/loadProgram'
import { LoadingWithHint } from './LoadingWithHint'
import { getTransactionState } from '../../utils/getTransactionState'
import { isTransactionWithError } from '../../utils/isTransactionWithError'

export const isWebWallet = (providerUrl: string) => {
  return (
    providerUrl === CCAIProviderURL || providerUrl === 'https://www.sollet.io'
  )
}

export const RebalancePopup = ({
  theme,
  open,
  close,
  tokensMap,
  wallet,
  connection,
  refreshRebalance,
  setLoadingRebalanceData,
}: {
  theme: Theme
  open: boolean
  close: () => void
  tokensMap: TokensMapType
  wallet: WalletAdapter
  connection: Connection
  refreshRebalance: () => void
  setLoadingRebalanceData: (loadingState: boolean) => void
}) => {
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
      theme={theme}
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
          <SvgIcon
            style={{ cursor: 'pointer' }}
            onClick={() => close()}
            src={Close}
          />
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
              theme={theme}
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
                  theme={theme}
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
                borderColor="#f2fbfb"
                btnColor="#fff"
                backgroundColor="none"
                textTransform="none"
                transition="all .4s ease-out"
                style={{ whiteSpace: 'nowrap' }}
              >
                Cancel
              </BtnCustom>
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
                <BtnCustom
                  theme={theme}
                  onClick={executeRebalance}
                  disabled={isDisabled}
                  needMinWidth={false}
                  btnWidth="calc(50% - 1rem)"
                  height="auto"
                  fontSize="1.4rem"
                  padding="1.5rem 0rem"
                  borderRadius="1.1rem"
                  borderColor={theme.palette.blue.serum}
                  btnColor="#fff"
                  backgroundColor={theme.palette.blue.serum}
                  textTransform="none"
                  transition="all .4s ease-out"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Start Rebalance
                </BtnCustom>
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
                  <BtnCustom
                    theme={theme}
                    onClick={() => {
                      window.open('', 'child')
                    }}
                    needMinWidth={false}
                    btnWidth="calc(50% - 1rem)"
                    height="auto"
                    fontSize="1.4rem"
                    padding="1.5rem 0rem"
                    margin="4rem 0 0 0"
                    borderRadius="1.1rem"
                    borderColor={theme.palette.blue.serum}
                    btnColor="#fff"
                    backgroundColor={theme.palette.blue.serum}
                    textTransform="none"
                    transition="all .4s ease-out"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Confirm Transaction
                  </BtnCustom>
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
            <Text
              color={theme.palette.green.main}
              style={{ marginTop: '1rem' }}
            >
              Done
            </Text>
          </RowContainer>
        )}
        {rebalanceStep === 'failed' && (
          <RowContainer height="100%" margin="4rem 0" direction="column">
            <SvgIcon src={RedCross} width="3rem" height="3rem" />{' '}
            <Text color={theme.palette.red.main} style={{ marginTop: '1rem' }}>
              Failed
            </Text>
          </RowContainer>
        )}
      </RowContainer>
    </DialogWrapper>
  )
}
