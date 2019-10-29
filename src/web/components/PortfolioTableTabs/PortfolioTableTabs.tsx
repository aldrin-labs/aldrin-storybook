import * as React from 'react'
import { withRouter, Link } from 'react-router-dom'

import Settings from '@material-ui/icons/Settings'
import Main from '@material-ui/icons/LineStyle'
import Industry from '@material-ui/icons/DonutLarge'
import Rebalance from '@material-ui/icons/SwapHoriz'
import Correlation from '@material-ui/icons/ViewModule'
import Optimization from '@material-ui/icons/Assessment'
import { Typography, Fade, Button } from '@material-ui/core'

import { IProps } from './PortfolioTableTabs.types'
import {
  BarContainer,
  BarLink,
  Container,
  BlurForMarker,
  DividerWithMargin,
  Marker,
  Tab,
  StyledLeftButton,
  StyledRightButton,
} from './PortfolioTableTabs.styles'

@withRouter
class PortfolioTableTabs extends React.Component<IProps> {
  // onToggleUSDBTC = () => {
  //   const { onToggleUSDBTC } = this.props
  //   if (onToggleUSDBTC) {
  //     onToggleUSDBTC()
  //   }
  // }

  render() {
    const {
      tab,
      toggleWallets,
      isUSDCurrently,
      theme: {
        palette: {
          primary,
          type,
          secondary: { main },
        },
      },
      location: { pathname },
    } = this.props

    const switchUSDBTC = pathname === '/portfolio/main'
    const isMainPage = pathname === '/portfolio/main'
    const isTransactionsPage = pathname === '/portfolio/transactions'
    const isRebalancePage = pathname === '/portfolio/rebalance'

    return (
      <Container
        key={pathname}
        background={'transparent'}
        elevation={0}
        style={{
          width: '0px',
          background: 'red',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '86.2vh',
        }}
      >
        {isMainPage ? (
          <>
            <StyledLeftButton
              key={'accountsFromMain'}
              onClick={() => toggleWallets()}
              id="accountsPanel"
            >
              Accounts
            </StyledLeftButton>
            <StyledRightButton
              key={'transactions'}
              component={Link}
              to="/portfolio/transactions"
              id="transactionsPanel"
            >
              Transactions
            </StyledRightButton>
          </>
        ) : null}

        {isRebalancePage ? (
          <StyledLeftButton
            key={'accountsFromRebalance'}
            onClick={() => toggleWallets()}
          >
            Accounts
          </StyledLeftButton>
        ) : null}

        {isTransactionsPage ? (
          <StyledLeftButton
            key={'P&L'}
            component={Link}
            to="/portfolio/main"
            id="accountsPanel"
          >
            P&L
          </StyledLeftButton>
        ) : null}

        {/*<BarContainer*/}
        {/*onClick={() => {*/}
        {/*toggleWallets()*/}
        {/*}}*/}
        {/*>*/}
        {/*<Tab color="primary">*/}
        {/*<Settings className="settingsIcon" />*/}
        {/*</Tab>*/}
        {/*<Typography align="center" variant="caption" color="textSecondary">*/}
        {/*Accounts*/}
        {/*</Typography>*/}
        {/*</BarContainer>*/}
      </Container>
    )
  }
}

const renderMarker = (color: string) => (
  <React.Fragment key={1}>
    <Marker color={color} />
    <BlurForMarker color={color} />
  </React.Fragment>
)

const BarTab = (props: {
  id: string
  children?: any
  thisTabName: string
  mainColor: string
  to: string
  pathname: string
}) => {
  const isActive = new RegExp(props.to, 'i').test(props.pathname)

  return (
    <BarLink to={props.to}>
      <Tab id={props.id} color={isActive ? 'secondary' : 'primary'}>
        {isActive && renderMarker(props.mainColor)}
        {props.children}
      </Tab>
      <Typography variant="caption" color={isActive ? 'secondary' : 'default'}>
        {props.thisTabName}
      </Typography>
    </BarLink>
  )
}

export default PortfolioTableTabs
