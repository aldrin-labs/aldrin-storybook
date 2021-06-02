import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, StyledPaper } from '../index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'
import { InputWithSelector } from '../components'
import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { SelectCoinPopup } from '../SelectCoin'
import { createTokenSwap } from '@sb/dexUtils/pools'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { PoolInfo, PoolsPrices } from '@sb/compositions/Pools/index.types'
import { notify } from '@sb/dexUtils/notifications'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

export const CreatePoolPopup = ({
  theme,
  open,
  allTokensData,
  poolsPrices,
  getPoolsInfoQuery,
  close,
  refreshAllTokensData
}: {
  theme: Theme
  open: boolean
  allTokensData: TokenInfo[]
  poolsPrices: PoolsPrices[]
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  close: () => void
  refreshAllTokensData: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [baseTokenMintAddress, setBaseTokenMintAddress] = useState<string>('')
  const [baseAmount, setBaseAmount] = useState<string | number>('')
  const setBaseAmountWithQuote = (baseAmount: string | number) => {
    const quoteAmount = stripDigitPlaces(
      (+baseAmount * baseTokenPrice) / quoteTokenPrice,
      8
    )
    setBaseAmount(baseAmount)
    // setQuoteAmount(quoteAmount)
  }

  const [quoteTokenMintAddress, setQuoteTokenMintAddress] = useState<string>('')
  const [quoteAmount, setQuoteAmount] = useState<string | number>('')
  const setQuoteAmountWithBase = (quoteAmount: string | number) => {
    const baseAmount = stripDigitPlaces(
      (+quoteAmount * quoteTokenPrice) / baseTokenPrice,
      8
    )
    // setBaseAmount(baseAmount)
    setQuoteAmount(quoteAmount)
  }

  const [isSelectCoinPopupOpen, setIsSelectCoinPopupOpen] = useState(false)
  const [isBaseTokenSelecting, setIsBaseTokenSelecting] = useState(false)

  const [warningChecked, setWarningChecked] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)

  const baseSymbol = baseTokenMintAddress
    ? getTokenNameByMintAddress(baseTokenMintAddress)
    : 'Select token'
  const quoteSymbol = quoteTokenMintAddress
    ? getTokenNameByMintAddress(quoteTokenMintAddress)
    : 'Select token'

  const mints = allTokensData.map((tokenInfo: TokenInfo) => tokenInfo.mint)
  const filteredMints = [...new Set(mints)];

  const baseTokenInfo = getTokenDataByMint(allTokensData, baseTokenMintAddress)
  const maxBaseAmount = baseTokenInfo?.amount || 0

  const quoteTokenInfo = getTokenDataByMint(
    allTokensData,
    quoteTokenMintAddress
  )
  const maxQuoteAmount = quoteTokenInfo?.amount || 0

  const { getPoolsInfo: pools = [] } = getPoolsInfoQuery || { getPoolsInfo: [] }
  const isPoolAlreadyExist = pools.find(
    (pool) =>
      pool.tokenA === baseTokenMintAddress &&
      pool.tokenB === quoteTokenMintAddress
  )

  const baseTokenPrice =
    poolsPrices.find(
      (tokenInfo) =>
        tokenInfo.symbol === baseTokenMintAddress ||
        tokenInfo.symbol === baseSymbol
    )?.price || 0

  const quoteTokenPrice =
    poolsPrices.find(
      (tokenInfo) =>
        tokenInfo.symbol === quoteTokenMintAddress ||
        tokenInfo.symbol === quoteSymbol
    )?.price || 0

  const isDisabled =
    !warningChecked ||
    +baseAmount <= 0 ||
    +quoteAmount <= 0 ||
    operationLoading ||
    baseAmount > maxBaseAmount ||
    quoteAmount > maxQuoteAmount

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
      <RowContainer justify={'space-between'}>
        <BoldHeader>Create Pool</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer margin={'2rem 0'} justify={'space-between'}>
        <Text color={theme.palette.grey.title}>Market Price:</Text>
        {baseTokenMintAddress && quoteTokenMintAddress && (
          <Text
            fontSize={'2rem'}
            color={'#A5E898'}
            fontFamily={'Avenir Next Demi'}
          >
            1 {baseSymbol} ={' '}
            {stripDigitPlaces(baseTokenPrice / quoteTokenPrice, 2)}{' '}
            {quoteSymbol}
          </Text>
        )}
      </RowContainer>
      <RowContainer>
        <InputWithSelector
          theme={theme}
          value={baseAmount}
          onChange={setBaseAmountWithQuote}
          symbol={baseSymbol}
          // disabled={!baseTokenPrice}
          maxBalance={maxBaseAmount}
          openSelectCoinPopup={() => {
            setIsBaseTokenSelecting(true)
            setIsSelectCoinPopupOpen(true)
          }}
        />
        <Row>
          <Text fontSize={'4rem'} fontFamily={'Avenir Next Medium'}>
            +
          </Text>
        </Row>
        <InputWithSelector
          theme={theme}
          value={quoteAmount}
          onChange={setQuoteAmountWithBase}
          symbol={quoteSymbol}
          // disabled={!quoteTokenPrice}
          maxBalance={maxQuoteAmount}
          openSelectCoinPopup={() => {
            setIsBaseTokenSelecting(false)
            setIsSelectCoinPopupOpen(true)
          }}
        />
      </RowContainer>
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
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
        <BlueButton
          style={{ width: '40%', fontFamily: 'Avenir Next Medium' }}
          disabled={isDisabled}
          isUserConfident={true}
          showLoader={operationLoading}
          theme={theme}
          onClick={async () => {
            const userTokenAccountA = baseTokenInfo?.address
            const userTokenAccountB = quoteTokenInfo?.address

            const baseTokenDecimals = baseTokenInfo?.decimals || 0
            const quoteTokenDecimals = quoteTokenInfo?.decimals || 0

            const userAmountTokenA = +baseAmount * 10 ** baseTokenDecimals
            const userAmountTokenB = +quoteAmount * 10 ** quoteTokenDecimals

            if (
              !userTokenAccountA ||
              !userTokenAccountB ||
              !userAmountTokenA ||
              !userAmountTokenB
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
                userAmountTokenA,
                userAmountTokenB,
              })

              return
            }

            if (isPoolAlreadyExist) {
              notify({
                message:
                  'Sorry, pool with this tokenA and tokenB mints already exists',
                type: 'error',
              })

              return
            }

            let result

            console.log('create pool')
            await setOperationLoading(true)
            try {
              result = await createTokenSwap({
                wallet,
                connection,
                userAmountTokenA,
                userAmountTokenB,
                mintA: new PublicKey(baseTokenMintAddress),
                mintB: new PublicKey(quoteTokenMintAddress),
                userTokenAccountA: new PublicKey(userTokenAccountA),
                userTokenAccountB: new PublicKey(userTokenAccountB),
              })
            } catch (e) {
              console.error('createTokenSwap error:', e)
            }

            await refreshAllTokensData()
            await setOperationLoading(false)

            await notify({
              type: result === 'success' ? 'success' : 'error',
              message:
                result === 'success'
                  ? 'Pool created successfully'
                  : result === 'failed'
                  ? 'Pool creation failed, please try again later or contact us in telegram.'
                  : 'Pool creation cancelled',
            })

            await close()
          }}
        >
          Create pool
        </BlueButton>
      </RowContainer>
      <SelectCoinPopup
        theme={theme}
        mints={filteredMints}
        open={isSelectCoinPopupOpen}
        selectTokenAddress={(address: string) => {
          const select = isBaseTokenSelecting
            ? () => {
                if (quoteTokenMintAddress === address) {
                  setQuoteTokenMintAddress("")
                }
                setBaseTokenMintAddress(address)
                setIsSelectCoinPopupOpen(false)
              }
            : () => {
                if (baseTokenMintAddress === address) {
                  setBaseTokenMintAddress("")
                }
                setQuoteTokenMintAddress(address)
                setIsSelectCoinPopupOpen(false)
              }

          select()
        }}
        close={() => setIsSelectCoinPopupOpen(false)}
      />
    </DialogWrapper>
  )
}

export const CreatePoolPopupWrapper = compose(
  queryRendererHoc({
    name: 'getPoolsInfoQuery',
    query: getPoolsInfo,
    fetchPolicy: 'cache-only',
  })
)(CreatePoolPopup)
