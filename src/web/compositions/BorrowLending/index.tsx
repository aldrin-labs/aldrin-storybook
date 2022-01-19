import React, { FC, useEffect, useState } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'

import Borrow from '@sb/compositions/BorrowLending/Borrow/Borrow'
import { liqRatio } from '@sb/compositions/BorrowLending/config'
import { Navbar, NavbarItem } from '@sb/compositions/BorrowLending/styles'
import { u192ToBN } from '@sb/dexUtils/borrow-lending/U192-converting'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

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
  const [walletAccounts] = useUserTokenAccounts()

  const [userSummary, setUserSummary] = useState(null)
  const { data: userObligations } = useUserObligations()
  const { data: reserves } = useReserves()
  console.log('userObligations: ', userObligations, reserves)
  const obligationDetails =
    userObligations && userObligations.length ? userObligations[0] : undefined

  const { wallet } = useWallet()
  const connection = useConnection()

  useEffect(() => {
    const summary = {}
    let totalDepositWorth = 0
    if (walletAccounts && walletAccounts.length > 0) {
      reserves.forEach((reserve) => {
        const tokenAccount = walletAccounts.find(
          (account) => account.mint === reserve.collateral.mint.toString()
        )
        if (tokenAccount) {
          const tokenAmount = tokenAccount.amount
          const tokenDecimals = tokenAccount.decimals
          const tokenWorth =
            ((parseInt(u192ToBN(reserve.liquidity.marketPrice).toString()) /
              Math.pow(10, 18)) *
              tokenAmount) /
            Math.pow(10, tokenDecimals) /
            liqRatio
          totalDepositWorth += tokenWorth
          // totalDepositWorth = parseInt(totalDepositWorth.add(tokenWorth).toString())/Math.pow(10, tokenAccount.account.data.parsed.info.tokenAmount.decimals);
        }

        const liq = reserve.liquidity
        const col = reserve.collateral
        console.log('reserveInfo', {
          availableAmount: liq.availableAmount.toString(),
          borrowedAmount: u192ToBN(liq.borrowedAmount).toString(),
          cumulativeBorrowRate: u192ToBN(liq.cumulativeBorrowRate).toString(),
          marketPrice: u192ToBN(liq.marketPrice).toString(),
          mintTotalSupply: col.mintTotalSupply.toString(),
        })
      })

      summary.totalDepositWorth = totalDepositWorth

      setUserSummary(summary)
    }
  }, [walletAccounts])

  if (!reserves || reserves.length === 0) {
    return null
  }

  return null

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
        />
      ) : match.params.section === 'supply' ? (
        <Supply
          reserves={reserves}
          reservesPKs={reservesPKs}
          obligations={obligations}
          obligationDetails={obligationDetails}
          userSummary={userSummary}
          walletAccounts={walletAccounts}
          handleGetReservesAccounts={handleGetReservesAccounts}
          handleGetObligation={handleGetObligation}
        />
      ) : match.params.section === 'borrow' ? (
        <Borrow
          reserves={reserves}
          reservesPKs={reservesPKs}
          obligations={obligations}
          obligationDetails={obligationDetails}
          userSummary={userSummary}
          walletAccounts={walletAccounts}
          handleGetReservesAccounts={handleGetReservesAccounts}
          handleGetObligation={handleGetObligation}
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
