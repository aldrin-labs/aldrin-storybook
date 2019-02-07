import * as React from 'react'

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
  Container,
  BlurForMarker,
  DividerWithMargin,
  Marker,
  Tab,
} from './PortfolioTableTabs.styles'


class PortfolioTableTabs extends React.Component<IProps> {
  onChangeTab = (tab: string) => {
    const { onChangeTab } = this.props
    if (onChangeTab) {
      onChangeTab(tab)
    }
  }

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
          background,
        },
      },
    } = this.props
    const switchUSDBTC = tab === 'main'
    const backgroundColor = type === 'dark' ? primary.light : primary[100]

    return (
      <Container background={backgroundColor} elevation={0}>
        <BarTab
          id="main_tab_button"
          thisTab="main"
          thisTabName="Main"
          curentTab={tab}
          onClick={() => this.onChangeTab('main')}
          mainColor={main}
        >
          <Main />
        </BarTab>
        <BarTab
          id="industry_tab_button"
          thisTab="industry"
          thisTabName="Industry"
          curentTab={tab}
          onClick={() => this.onChangeTab('industry')}
          mainColor={main}
        >
          <Industry />
        </BarTab>
        <BarTab
          id="rebalance_tab_button"
          thisTab="rebalance"
          thisTabName="Rebalance"
          curentTab={tab}
          onClick={() => this.onChangeTab('rebalance')}
          mainColor={main}
        >
          <Rebalance />
        </BarTab>
        <BarTab
          id="correlation_tab_button"
          thisTab="correlation"
          thisTabName="Correlation"
          curentTab={tab}
          onClick={() => this.onChangeTab('correlation')}
          mainColor={main}
        >
          <Correlation />
        </BarTab>
        <BarTab
          id="optimization_tab_button"
          thisTab="optimization"
          thisTabName="Optimization"
          curentTab={tab}
          onClick={() => this.onChangeTab('optimization')}
          mainColor={main}
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
  children?: any
  thisTab: string
  thisTabName: string
  id: string
  curentTab: string
  onClick: () => void
  mainColor: string
}) => (
  <BarContainer onClick={props.onClick}>
    <Tab
      id={props.id}
      color={props.curentTab === props.thisTab ? 'secondary' : 'primary'}
    >
      {props.curentTab === props.thisTab && renderMarker(props.mainColor)}
      {props.children}
    </Tab>
    <Typography
      variant="caption"
      color={props.curentTab === props.thisTab ? 'secondary' : 'default'}
    >
      {' '}
      {props.thisTabName}{' '}
    </Typography>
  </BarContainer>
)

export default PortfolioTableTabs
