import React, { useMemo, useEffect, useState } from 'react'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core/styles'
import { TokenInstructions } from '@project-serum/serum'
import StepArrow from '@icons/StepArrow.png'

import { withPublicKey } from '@core/hoc/withPublicKey'
import { useWallet, WRAPPED_SOL_MINT } from '@sb/dexUtils/wallet'
import { ALL_TOKENS_MINTS_MAP } from '@sb/dexUtils/markets'

import {
  getPricesForTokens,
  getTokenValuesForTokens,
  getSortedTokensByValue,
  getTotalTokenValue,
  getPercentageAllocationForTokens,
  getAvailableTokensForRebalance,
  getTokensMap,
} from './utils'
import { useConnection } from '@sb/dexUtils/connection'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Text } from './Rebalance.styles'
import { PoolInfo } from './Rebalance.types'
import RebalanceTable from './components/Tables'
import RebalanceHeaderComponent from './components/Header'
import DonutChartWithLegend, {
  mockData,
} from '@sb/components/AllocationBlock/index'
import BalanceDistributedComponent from './components/BalanceDistributed'
import { RebalancePopup } from './components/RebalancePopup'

const mockedData = [
  {
    amount: 0.307,
    decimals: 6,
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    percentage: 2.793658965543384,
    price: 1,
    symbol: 'SRM',
    disabled: false,
    disabledReason: '',
  },
  {
    amount: 0.447,
    decimals: 6,
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    percentage: 2.793658965543384,
    price: 1,
    symbol: 'SOL',
    disabled: true,
    disabledReason: 'no pool',
  },
  {
    amount: 0.303,
    decimals: 6,
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    percentage: 2.793658965543384,
    price: 1,
    symbol: 'USDT',
    disabled: false,
    disabledReason: '',
  },
  {
    amount: 0.751,
    decimals: 6,
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    percentage: 2.793658965543384,
    price: 1,
    symbol: 'CCAI',
    disabled: true,
    disabledReason: 'no price',
  },
]

const RebalanceComposition = ({
  publicKey,
  theme,
  getPoolsInfoQuery: { getPoolsInfo },
}: {
  publicKey: string
  theme: Theme
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
}) => {
  const { wallet } = useWallet()
  const [isRebalancePopupOpen, changeRebalancePopupState] = useState(false)
  const [rebalanceStep, changeRebalanceStep] = useState('')

  // const [publicKeys = []] = useWalletPublicKeys();
  // console.log('publicKeys: ', publicKeys)

  const connection: Connection = useConnection()
  const isWalletConnected = !!wallet?.publicKey

  const [tokensMap, setTokensMap] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetchData: ', fetchData)

      try {
        console.time('rebalance initial data set time')
        const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
          wallet.publicKey,
          { programId: TokenInstructions.TOKEN_PROGRAM_ID }
        )
        const solBalance =
          (await connection.getBalance(wallet.publicKey)) / LAMPORTS_PER_SOL
        const SOLToken = {
          symbol: 'SOL',
          amount: solBalance,
          decimals: 8,
          mint: TokenInstructions.WRAPPED_SOL_MINT,
        }

        const parsedTokensData = parsedTokenAccounts.value.map((el) => ({
          symbol: ALL_TOKENS_MINTS_MAP[el.account.data.parsed.info.mint]
            ? ALL_TOKENS_MINTS_MAP[el.account.data.parsed.info.mint]
            : el.account.data.parsed.info.mint,
          decimals: el.account.data.parsed.info.tokenAmount.decimals,
          amount: el.account.data.parsed.info.tokenAmount.uiAmount,
          mint: el.account.data.parsed.info.mint,
        }))

        const allTokensData = [SOLToken, ...parsedTokensData]

        const tokensWithPrices = await getPricesForTokens(allTokensData)
        const tokensWithTokenValue = getTokenValuesForTokens(tokensWithPrices)
        const sortedTokensByTokenValue = getSortedTokensByValue(
          tokensWithTokenValue
        )

        const totalTokenValue = getTotalTokenValue(sortedTokensByTokenValue)
        // console.log('totalTokenValue: ', totalTokenValue)

        const tokensWithPercentages = getPercentageAllocationForTokens(
          sortedTokensByTokenValue,
          totalTokenValue
        )
        // console.log('tokensWithPercentages', tokensWithPercentages)

        // console.log('getPoolsInfo: ', getPoolsInfo)

        // TODO: Can be splitted and move up
        const availableTokensForRebalance = getAvailableTokensForRebalance(
          getPoolsInfo,
          tokensWithPercentages
        )
        const availableTokensForRebalanceMap = getTokensMap(
          availableTokensForRebalance
        )

        setTokensMap(availableTokensForRebalanceMap)

        // console.log('availableTokensForRebalanceMap: ', availableTokensForRebalanceMap)
        console.timeEnd('rebalance initial data set time')
      } catch (e) {
        // set error
        console.log('e: ', e)
      }
    }

    if (isWalletConnected) {
      fetchData()
    }
  }, [wallet.publicKey])

  return (
    <RowContainer
      theme={theme}
      height="100%"
      style={{ background: theme.palette.grey.additional }}
    >
      {!publicKey ? (
        <>
          {/* connect wallet */}
          <BtnCustom
            theme={theme}
            onClick={wallet.connect}
            needMinWidth={false}
            btnWidth="auto"
            height="auto"
            fontSize="1.4rem"
            padding="2rem 8rem"
            borderRadius="1.1rem"
            borderColor={theme.palette.blue.serum}
            btnColor={'#fff'}
            backgroundColor={theme.palette.blue.serum}
            textTransform={'none'}
            margin={'4rem 0 0 0'}
            transition={'all .4s ease-out'}
            style={{ whiteSpace: 'nowrap' }}
          >
            Connect wallet
          </BtnCustom>
        </>
      ) : (
        <RowContainer theme={theme} height="100%" padding={'6rem 0'}>
          <Row
            height="100%"
            direction={'column'}
            width={'55%'}
            margin={'0 2rem 0 0'}
            justify={'space-between'}
          >
            <RebalanceHeaderComponent />
            <RebalanceTable mockedData={mockedData} theme={theme} />
          </Row>
          <Row
            height={'100%'}
            width={'35%'}
            direction="column"
            justify="space-between"
          >
            <RowContainer height={'calc(85% - 2rem)'}>
              <DonutChartWithLegend
                theme={theme}
                data={mockData}
                id={'current'}
              />
              <DonutChartWithLegend
                theme={theme}
                data={mockData}
                id={'target'}
              />
            </RowContainer>
            <RowContainer
              justify={'space-between'}
              align={'flex-end'}
              height={'16%'}
            >
              {' '}
              <Row
                align={'flex-end'}
                height={'100%'}
                width={'calc(45% - 1rem)'}
              >
                <BalanceDistributedComponent theme={theme} />
              </Row>
              <BtnCustom
                theme={theme}
                onClick={() => {
                  changeRebalancePopupState(true)
                }}
                needMinWidth={false}
                btnWidth="calc(55% - 1rem)"
                height="100%"
                fontSize="1.4rem"
                padding="2rem 8rem"
                borderRadius="1.6rem"
                borderColor={theme.palette.blue.serum}
                btnColor={'#fff'}
                backgroundColor={theme.palette.blue.serum}
                textTransform={'none'}
                transition={'all .4s ease-out'}
                padding={'2rem'}
                style={{ whiteSpace: 'nowrap' }}
              >
                Rebalance Now
              </BtnCustom>
            </RowContainer>
          </Row>
        </RowContainer>
      )}

      <RebalancePopup
        theme={theme}
        open={isRebalancePopupOpen}
        rebalanceStep={rebalanceStep}
        changeRebalanceStep={changeRebalanceStep}
        close={() => changeRebalancePopupState(false)}
      />
    </RowContainer>
  )
}

export default compose(
  withTheme(),
  withPublicKey,
  queryRendererHoc({
    query: getPoolsInfo,
    name: 'getPoolsInfoQuery',
    fetchPolicy: 'cache-and-network',
  })
)(RebalanceComposition)
