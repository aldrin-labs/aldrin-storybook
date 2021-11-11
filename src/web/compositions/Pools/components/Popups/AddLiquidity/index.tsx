import React, { useEffect, useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, Line, StyledPaper } from '../index.styles'
import SvgIcon from '@sb/components/SvgIcon'
import Info from '@icons/TooltipImg.svg'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { InputWithCoins, InputWithTotal } from '../components'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { PublicKey } from '@solana/web3.js'
import {
  DexTokensPrices,
  PoolInfo,
  PoolWithOperation,
} from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { notify } from '@sb/dexUtils/notifications'
import AttentionComponent from '@sb/components/AttentionBlock'
import { SelectSeveralAddressesPopup } from '../SelectorForSeveralAddresses'
import { createBasket } from '@sb/dexUtils/pools/createBasket'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { Button } from '../../Tables/index.styles'
import { ReloadTimer } from '@sb/compositions/Rebalance/components/ReloadTimer'
import { usePoolBalances } from '@sb/dexUtils/pools/usePoolBalances'
import { RefreshFunction } from '@sb/dexUtils/types'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { getFarmingStateDailyFarmingValue } from '../../Tables/UserLiquidity/utils/getFarmingStateDailyFarmingValue'
import { StakePopup } from '../Staking/StakePopup'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { sleep } from '@sb/dexUtils/utils'
import { costOfAddingToken } from '@sb/components/TraidingTerminal/utils'

export const AddLiquidityPopup = ({
  theme,
  open,
  poolsInfo,
  dexTokensPricesMap,
  selectedPool,
  allTokensData,
  close,
  refreshAllTokensData,
  setPoolWaitingForUpdateAfterOperation,
  farmingTicketsMap,
  refreshTokensWithFarmingTickets,
  setIsRemindToStakePopupOpen,
}: {
  theme: Theme
  open: boolean
  poolsInfo: PoolInfo[]
  dexTokensPricesMap: Map<string, DexTokensPrices>
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  close: () => void
  refreshAllTokensData: RefreshFunction
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
  farmingTicketsMap: Map<string, FarmingTicket[]>
  refreshTokensWithFarmingTickets: RefreshFunction
  setIsRemindToStakePopupOpen: any
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [poolBalances, refreshPoolBalances] = usePoolBalances({
    pool: selectedPool,
    connection,
  })

  const {
    baseTokenAmount: poolAmountTokenA,
    quoteTokenAmount: poolAmountTokenB,
  } = poolBalances

  // update entered value on every pool ratio change
  useEffect(() => {
    if (!selectedPool) return

    const newQuote = stripDigitPlaces(
      +baseAmount * (poolAmountTokenB / poolAmountTokenA),
      8
    )

    if (baseAmount && newQuote) {
      setQuoteAmount(newQuote)
    }
  }, [poolBalances])

  const [baseAmount, setBaseAmount] = useState<string | number>('')
  const setBaseAmountWithQuote = (baseAmount: string | number) => {
    const quoteAmount = stripDigitPlaces(
      +baseAmount * (poolAmountTokenB / poolAmountTokenA),
      8
    )

    setBaseAmount(baseAmount)
    if (poolAmountTokenA !== 0 && poolAmountTokenB !== 0) {
      setQuoteAmount(quoteAmount)
    }
  }

  const [quoteAmount, setQuoteAmount] = useState<string | number>('')
  const setQuoteAmountWithBase = (quoteAmount: string | number) => {
    const baseAmount = stripDigitPlaces(
      +quoteAmount * (poolAmountTokenA / poolAmountTokenB),
      8
    )

    if (poolAmountTokenA !== 0 && poolAmountTokenB !== 0) {
      setBaseAmount(baseAmount)
    }
    setQuoteAmount(quoteAmount)
  }

  // if user has more than one token for one mint
  const [
    selectedBaseTokenAddressFromSeveral,
    setBaseTokenAddressFromSeveral,
  ] = useState<string>('')
  const [
    selectedQuoteTokenAddressFromSeveral,
    setQuoteTokenAddressFromSeveral,
  ] = useState<string>('')

  const [
    isSelectorForSeveralBaseAddressesOpen,
    setIsSelectorForSeveralBaseAddressesOpen,
  ] = useState(false)
  const [
    isSelectorForSeveralQuoteAddressesOpen,
    setIsSelectorForSeveralQuoteAddressesOpen,
  ] = useState(false)

  useEffect(() => {
    const isSeveralBaseAddresses =
      allTokensData.filter((el) => el.mint === selectedPool.tokenA).length > 1

    const isSeveralQuoteAddresses =
      allTokensData.filter((el) => el.mint === selectedPool.tokenB).length > 1

    setIsSelectorForSeveralBaseAddressesOpen(isSeveralBaseAddresses)
    setIsSelectorForSeveralQuoteAddressesOpen(isSeveralQuoteAddresses)
  }, [])

  const [warningChecked, setWarningChecked] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)

  const {
    address: userTokenAccountA,
    amount: maxBaseAmount,
    decimals: baseTokenDecimals,
  } = getTokenDataByMint(
    allTokensData,
    selectedPool.tokenA,
    selectedBaseTokenAddressFromSeveral
  )

  const {
    address: userTokenAccountB,
    amount: maxQuoteAmount,
    decimals: quoteTokenDecimals,
  } = getTokenDataByMint(
    allTokensData,
    selectedPool.tokenB,
    selectedQuoteTokenAddressFromSeveral
  )

  const {
    amount: poolTokenRawAmount,
    address: userPoolTokenAccount,
    decimals: poolTokenDecimals,
  } = getTokenDataByMint(allTokensData, selectedPool.poolTokenMint)

  const baseSymbol = getTokenNameByMintAddress(selectedPool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(selectedPool.tokenB)

  // for cases with SOL token
  const isBaseTokenSOL = baseSymbol === 'SOL'
  const isQuoteTokenSOL = quoteSymbol === 'SOL'

  const isPoolWithSOLToken = isBaseTokenSOL || isQuoteTokenSOL

  const isNativeSOLSelected =
    allTokensData[0]?.address === userTokenAccountA ||
    allTokensData[0]?.address === userTokenAccountB

  const isNeedToLeftSomeSOL =
    isBaseTokenSOL && isNativeSOLSelected
      ? maxBaseAmount - +baseAmount < 0.1
      : isQuoteTokenSOL && isNativeSOLSelected
      ? maxQuoteAmount - +quoteAmount < 0.1
      : false

  const [withdrawAmountTokenA, withdrawAmountTokenB] = calculateWithdrawAmount({
    selectedPool,
    poolTokenAmount: poolTokenRawAmount * 10 ** poolTokenDecimals,
  })

  const isDisabled =
    !warningChecked ||
    +baseAmount <= 0 ||
    +quoteAmount <= 0 ||
    operationLoading ||
    baseAmount > maxBaseAmount ||
    quoteAmount > maxQuoteAmount

  const baseTokenPrice =
    (
      dexTokensPricesMap.get(selectedPool.tokenA) ||
      dexTokensPricesMap.get(baseSymbol)
    )?.price || 0

  const quoteTokenPrice =
    (
      dexTokensPricesMap.get(selectedPool.tokenB) ||
      dexTokensPricesMap.get(quoteSymbol)
    )?.price || 0

  const total = +baseAmount * baseTokenPrice + +quoteAmount * quoteTokenPrice
  const tvlUSD =
    baseTokenPrice * selectedPool.tvl.tokenA +
    quoteTokenPrice * selectedPool.tvl.tokenB

  const isPoolWithFarming =
    selectedPool.farming && selectedPool.farming.length > 0
  const openFarmings = isPoolWithFarming
    ? filterOpenFarmingStates(selectedPool.farming)
    : []

  const poolTokenPrice = calculatePoolTokenPrice({
    pool: selectedPool,
    dexTokensPricesMap,
  })

  const totalStakedLpTokensUSD =
    selectedPool.lpTokenFreezeVaultBalance * poolTokenPrice

  const totalFarmingDailyRewardsUSD = openFarmings.reduce(
    (acc, farmingState) => {
      const farmingStateDailyFarmingValuePerThousandDollarsLiquidity = getFarmingStateDailyFarmingValue(
        { farmingState, totalStakedLpTokensUSD }
      )

      const farmingTokenSymbol = getTokenNameByMintAddress(
        farmingState.farmingTokenMint
      )

      const farmingTokenPrice =
        dexTokensPricesMap.get(farmingTokenSymbol)?.price || 0

      const farmingStateDailyFarmingValuePerThousandDollarsLiquidityUSD =
        farmingStateDailyFarmingValuePerThousandDollarsLiquidity *
        farmingTokenPrice

      return acc + farmingStateDailyFarmingValuePerThousandDollarsLiquidityUSD
    },
    0
  )

  const farmingAPR =
    ((totalFarmingDailyRewardsUSD * 365) / totalStakedLpTokensUSD) * 100

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      onEnter={() => {
        const isSeveralBaseAddresses =
          allTokensData.filter((el) => el.mint === selectedPool.tokenA).length >
          1

        const isSeveralQuoteAddresses =
          allTokensData.filter((el) => el.mint === selectedPool.tokenB).length >
          1

        setBaseTokenAddressFromSeveral('')
        setQuoteTokenAddressFromSeveral('')
        setBaseAmount('')
        setQuoteAmount('')
        setWarningChecked(false)
        setOperationLoading(false)
        setIsSelectorForSeveralBaseAddressesOpen(isSeveralBaseAddresses)
        setIsSelectorForSeveralQuoteAddressesOpen(isSeveralQuoteAddresses)
      }}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <Row justify={'space-between'} width={'100%'}>
        <BoldHeader style={{ margin: '0 0 2rem 0' }}>
          Deposit Liquidity
        </BoldHeader>
        <Row>
          <ReloadTimer
            margin={'0 1.5rem 0 0'}
            callback={async () => {
              if (!operationLoading) {
                refreshPoolBalances()
              }
            }}
          />
          <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
        </Row>
      </Row>
      <RowContainer>
        <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
          Enter the amount of the first coin you wish to add, the second coin
          will adjust according to the match of a pool ratio.
        </Text>
      </RowContainer>
      <RowContainer>
        <InputWithCoins
          placeholder={'0'}
          theme={theme}
          value={baseAmount}
          onChange={setBaseAmountWithQuote}
          symbol={baseSymbol}
          alreadyInPool={withdrawAmountTokenA}
          maxBalance={maxBaseAmount}
          needAlreadyInPool={false}
        />
        <Row>
          <Text fontSize={'4rem'} fontFamily={'Avenir Next Medium'}>
            +
          </Text>
        </Row>
        <InputWithCoins
          placeholder={'0'}
          theme={theme}
          value={quoteAmount}
          onChange={setQuoteAmountWithBase}
          symbol={quoteSymbol}
          alreadyInPool={withdrawAmountTokenB}
          maxBalance={maxQuoteAmount}
          needAlreadyInPool={false}
        />
        <Line />
        <InputWithTotal theme={theme} value={total} />
      </RowContainer>

      {!userPoolTokenAccount && (
        <RowContainer justify={'space-between'} margin={'2rem 0 0 0'}>
          <WhiteText>Gas Fees</WhiteText>
          <WhiteText
            style={{
              color: theme.palette.green.main,
            }}
          >
            {costOfAddingToken} SOL
          </WhiteText>
        </RowContainer>
      )}

      <Row
        margin={'2rem 0 1rem 0'}
        align={'flex-start'}
        justify={'space-between'}
      >
        <Row direction={'column'} align={'flex-start'} justify="flex-start">
          <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
            Total Value Locked:
          </Text>
          <Row>
            <Text fontSize={'1.5rem'}>
              {formatNumberToUSFormat(
                stripDigitPlaces(selectedPool.tvl.tokenA, 2)
              )}{' '}
              {getTokenNameByMintAddress(selectedPool.tokenA)} /{' '}
              {formatNumberToUSFormat(
                stripDigitPlaces(selectedPool.tvl.tokenB, 2)
              )}{' '}
              {getTokenNameByMintAddress(selectedPool.tokenB)}
            </Text>
            <Text
              fontSize={'1.5rem'}
              color={'#53DF11'}
              fontFamily={'Avenir Next Demi'}
              style={{ marginLeft: '1rem' }}
            >
              ${stripByAmountAndFormat(tvlUSD)}
            </Text>
          </Row>
        </Row>
        <Row direction={'column'} align="flex-end">
          <Row wrap="nowrap" margin={'0 0 1rem 0'}>
            <Text style={{ whiteSpace: 'nowrap' }} fontSize={'1.4rem'}>
              APR{' '}
            </Text>{' '}
            <DarkTooltip
              title={
                'Estimation for growth of your deposit over a year, projected based on trading activity in the past 24h not taking into account the reward for farming.'
              }
            >
              <div>
                <SvgIcon
                  src={Info}
                  width={'1.5rem'}
                  height={'auto'}
                  style={{ marginLeft: '1rem' }}
                />
              </div>
            </DarkTooltip>
          </Row>

          <Row>
            <Text
              fontSize={'1.5rem'}
              color={'#53DF11'}
              fontFamily={'Avenir Next Demi'}
            >
              {formatNumberToUSFormat(
                stripDigitPlaces(+selectedPool.apy24h + farmingAPR, 2)
              )}
              %
            </Text>
          </Row>
        </Row>
      </Row>

      {(isNeedToLeftSomeSOL ||
        baseAmount > maxBaseAmount ||
        quoteAmount > maxQuoteAmount) && (
        <RowContainer margin={'2rem 0 0 0'}>
          <AttentionComponent
            text={
              isNeedToLeftSomeSOL
                ? 'Sorry, but you need to leave some SOL (at least 0.1 SOL) on your wallet SOL account to successfully execute further transactions.'
                : baseAmount > maxBaseAmount
                ? `You entered more token ${baseSymbol} amount than you have.`
                : quoteAmount > maxQuoteAmount
                ? `You entered more ${quoteSymbol} amount than you have.`
                : ''
            }
            blockHeight={'8rem'}
          />
        </RowContainer>
      )}
      <RowContainer justify="space-between" margin={'2rem 0 0 0'}>
        <Row
          width={'60%'}
          justify="space-between"
          wrap={'nowrap'}
          padding={'0 2rem 0 0'}
        >
          <SCheckbox
            id={'warning_checkbox'}
            style={{ padding: 0, marginRight: '1rem' }}
            onChange={() => setWarningChecked(!warningChecked)}
            checked={warningChecked}
          />
          <label htmlFor={'warning_checkbox'}>
            <WhiteText
              style={{
                cursor: 'pointer',
                color: '#F2ABB1',
                fontSize: '1.12rem',
                fontFamily: 'Avenir Next Medium',
                letterSpacing: '0.01rem',
              }}
            >
              I understand the risks of providing liquidity, and that I could
              lose money to impermanent loss.
            </WhiteText>
          </label>
        </Row>
        <Button
          style={{ width: '40%', fontFamily: 'Avenir Next Medium' }}
          disabled={isDisabled}
          isUserConfident={true}
          showLoader={operationLoading}
          theme={theme}
          onClick={async () => {
            const userBaseTokenAmount = +baseAmount * 10 ** baseTokenDecimals
            const userQuoteTokenAmount = +quoteAmount * 10 ** quoteTokenDecimals

            if (
              !userTokenAccountA ||
              !userTokenAccountB ||
              !userBaseTokenAmount ||
              !userQuoteTokenAmount
            ) {
              notify({
                message: `Sorry, something went wrong with your amount of ${
                  !userTokenAccountA ? 'tokenA' : 'tokenB'
                }`,
                type: 'error',
              })

              console.log('base data', {
                userTokenAccountA,
                userTokenAccountB,
                baseTokenDecimals,
                quoteTokenDecimals,
                userBaseTokenAmount,
                userQuoteTokenAmount,
              })

              return
            }

            console.log('userPoolTokenAccount', userPoolTokenAccount)

            // loader in popup button
            setOperationLoading(true)
            // loader in table button
            setPoolWaitingForUpdateAfterOperation({
              pool: selectedPool.swapToken,
              operation: 'deposit',
            })

            const result = await createBasket({
              wallet,
              connection,
              isStablePool: selectedPool.isStablePool,
              poolPublicKey: new PublicKey(selectedPool.swapToken),
              userBaseTokenAmount,
              userQuoteTokenAmount,
              userBaseTokenAccount: new PublicKey(userTokenAccountA),
              userQuoteTokenAccount: new PublicKey(userTokenAccountB),
              ...(userPoolTokenAccount
                ? { userPoolTokenAccount: new PublicKey(userPoolTokenAccount) }
                : { userPoolTokenAccount: null }),
              transferSOLToWrapped: isPoolWithSOLToken && isNativeSOLSelected,
            })

            setOperationLoading(false)

            notify({
              type: result === 'success' ? 'success' : 'error',
              message:
                result === 'success'
                  ? 'Deposit successful'
                  : result === 'failed'
                  ? 'Deposit failed, please try again or contact us in telegram.'
                  : 'Deposit cancelled',
            })

            refreshPoolBalances()

            const clearPoolWaitingForUpdate = () =>
              setPoolWaitingForUpdateAfterOperation({
                pool: '',
                operation: '',
              })

            if (result === 'success') {
              setTimeout(async () => {
                refreshAllTokensData()
                clearPoolWaitingForUpdate()
                if (openFarmings.length > 0) {
                  await sleep(3000)
                  setIsRemindToStakePopupOpen()
                }
              }, 7500)
              // end button loader

              setTimeout(() => refreshAllTokensData(), 15000)
            } else {
              clearPoolWaitingForUpdate()
            }

            close()
          }}
        >
          Deposit liquidity
        </Button>
      </RowContainer>
      <SelectSeveralAddressesPopup
        theme={theme}
        tokens={allTokensData.filter((el) => el.mint === selectedPool.tokenA)}
        open={isSelectorForSeveralBaseAddressesOpen}
        close={() => setIsSelectorForSeveralBaseAddressesOpen(false)}
        selectTokenMintAddress={() => {}}
        selectTokenAddressFromSeveral={setBaseTokenAddressFromSeveral}
      />
      <SelectSeveralAddressesPopup
        theme={theme}
        tokens={allTokensData.filter((el) => el.mint === selectedPool.tokenB)}
        open={isSelectorForSeveralQuoteAddressesOpen}
        close={() => setIsSelectorForSeveralQuoteAddressesOpen(false)}
        selectTokenMintAddress={() => {}}
        selectTokenAddressFromSeveral={setQuoteTokenAddressFromSeveral}
      />
    </DialogWrapper>
  )
}
