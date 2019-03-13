import * as React from 'react'
import { withRouter, NavLink } from 'react-router-dom'

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
} from './PortfolioTableTabs.styles'

@withRouter
class PortfolioTableTabs extends React.Component<IProps> {

  onToggleUSDBTC = () => {
    const { onToggleUSDBTC } = this.props
    if (onToggleUSDBTC) {
      onToggleUSDBTC()
    }
  }

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
    const backgroundColor = type === 'dark' ? primary.light : primary[100]

    return (
      <Container background={backgroundColor} elevation={0}>
        <BarTab
          id="main_tab_button"
          to="/portfolio/main"
          thisTabName="Main"
          mainColor={main}
          pathname={pathname}
        >
          <Main />
        </BarTab>
        <BarTab
          id="industry_tab_button"
          to="/portfolio/industry"
          thisTabName="Industry"
          mainColor={main}
          pathname={pathname}
        >
          <Industry />
        </BarTab>
        <BarTab
          id="rebalance_tab_button"
          to="/portfolio/rebalance"
          thisTabName="Rebalance"
          mainColor={main}
          pathname={pathname}
        >
          <Rebalance />
        </BarTab>
        <BarTab
          id="correlation_tab_button"
          to="/portfolio/correlation"
          thisTabName="Correlation"
          mainColor={main}
          pathname={pathname}
        >
          <Correlation />
        </BarTab>
        <BarTab
          id="optimization_tab_button"
          to="/portfolio/optimization"
          thisTabName="Optimization"
          mainColor={main}
          pathname={pathname}
        >
          <Optimization />
        </BarTab>
        <DividerWithMargin />
        <BarContainer
          onClick={() => {
            toggleWallets()
          }}
        >
          <Tab color="primary">
            <Settings className="settingsIcon" />
          </Tab>
          <Typography align="center" variant="caption" color="textSecondary">
            Accounts
          </Typography>
        </BarContainer>
        <DividerWithMargin />
        <Fade in={switchUSDBTC} mountOnEnter unmountOnExit>
          <>
            <BarContainer onClick={this.onToggleUSDBTC}>
              <Button
                data-e2e="toggleCurrency"
                color="default"
                className="SwitchButton"
              >
                {' '}
                {isUSDCurrently ? 'BTC' : 'USD'}
              </Button>
              <Typography
                align="center"
                variant="caption"
                color="textSecondary"
              >
                Switch currency
              </Typography>
            </BarContainer>
            <DividerWithMargin />
          </>
        </Fade>
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
