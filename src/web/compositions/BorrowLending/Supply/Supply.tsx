import { Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import BN from 'bn.js'
import React from 'react'
import { default as NumberFormat } from 'react-number-format'
import { compose } from 'recompose'

import { Block, BlockContent } from '@sb/components/Block'
import { Cell, Page, WideContent } from '@sb/components/Layout'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { liqRatio } from '@sb/compositions/BorrowLending/config'
import { MarketCompType } from '@sb/compositions/BorrowLending/Markets/types'
import { RootRow } from '@sb/compositions/Pools/components/Charts/styles'
import { depositLiquidity } from '@sb/dexUtils/borrow-lending/depositLiquidity'
import { depositObligationCollateral } from '@sb/dexUtils/borrow-lending/depositObligationCollateral'
import { initObligation } from '@sb/dexUtils/borrow-lending/initObligation'
import { removeTrailingZeros } from '@sb/dexUtils/borrow-lending/U192-converting'
import { withdrawCollateral } from '@sb/dexUtils/borrow-lending/withdrawCollateral'
import { withdrawLiquidity } from '@sb/dexUtils/borrow-lending/withdrawLiquidity'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import { Obligation, Reserve } from '../../../dexUtils/borrow-lending/types'
import { useUserTokenAccounts } from '../../../dexUtils/token/hooks'
import TableAssets from './components/TableAssets'
import {
  TitleBlock,
  BlockNumber,
  RewardCard,
  BlockReward,
  DescriptionBlock,
  Description,
  List,
  ListItem,
} from './Supply.styles'

type SupplyProps = {
  theme: Theme
  reserves: Reserve[]
  obligations: Obligation[]
  obligationDetails: Obligation
  userSummary: any
  handleGetReservesAccounts: () => void
  handleGetObligation: () => void
}

const Supply = ({
  theme,
  reserves,
  obligations,
  obligationDetails,
  userSummary,
  handleGetReservesAccounts,
  handleGetObligation,
}: SupplyProps) => {
  const [walletAccounts] = useUserTokenAccounts()
  const { wallet } = useWallet()
  const connection = useConnection()
  let totalRemainingBorrow = 0
  let totalUserDepositWorth = 0
  const totalRiskFactor = obligationDetails?.unhealthyBorrowValue?.gtn(0)
    ? (parseInt(obligationDetails.borrowedValue.toString(), 10) /
        parseInt(obligationDetails.unhealthyBorrowValue.toString(), 10)) *
      100
    : 0

  console.log(
    'obligationDetails:',
    obligationDetails.borrowedValue.toString(),
    obligationDetails.unhealthyBorrowValue.toString()
  )

  const generateDepositCompositionArr = (
    reservesList: Reserve[]
  ): MarketCompType[] => {
    const depositCompArr: MarketCompType[] = []
    if (walletAccounts && walletAccounts.length > 0 && userSummary) {
      reservesList.forEach((reserve) => {
        const tokenAccount = walletAccounts.find(
          (account) => account.mint === reserve.collateral.mint.toString()
        )
        const tokenAmount = tokenAccount?.amount || 0
        const tokenDecimals = tokenAccount?.decimals || 9
        const tokenWorth =
          ((parseInt(reserve.liquidity.marketPrice.toString(), 10) / 10 ** 18) *
            tokenAmount) /
          10 ** tokenDecimals /
          liqRatio
        console.log(
          'totalUserDepositWorth',
          totalUserDepositWorth / liqRatio,
          tokenWorth
        )
        const reserveDepositPercent =
          (tokenWorth / (totalUserDepositWorth / liqRatio)) * 100

        depositCompArr.push({
          asset: reserve.collateral.mint.toString(),
          value: reserveDepositPercent || 0,
        })
      })
    }

    return depositCompArr
  }

  const handleDepositLiq = async (
    reserve: any,
    amount: number,
    asCollateral: boolean,
    callback: () => void
  ) => {
    console.log('deposit liq', new BN(amount))
    depositLiquidity({
      wallet,
      connection,
      reserve,
      amount: new BN(amount),
    })
      .then(async (res) => {
        console.log('handleDepositLiq', res)
        let newObligation = null
        if (!obligations || obligations.length === 0) {
          newObligation = await initObligation({
            wallet,
            connection,
          }).catch((error) => console.log('initObligationError', error))
        }

        if (callback) {
          callback()
        }

        console.log('deposit obligation', newObligation)
        console.log('asCollateral', asCollateral)
        if (asCollateral) {
          console.log('deposit collateral', new BN(amount))
          await depositObligationCollateral({
            wallet,
            connection,
            obligation: obligations[0] || newObligation,
            obligationDetails,
            reserve,
            reserves,
            amount: new BN(amount * 5),
          })
            .then((depositObligationCollateralRes) => {
              handleGetObligation()
            })
            .catch((depositObligationCollateralError) =>
              console.log(
                'depositObligationCollateralError',
                depositObligationCollateralError
              )
            )
        }
        handleGetReservesAccounts()
      })
      .catch((error) => console.log('handleDepositLiqError', error))
  }

  const handleWithdrawCollateral = async (
    reserve: any,
    amount: number,
    callback: () => void
  ) => {
    withdrawCollateral({
      wallet,
      connection,
      reserve,
      reserves,
      obligation: obligations[0],
      obligationDetails,
      amount: new BN(amount),
    })
      .then((res) => {
        console.log('withdrawCollateral', res)
        handleGetReservesAccounts()
        handleGetObligation()
        if (callback) {
          callback()
        }
      })
      .catch((error) => console.log('withdrawCollateralError', error))
  }

  const handleWithdrawLiquidity = async (
    reserve: any,
    amount: number,
    callback: () => void
  ) => {
    withdrawLiquidity({
      wallet,
      connection,
      reserve,
      amount: new BN(amount),
    })
      .then((res) => {
        console.log('withdrawLiquidity', res)
        handleGetReservesAccounts()
        if (callback) {
          callback()
        }
      })
      .catch((error) => console.log(error))
  }

  if (walletAccounts && walletAccounts.length) {
    reserves.forEach((reserve) => {
      const tokenAccount = walletAccounts.find(
        (account) => account.mint === reserve.collateral.mint.toString()
      )
      const depositAmount = tokenAccount?.amount || 0
      const depositWorth =
        (parseInt(reserve.liquidity.marketPrice.toString(), 10) / 10 ** 18) *
        depositAmount
      console.log('depositWorthh', depositWorth)
      totalRemainingBorrow =
        (reserve.config.loanToValueRatio.percent / 100) * depositWorth
      console.log('remainingBorrow supply', totalRemainingBorrow)

      totalUserDepositWorth += depositWorth
    })
  }

  const depositCompValues = generateDepositCompositionArr(reserves)

  const renderDepositComp = (reservesValues: MarketCompType[]) => {
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

  // if (wallet.publicKey && !obligations) {
  //   return null
  // }

  // if (wallet.publicKey && !obligationDetails) {
  //   return null
  // }

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
                      <TitleBlock>Deposit</TitleBlock>

                      <DescriptionBlock>
                        <Description>
                          Total:
                          <NumberFormat
                            value={totalUserDepositWorth / liqRatio}
                            displayType="text"
                            decimalScale={2}
                            fixedDecimalScale
                            thousandSeparator
                            prefix="$"
                          />
                        </Description>
                        <List>{renderDepositComp(depositCompValues)}</List>
                      </DescriptionBlock>
                    </BlockNumber>
                  </Cell>

                  <Cell col={12} colLg={6}>
                    <BlockNumber>
                      <TitleBlock>Projected Yields</TitleBlock>

                      <DescriptionBlock>
                        <Description>Total: TBA</Description>
                        <List>
                          <ListItem>Token name 100.00%</ListItem>
                        </List>
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
                            {removeTrailingZeros(totalRiskFactor.toFixed(2))}%
                          </BlockReward>
                        </Cell>
                        <Cell col={12} colLg={4}>
                          <BlockReward>
                            <TitleBlock>Remain Borrow</TitleBlock>
                            {obligationDetails ? (
                              <NumberFormat
                                value={
                                  parseInt(
                                    obligationDetails.allowedBorrowValue
                                      .sub(obligationDetails.borrowedValue)
                                      .toString(),
                                    10
                                  ) /
                                  10 ** 18
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
                handleDepositLiq={handleDepositLiq}
                handleWithdrawCollateral={handleWithdrawCollateral}
                handleWithdrawLiquidity={handleWithdrawLiquidity}
                obligationDetails={obligationDetails}
              />
            </Block>
          </Cell>
        </RootRow>
      </WideContent>
    </Page>
  )
}

export default compose(withTheme())(Supply)
