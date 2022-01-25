import React, { FC, useEffect, useState } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'

import Borrow from '@sb/compositions/BorrowLending/Borrow/Borrow'
import { LIQUIDITY_RATIO } from '@sb/compositions/BorrowLending/config'
import { Navbar, NavbarItem } from '@sb/compositions/BorrowLending/styles'

import { ConnectWalletWrapper } from '../../components/ConnectWalletWrapper'
import {
  useReserves,
  useUserObligations,
} from '../../dexUtils/borrow-lending/hooks'
import { useUserTokenAccounts } from '../../dexUtils/token/hooks'
import Dashboard from './Dashboard/Dashboard'
import Markets from './Markets/Markets'
import Supply from './Supply/Supply'

type MatchParams = {
  section: string
}

type BorrowLendingProps = {
  match: RouteComponentProps<MatchParams>
}

const BorrowLending: FC = ({ match }: BorrowLendingProps) => {
  const [walletAccounts, refreshWallets] = useUserTokenAccounts()

  const [userSummary, setUserSummary] = useState(null)
  const { data: userObligations, mutate: refreshObligations } =
    useUserObligations()
  const { data: reserves, mutate: refreshReserves } = useReserves()

  const refreshAll = () => {
    console.log('!!!! REFRESH ALL')
    refreshObligations()
    refreshReserves()
    refreshWallets()
  }
  const obligationDetails =
    userObligations && userObligations.length ? userObligations[0] : undefined

  console.log('obligationDetails: ', obligationDetails)

  useEffect(() => {
    const summary = { totalDepositWorth: 0 }
    let totalDepositWorth = 0
    if (walletAccounts && walletAccounts.length > 0) {
      const reservesForIterate = reserves || []
      reservesForIterate.forEach((reserve) => {
        const tokenAccount = walletAccounts.find(
          (account) => account.mint === reserve.collateral.mint.toString()
        )
        if (tokenAccount) {
          const tokenAmount = tokenAccount.amount
          const tokenDecimals = tokenAccount.decimals
          const tokenWorth =
            ((parseInt(reserve.liquidity.marketPrice.toString(), 10) /
              10 ** 18) *
              tokenAmount) /
            LIQUIDITY_RATIO
          totalDepositWorth += tokenWorth
          // totalDepositWorth = parseInt(totalDepositWorth.add(tokenWorth).toString())/Math.pow(10, tokenAccount.account.data.parsed.info.tokenAmount.decimals);
        }

        const liq = reserve.liquidity
        const col = reserve.collateral
        console.log('reserveInfo', {
          availableAmount: liq.availableAmount.toString(),
          borrowedAmount: liq.borrowedAmount.toString(),
          cumulativeBorrowRate: liq.cumulativeBorrowRate.toString(),
          marketPrice: liq.marketPrice.toString(),
          mintTotalSupply: col.mintTotalSupply.toString(),
        })
      })

      summary.totalDepositWorth = totalDepositWorth

      setUserSummary(summary)
    }
  }, [walletAccounts, reserves])

  if (!reserves || reserves.length === 0) {
    return null
  }
  return (
    <>
      <Navbar>
        <NavbarItem>
          <Link to="/borrow-lending/markets">Markets</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/borrow-lending/dashboard">Dashboard</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/borrow-lending/supply">Supply</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/borrow-lending/borrow">Borrow</Link>
        </NavbarItem>
      </Navbar>
      {match.params.section === 'markets' ? (
        <Markets reserves={reserves} obligationDetails={obligationDetails} />
      ) : match.params.section === 'dashboard' ? (
        <Dashboard
          reserves={reserves}
          obligations={userObligations}
          userSummary={userSummary}
          walletAccounts={walletAccounts}
          obligationDetails={obligationDetails}
          handleGetReservesAccounts={refreshAll}
          handleGetObligation={refreshAll}
        />
      ) : match.params.section === 'supply' ? (
        <Supply
          reserves={reserves}
          obligations={userObligations}
          obligationDetails={obligationDetails}
          userSummary={userSummary}
          walletAccounts={walletAccounts}
          handleGetReservesAccounts={refreshAll}
          handleGetObligation={refreshAll}
        />
      ) : match.params.section === 'borrow' ? (
        <Borrow
          reserves={reserves}
          obligations={userObligations}
          obligationDetails={obligationDetails}
          userSummary={userSummary}
          walletAccounts={walletAccounts}
          handleGetReservesAccounts={refreshAll}
          handleGetObligation={refreshAll}
        />
      ) : null}
    </>
  )
}

export default (props) => {
  return (
    <ConnectWalletWrapper>
      <BorrowLending {...props} />
    </ConnectWalletWrapper>
  )
}
