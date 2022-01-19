import { Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import React from 'react'
import { default as NumberFormat } from 'react-number-format'
import { compose } from 'recompose'

import { Block, BlockContent } from '@sb/components/Block'
import { Cell, Page, WideContent } from '@sb/components/Layout'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  MarketCompType,
  WalletAccountsType,
} from '@sb/compositions/BorrowLending/Markets/types'
import { RootRow } from '@sb/compositions/Pools/components/Charts/styles'
import { borrowObligationLiquidity } from '@sb/dexUtils/borrow-lending/borrowObligationLiquidity'
import { repayObligationLiquidity } from '@sb/dexUtils/borrow-lending/repayObligationLiquidity'
import {
  removeTrailingZeros,
  toNumberWithDecimals,
} from '@sb/dexUtils/borrow-lending/U192-converting'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  TitleBlock,
  BlockNumber,
  RewardCard,
  BlockReward,
  DescriptionBlock,
  Description,
  List,
  ListItem,
} from '../Supply/Supply.styles'
import TableAssets from './components/TableAssets'

type BorrowProps = {
  theme: Theme
  reserves: any
  reservesPKs: PublicKey[]
  obligations: any
  obligationDetails: any
  walletAccounts: WalletAccountsType | []
  userSummary: any
  handleGetReservesAccounts: () => void
  handleGetObligation: () => void
}

const Borrow = ({
  theme,
  reserves,
  reservesPKs,
  obligations,
  obligationDetails,
  walletAccounts,
  userSummary,
  handleGetReservesAccounts,
  handleGetObligation,
}: BorrowProps) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const collateralTokens = {}
  let totalRemainingBorrow = 0
  let totalBorrowedWorth = 0
  let totalUserDepositWorth = 0
  let totalUserCollateralWorth = 0
  let reserveBorrowedLiquidity = 0
  let reserveBorrowedLiquidityWorth = 0
  let reserveAvailableLiquidity = 0
  let mintedCollateralTotal = 0
  let unhealthyBorrowValue = 0
  const totalRiskFactor = obligationDetails
    ? (parseInt(obligationDetails.borrowedValue.toString()) /
        parseInt(obligationDetails.unhealthyBorrowValue.toString())) *
      100
    : 0

  const handleBorrowObligationLiquidity = (
    reserve: any,
    amount: number,
    callback: () => void
  ) => {
    borrowObligationLiquidity({
      wallet,
      connection,
      obligation: obligations[0],
      obligationDetails,
      reserve,
      amount: new BN(amount),
    })
      .then((borrowObligationLiquidityRes) => {
        handleGetReservesAccounts()
        handleGetObligation()
        if (callback) {
          callback()
        }
      })
      .catch((depositObligationCollateralError) =>
        console.log(
          'depositObligationCollateralError',
          depositObligationCollateralError
        )
      )
  }

  const handleRepayObligationLiquidity = (
    reserve: any,
    amount: number,
    callback: () => void
  ) => {
    repayObligationLiquidity({
      wallet,
      connection,
      obligation: obligations[0],
      obligationDetails,
      reserve,
      amount: new BN(amount),
    })
      .then((repayObligationLiquidityRes) => {
        handleGetReservesAccounts()
        handleGetObligation()
        if (callback) {
          callback()
        }
      })
      .catch((depositObligationCollateralError) =>
        console.log(
          'depositObligationCollateralError',
          depositObligationCollateralError
        )
      )
  }

  const generateCollateralCompositionArr = (
    reservesList: []
  ): MarketCompType[] => {
    const depositCompArr: MarketCompType[] = []
    if (walletAccounts && walletAccounts.length > 0 && userSummary) {
      reservesList.forEach((reserve) => {
        const tokenCollateralWorth = collateralTokens[reserve.publicKey]
        const reserveDepositPercent =
          (tokenCollateralWorth / totalUserCollateralWorth) * 100

        depositCompArr.push({
          asset: reserve.collateral.mint.toString(),
          value: reserveDepositPercent || 0,
        })
      })
    }

    return depositCompArr
  }

  const calcCollateralWorth = (
    collateralDeposit,
    reserveBorrowedLiquidity,
    reserveAvailableLiquidity,
    mintedCollateralTotal,
    tokenPrice
  ) => {
    console.log('calcCollateralWorth', {
      collateralDeposit,
      reserveBorrowedLiquidity,
      reserveAvailableLiquidity,
      mintedCollateralTotal,
      tokenPrice,
    })
    return (
      ((collateralDeposit *
        (reserveBorrowedLiquidity + reserveAvailableLiquidity)) /
        mintedCollateralTotal) *
      tokenPrice
    )
  }

  if (walletAccounts && walletAccounts.length) {
    reserves.forEach((reserve) => {
      const tokenPrice = toNumberWithDecimals(
        parseInt(reserve.liquidity.marketPrice.toString()),
        5
      )
      const tokenAccount = walletAccounts.find(
        (account) => account.mint === reserve.collateral.mint.toString()
      )
      const depositAmount = tokenAccount?.amount || 0
      const depositWorth = parseFloat(tokenPrice, 5) * depositAmount
      console.log('depositWorthh', depositWorth)
      totalRemainingBorrow =
        (reserve.config.loanToValueRatio.percent / 100) * depositWorth
      console.log('remainingBorrow supply', totalRemainingBorrow)

      totalUserDepositWorth += depositWorth

      const tokenDecimals = tokenAccount?.decimals || 9
      reserveBorrowedLiquidity =
        parseInt(reserve.liquidity.borrowedAmount.toString()) /
        Math.pow(10, 18 + tokenDecimals)
      reserveBorrowedLiquidityWorth =
        reserveBorrowedLiquidity * parseFloat(tokenPrice)
      reserveAvailableLiquidity =
        parseInt(reserve.liquidity.availableAmount.toString()) /
        Math.pow(10, tokenDecimals)
      mintedCollateralTotal = parseInt(
        reserve.collateral.mintTotalSupply.toString() /
          Math.pow(10, tokenDecimals)
      )
      console.log(
        'reserveBorrowedLiquidityWorth',
        reserveBorrowedLiquidity,
        reserveBorrowedLiquidityWorth
      )
      totalBorrowedWorth += reserveBorrowedLiquidityWorth

      if (obligationDetails) {
        unhealthyBorrowValue =
          parseInt(obligationDetails.unhealthyBorrowValue.toString()) /
          Math.pow(10, 18)
        const reserveObligationCollateral = obligationDetails.reserves.find(
          (reserveObligation) => {
            if (reserveObligation.collateral) {
              console.log(
                reserve.publicKey.toString(),
                reserveObligation.collateral.inner.depositReserve.toString()
              )
              return (
                reserve.publicKey.toString() ===
                reserveObligation.collateral.inner.depositReserve.toString()
              )
            }
            return false
          }
        )

        const reserveObligationBorrow = obligationDetails.reserves.find(
          (reserveObligation) => {
            if (reserveObligation.liquidity) {
              console.log(
                reserve.publicKey.toString(),
                reserveObligation.liquidity.inner.borrowReserve.toString()
              )
              return (
                reserve.publicKey.toString() ===
                reserveObligation.liquidity.inner.borrowReserve.toString()
              )
            }
            return false
          }
        )

        if (reserveObligationCollateral) {
          const collateralDeposit =
            parseInt(
              reserveObligationCollateral.collateral.inner.depositedAmount.toString()
            ) / Math.pow(10, tokenDecimals)
          const collateralWorth = calcCollateralWorth(
            collateralDeposit,
            reserveBorrowedLiquidity,
            reserveAvailableLiquidity,
            mintedCollateralTotal,
            tokenPrice
          )
          const remainingBorrow =
            (reserve.config.loanToValueRatio.percent / 100) * collateralWorth
          totalUserCollateralWorth += collateralWorth
          collateralTokens[reserve.publicKey] = collateralWorth
        }

        if (reserveObligationBorrow) {
        }
      }
    })
  }

  const collateralCompValues = generateCollateralCompositionArr(reserves)

  const renderCollateralsComp = (reservesValues: MarketCompType[]) => {
    return reservesValues.map((value) => {
      return (
        <ListItem key={value.asset}>
          <a
            href={`https://explorer.solana.com/address/${value.asset}`}
            target="_blank"
            rel="noreferrer"
          >
            {value.asset}
          </a>
          <span>
            {value.value % 1 !== 0 ? value.value.toFixed(2) : value.value}%
          </span>
        </ListItem>
      )
    })
  }

  const positions =
    obligationDetails?.reserves?.filter((reserve) => {
      return Object.keys(reserve)[0] !== 'empty'
    }).length || 0

  if (wallet.publicKey && !obligations) {
    return null
  }

  if (wallet.publicKey && !obligationDetails) {
    return null
  }

  return (
    <Page>
      <WideContent>
        <RootRow>
          <Cell col={12}>
            <Block>
              <BlockContent>
                <RowContainer align="center">
                  <Cell col={12} colLg={6}>
                    <BlockNumber>
                      <TitleBlock>Collaterals</TitleBlock>

                      <DescriptionBlock>
                        <Description>
                          Total:
                          <NumberFormat
                            value={totalUserCollateralWorth}
                            displayType="text"
                            decimalScale={2}
                            fixedDecimalScale
                            thousandSeparator
                            prefix="$"
                          />
                        </Description>
                        <List>
                          {renderCollateralsComp(collateralCompValues)}
                        </List>
                      </DescriptionBlock>
                    </BlockNumber>
                  </Cell>

                  <Cell col={12} colLg={6}>
                    <BlockNumber>
                      <TitleBlock>Loans</TitleBlock>

                      <DescriptionBlock>
                        <Description>
                          Total:
                          <NumberFormat
                            value={totalBorrowedWorth}
                            displayType="text"
                            decimalScale={2}
                            fixedDecimalScale
                            thousandSeparator
                            prefix="$"
                          />
                        </Description>
                        <List>{/* <ListItem>USDC 100.00%</ListItem> */}</List>
                      </DescriptionBlock>
                    </BlockNumber>
                  </Cell>
                </RowContainer>

                <RowContainer>
                  <Cell col={12} colLg={8}>
                    <RewardCard>
                      <RowContainer>
                        <Cell col={12} colLg={4}>
                          <BlockReward>
                            <TitleBlock>Positions</TitleBlock>
                            {positions}/10
                          </BlockReward>
                        </Cell>
                        <Cell col={12} colLg={4}>
                          <BlockReward>
                            <TitleBlock>Risk Factor</TitleBlock>
                            {removeTrailingZeros(
                              parseFloat(totalRiskFactor).toFixed(2)
                            )}
                            %
                          </BlockReward>
                        </Cell>
                        <Cell col={12} colLg={4}>
                          <BlockReward>
                            <TitleBlock>Remain Borrow</TitleBlock>
                            {obligationDetails ? (
                              <NumberFormat
                                value={
                                  parseInt(
                                    obligationDetails.allowedBorrowValue.toString()
                                  ) / Math.pow(10, 18)
                                }
                                displayType="text"
                                decimalScale={2}
                                fixedDecimalScale
                                thousandSeparator
                                prefix="$"
                              />
                            ) : (
                              0
                            )}
                          </BlockReward>
                        </Cell>
                      </RowContainer>
                    </RewardCard>
                  </Cell>
                </RowContainer>
              </BlockContent>
            </Block>
          </Cell>
        </RootRow>

        <RootRow>
          <Cell col={12}>
            <Block style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
              <TableAssets
                theme={theme}
                walletAccounts={walletAccounts}
                reserves={reserves}
                obligations={obligations}
                obligationDetails={obligationDetails}
                calcCollateralWorth={calcCollateralWorth}
                unhealthyBorrowValue={unhealthyBorrowValue}
                handleBorrowObligationLiquidity={
                  handleBorrowObligationLiquidity
                }
                handleRepayObligationLiquidity={handleRepayObligationLiquidity}
              />
            </Block>
          </Cell>
        </RootRow>
      </WideContent>
    </Page>
  )
}

export default compose(withTheme())(Borrow)
