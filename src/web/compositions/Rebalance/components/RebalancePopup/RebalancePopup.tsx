import React, { useState } from 'react'
import { Theme } from '@material-ui/core'
import { Connection, Transaction } from '@solana/web3.js'

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

import { TokenType, PoolInfo, RebalancePopupStep } from '../../Rebalance.types'
import { getRandomInt } from '@core/utils/helpers'
import { WalletAdapter } from '@sb/dexUtils/types'
import { sendAndConfirmTransactionViaWallet } from '@sb/dexUtils/token/utils/send-and-confirm-transaction-via-wallet'
import { StyledPaper } from './styles'

import { MOKED_MINTS_MAP } from '@sb/compositions/Rebalance/Rebalance.mock'
import { getPoolsSwaps, getTransactionsList } from '@sb/compositions/Rebalance/utils'
import { TransactionComponent } from './TransactionComponent'
import { PopupFooter } from './PopupFooter'


export const RebalancePopup = ({
  rebalanceStep,
  changeRebalanceStep,
  theme,
  open,
  close,
  tokensMap,
  getPoolsInfo,
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
  tokensMap: { [key: string]: TokenType }
  getPoolsInfo: PoolInfo[],
  wallet: WalletAdapter,
  connection: Connection,
  refreshRebalance: () => void,
  setLoadingRebalanceData: (loadingState: boolean) => void
}) => {

  const [pendingStateText, setPendingStateText] = useState('Pending')

  const tokensDiff: {
    symbol: string
    amountDiff: number
    decimalCount: number
    price: number
  }[] = Object.values(tokensMap)
    .map((el: TokenType) => ({
      symbol: el.symbol,
      amountDiff: +(el.targetAmount - el.amount).toFixed(el.decimalCount),
      decimalCount: el.decimalCount,
      price: el.price,
    }))
    .filter((el) => el.amountDiff !== 0)

  const poolsInfoProcessed = getPoolsInfo.map((el, i) => {
    return {
      // TODO: Check that place

      // symbol: el.name,
      symbol: `${MOKED_MINTS_MAP[el.tokenA]}_${MOKED_MINTS_MAP[el.tokenB]}`,
      slippage: getRandomInt(3, 3),
      // slippage: 0,
      price: el.tvl.tokenB / el.tvl.tokenA,
      tokenA: el.tvl.tokenA,
      tokenB: el.tvl.tokenB,
      tokenSwapPublicKey: el.swapToken,
    }
  })

  const rebalanceTransactionsList = getTransactionsList({
    tokensDiff,
    poolsInfo: poolsInfoProcessed,
    tokensMap,
  })

  console.log('rebalanceTransactionsList: ', rebalanceTransactionsList)

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
        <SvgIcon
          style={{ cursor: 'pointer' }}
          onClick={() => close()}
          src={Close}
        />
      </RowContainer>
      <RowContainer style={{ maxHeight: '40rem', overflowY: 'scroll' }}>
        {rebalanceTransactionsList.map((el) => (
          <TransactionComponent
            key={`${el.symbol}${el.side}${el.price}${el.slippage}`}
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
                    const swaps = getPoolsSwaps({ wallet, connection, transactionsList: rebalanceTransactionsList, tokensMap })
                    console.log('swaps: ', swaps)
                    setPendingStateText('Creating swaps...')
                    const promisedSwaps = await Promise.all(swaps.map(el => swap(el)))
                    console.log('promisedSwaps: ', promisedSwaps)
                    const swapsTransactions = promisedSwaps.map(el => el[0])
                    console.log('swapsTransactions: ', swapsTransactions)
                    const swapsSigns = promisedSwaps.map(el => el[1])
                    console.log('swapsSigns: ', swapsSigns)
  
  
                    setPendingStateText('Creating transaction...')
                    const commonTransaction = new Transaction().add(...swapsTransactions)
                    console.log('commonTransaction: ', commonTransaction)
  
                    setPendingStateText('Awaitng for Rebalance confirmation...')
                    await sendAndConfirmTransactionViaWallet(wallet, connection, commonTransaction, ...[...swapsSigns])
                    changeRebalanceStep('done')


                    setLoadingRebalanceData(true)
                    setTimeout(() => {
                      refreshRebalance()
                    }, 15000)
                    
                  } catch(e) {
                    changeRebalanceStep('failed')
                  }


                  setTimeout(() => {
                    changeRebalanceStep('initial')
                  }, 5000)
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
