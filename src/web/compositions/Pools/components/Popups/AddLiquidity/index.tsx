import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import Close from '@icons/closeIcon.svg'
import Info from '@icons/TooltipImg.svg'
import { Theme, withTheme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import AttentionComponent from '@sb/components/AttentionBlock'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { costOfAddingToken } from '@sb/components/TraidingTerminal/utils'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  DexTokensPrices,
  PoolInfo,
  PoolWithOperation,
} from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { ReloadTimer } from '@sb/compositions/Rebalance/components/ReloadTimer'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { useConnection } from '@sb/dexUtils/connection'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { createBasket } from '@sb/dexUtils/pools/actions/createBasket'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { usePoolBalances } from '@sb/dexUtils/pools/hooks/usePoolBalances'
import { RefreshFunction } from '@sb/dexUtils/types'
import { sleep } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'
import { PublicKey } from '@solana/web3.js'
import React, { useEffect, useState } from 'react'
import { COLORS } from '@variables/variables'
import { Button } from '../../Tables/index.styles'
import { getFarmingStateDailyFarmingValue } from '../../Tables/UserLiquidity/utils/getFarmingStateDailyFarmingValue'
import { InputWithCoins, InputWithTotal } from '../components'
import { BoldHeader, Line, StyledPaper } from '../index.styles'
import { SelectSeveralAddressesPopup } from '../SelectorForSeveralAddresses'
import { findClosestAmountToSwapForDeposit } from '@sb/dexUtils/pools/swap/findClosestAmountToSwapForDeposit'
import { createBasketWithSwap } from '@sb/dexUtils/pools/actions/createBasketWithSwap'
import { Checkbox } from '@sb/components/Checkbox'
import { WarningLabel } from './AddLiquidity.styles'
interface AddLiquidityPopupProps {
  theme: Theme
  dexTokensPricesMap: Map<string, DexTokensPrices>
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  close: () => void
  refreshAllTokensData: RefreshFunction
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
  setIsRemindToStakePopupOpen: () => void
}

const AddLiquidityPopup: React.FC<AddLiquidityPopupProps> = (props) => {
  const {
    dexTokensPricesMap,
    selectedPool,
    allTokensData,
    close,
    refreshAllTokensData,
    setPoolWaitingForUpdateAfterOperation,
    setIsRemindToStakePopupOpen,
    theme,
  } = props
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

  const isPoolEmpty = poolAmountTokenA === 0 && poolAmountTokenB === 0

  const [quoteAmount, setQuoteAmount] = useState<string | number>('')
  const [baseAmount, setBaseAmount] = useState<string | number>('')

  const [autoRebalanceEnabled, setAutoRebalanceEnabled] = useState(true)

  const setBaseAmountWithQuote = (baseAmount: string | number) => {
    const quoteAmount = stripDigitPlaces(
      +baseAmount * (poolAmountTokenB / poolAmountTokenA),
      8
    )

    setBaseAmount(baseAmount)
    if (!isPoolEmpty && !autoRebalanceEnabled) {
      setQuoteAmount(quoteAmount)
    }
  }

  const setQuoteAmountWithBase = (quoteAmount: string | number) => {
    const baseAmount = stripDigitPlaces(
      +quoteAmount * (poolAmountTokenA / poolAmountTokenB),
      8
    )

    setQuoteAmount(quoteAmount)
    if (!isPoolEmpty && !autoRebalanceEnabled) {
      setBaseAmount(baseAmount)
    }
  }

  useEffect(() => {
    if (!autoRebalanceEnabled) {
      setBaseAmountWithQuote(baseAmount)
    }
  }, [autoRebalanceEnabled])

  // if user has more than one token for one mint
  const [selectedBaseTokenAddressFromSeveral, setBaseTokenAddressFromSeveral] =
    useState<string>('')
  const [
    selectedQuoteTokenAddressFromSeveral,
    setQuoteTokenAddressFromSeveral,
  ] = useState<string>('')

  const [
    isSelectorForSeveralBaseAddressesOpen,
    setIsSelectorForSeveralBaseAddressesOpen,
  ] = useState(
    allTokensData.filter((el) => el.mint === selectedPool.tokenA).length > 1
  )

  const [
    isSelectorForSeveralQuoteAddressesOpen,
    setIsSelectorForSeveralQuoteAddressesOpen,
  ] = useState(
    allTokensData.filter((el) => el.mint === selectedPool.tokenB).length > 1
  )

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

  const isImpermanentLossOnStablePool =
    baseSymbol === 'mSOL' && quoteSymbol === 'SOL'

  const isPoolWithoutImpermanentLoss =
    selectedPool.parsedName.includes('USDT') &&
    selectedPool.parsedName.includes('USDC')

  const isDisabled =
    (!warningChecked && !isPoolWithoutImpermanentLoss) ||
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

  const isPoolWithFarming =
    selectedPool.farming && selectedPool.farming.length > 0
  const openFarmings = isPoolWithFarming
    ? filterOpenFarmingStates(selectedPool.farming)
    : []

  return (
    <DialogWrapper
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
      open
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
          will adjust according to the match of the pool ratio.
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
        <RowContainer justify="space-between">
          <Text fontSize={'4rem'} fontFamily={'Avenir Next Medium'}>
            +
          </Text>
          <Row onClick={() => setAutoRebalanceEnabled(!autoRebalanceEnabled)}>
            <Checkbox
              onChange={() => {}}
              checked={isPoolEmpty ? false : autoRebalanceEnabled}
            />
            <Text>Auto-rebalance uneven amounts</Text>
            <DarkTooltip title="The amounts you specify will be automatically rebalanced to match the pool ratio. For example, if you want to deposit 0 RIN + 100 USDC, and pool ratio is 1 RIN = 10 USDC your actual deposit after rebalancing will be 5 RIN + 50 USDC. When withdrawing liquidity you will get the amount corresponding to the pool ratio at the moment of withdrawal. Auto-rebalance deposit does not protect against impermanent loss.">
              <span>
                <SvgIcon
                  src={Info}
                  width="1.5rem"
                  style={{ marginLeft: '1.5rem' }}
                />
              </span>
            </DarkTooltip>
          </Row>
        </RowContainer>
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
              color: COLORS.success,
            }}
          >
            {costOfAddingToken} SOL
          </WhiteText>
        </RowContainer>
      )}

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

      <RowContainer
        justify="space-between"
        margin={'2rem 0 0 0'}
        padding="2rem"
        style={{ background: '#303236', borderRadius: '1.2rem' }}
      >
        <Text fontSize={'1.2rem'} fontFamily="Avenir Next">
          {autoRebalanceEnabled
            ? 'The amounts you specify will be automatically rebalanced to match the pool ratio. For example, if you want to deposit 0 RIN + 100 USDC, and pool ratio is 1 RIN = 10 USDC your actual deposit after rebalancing will be 5 RIN + 50 USDC. When withdrawing liquidity you will get the amount corresponding to the pool ratio at the moment of withdrawal. Auto-rebalance deposit does not protect against impermanent loss.'
            : 'Start typing the amount in one of the fields above and the second field will fill in automatically. Enabling Auto-rebalance will allow you to deposit uneven amounts in a ratio that suits you.'}
        </Text>
      </RowContainer>

      <RowContainer justify="space-between" margin={'2rem 0 0 0'}>
        <Row
          width={'60%'}
          justify={isPoolWithoutImpermanentLoss ? 'center' : 'space-between'}
          wrap={'nowrap'}
          padding={'0 2rem 0 0'}
        >
          {isImpermanentLossOnStablePool && (
            <DarkTooltip title="Impermanent loss on a stable pool? As mSOL rises incrementally in value when compared with SOL, a very small amount of impermanent loss occurs. At the time of writing, the expected price difference per year would result impermanent loss being a fraction of a percent">
              <span>
                <SvgIcon
                  src={Info}
                  width="1.5rem"
                  style={{ marginRight: '1.5rem' }}
                />
              </span>
            </DarkTooltip>
          )}
          {isPoolWithoutImpermanentLoss ? (
            <>
              <WarningLabel $color={COLORS.success} style={{ cursor: 'auto' }}>
                No impermanent loss.
              </WarningLabel>
            </>
          ) : (
            <>
              <SCheckbox
                id={'warning_checkbox'}
                style={{ padding: 0, marginRight: '1rem' }}
                onChange={() => setWarningChecked(!warningChecked)}
                checked={warningChecked}
              />
              <label htmlFor={'warning_checkbox'}>
                <WarningLabel>
                  I understand the risks of providing liquidity, and that I
                  could lose money to impermanent loss.
                </WarningLabel>
              </label>
            </>
          )}
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

            const transferSOLToWrapped =
              isPoolWithSOLToken && isNativeSOLSelected
            let result = 'failed'

            if (autoRebalanceEnabled) {
              result = await createBasketWithSwap({
                wallet,
                connection,
                pool: selectedPool,
                poolBalances,
                userBaseTokenAmount: +baseAmount,
                userQuoteTokenAmount: +quoteAmount,
                userBaseTokenAccount: new PublicKey(userTokenAccountA),
                userQuoteTokenAccount: new PublicKey(userTokenAccountB),
                userPoolTokenAccount: userPoolTokenAccount
                  ? new PublicKey(userPoolTokenAccount)
                  : null,
                transferSOLToWrapped,
              })
            } else {
              result = await createBasket({
                wallet,
                connection,
                curveType: selectedPool.curveType,
                poolPublicKey: new PublicKey(selectedPool.swapToken),
                userBaseTokenAmount,
                userQuoteTokenAmount,
                userBaseTokenAccount: new PublicKey(userTokenAccountA),
                userQuoteTokenAccount: new PublicKey(userTokenAccountB),
                userPoolTokenAccount: userPoolTokenAccount
                  ? new PublicKey(userPoolTokenAccount)
                  : null,
                transferSOLToWrapped,
              })
            }

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

const WithTheme = withTheme()(AddLiquidityPopup)

export { WithTheme as AddLiquidityPopup }
