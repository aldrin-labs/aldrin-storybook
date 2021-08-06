import React, { useState, useEffect, useCallback } from 'react'
import { Theme } from '@material-ui/core'
import { Connection } from '@solana/web3.js'

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
import { StyledPaper } from './styles'

import { RawMarketData, useAllMarketsList } from '@sb/dexUtils/markets'
import { ReloadTimer } from '../ReloadTimer'
import { TransactionComponent } from './TransactionComponent'
import { PopupFooter } from './PopupFooter'
import { getTransactionsListWithPrices } from '../../utils/getTransactionsListWithPrices'
import { placeAllOrders } from '../../utils/marketOrderProgram/placeAllOrders'
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
      wallet,
      connection,
      marketsData,
      tokensDiff,
      tokensMap,
      allMarketsMap,
    }: {
      wallet: WalletAdapter
      connection: Connection
      marketsData: MarketData[]
      tokensDiff: TokensDiff
      tokensMap: TokensMapType
      allMarketsMap: Map<string, RawMarketData>
    }) => {
      // transactions with all prices
      const rebalanceAllTransactionsListWithPrices = await getTransactionsListWithPrices(
        {
          wallet,
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
    [wallet?.publicKey?.toString(), JSON.stringify([...allMarketsMap.values()])]
  )

  // only on markets update
  useEffect(() => {
    updateTransactionsList({
      wallet,
      connection,
      marketsData,
      tokensDiff,
      tokensMap,
      allMarketsMap,
    })
  }, [updateTransactionsList])

  const currentSOLAmount = tokensMap['SOL'].amount
  const targetSOLAmount = tokensMap['SOL'].targetAmount

  const totalFeesUSD = rebalanceTransactionsList.reduce(
    (acc, el) => el.feeUSD + acc,
    0
  )

  const totalFeesSOL =
    rebalanceTransactionsList.reduce((acc, el, i, arr) => {
      const placeOrderAndSettleFee = 0.00001

      // if we have two transactions on one market without user's openOrders account,
      // we'll create it only once
      const isOpenOrdersAccountCreated =
        arr.findIndex((transaction) => transaction.symbol === el.symbol) === i

      const createOpenOrdersAccountFee =
        el.openOrders.length === 0 && !isOpenOrdersAccountCreated ? 0.0239 : 0

      return acc + placeOrderAndSettleFee + createOpenOrdersAccountFee
    }, 0)

  const isNotEnoughSOL =
    totalFeesSOL > currentSOLAmount || totalFeesSOL > targetSOLAmount

  const isDisabled = rebalanceTransactionsList.length === 0 || isNotEnoughSOL

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
              if (
                rebalanceStep === 'initial' &&
                rebalanceTransactionsList.length !== 0
              ) {
                updateTransactionsList({
                  wallet,
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
            amount={el.amount}
            total={el.total}
            side={el.side}
            theme={theme}
            market={el.loadedMarket}
            isNotEnoughLiquidity={el.isNotEnoughLiquidity}
          />
        ))}
      </RowContainer>
      <RowContainer
        style={{ borderTop: '.1rem solid #383B45' }}
        padding={'2rem 2rem 0 2rem'}
      >
        {isNotEnoughSOL ? (
          <Text color={theme.palette.red.main} style={{ margin: '1rem 0' }}>
            {`Not enough ${
              totalFeesSOL > targetSOLAmount ? 'target ' : ''
            }SOL amount to cover fees.`}
          </Text>
        ) : null}
        {rebalanceStep === 'initial' && (
          <RowContainer direction={'column'}>
            <PopupFooter
              theme={theme}
              totalFeesUSD={totalFeesUSD}
              totalFeesSOL={totalFeesSOL}
            />
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
                Cancel
              </BtnCustom>
              <BtnCustom
                theme={theme}
                onClick={async () => {
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
                    })

                    await changeRebalanceStep('done')
                    await setLoadingRebalanceData(true)
                    await setTimeout(async () => {
                      await refreshRebalance()
                      await close()
                    }, 5000)
                  } catch (e) {
                    console.log('e: ', e)
                    changeRebalanceStep('failed')
                  }
                }}
                disabled={isDisabled}
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
                {totalFeesSOL > currentSOLAmount
                  ? 'Insufficient SOL balance'
                  : totalFeesSOL > targetSOLAmount
                  ? 'Insufficient target SOL balance'
                  : 'Start Rebalance'}
              </BtnCustom>
            </RowContainer>
          </RowContainer>
        )}
        {rebalanceStep === 'pending' && (
          <RowContainer
            style={{ height: '100%', alignItems: 'center', display: 'flex' }}
            direction={'column'}
          >
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
