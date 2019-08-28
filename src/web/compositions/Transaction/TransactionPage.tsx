import React from 'react'
import * as UTILS from '@core/utils/PortfolioSelectorUtils'

import GitTransactionCalendar from '@sb/components/GitTransactionCalendar'

import { Grid } from '@material-ui/core'
import {
  GridContainerTitle,
  TypographyContatinerTitle,
  GridItemContainer,
  TypographyAccountTitle,
  ContentGrid,
  GridShowHideDataContainer,
  GridAccountContainer,
  GridTableContainer,
  PortfolioSelectorWrapper,
  TransactionsPageMediaQuery,
} from './TransactionPage.styles'

import TradeOrderHistory from '@core/containers/TradeOrderHistory/TradeOrderHistoryWrapper'

import Accounts from '@sb/components/Accounts/Accounts'
// import PortfolioSelector from './PortfolioSelector/PortfolioSelector'
import AccountsSlick from './AccountsSlick/AccountsSlick'
import ShowHideData from './ShowHideData/ShowHideData'

import TransactionsActionsStatistic from './TransactionsActionsStatistic/TransactionsActionsStatistic'
import WinLossRatio from './WinLossRatio'

import { withTheme } from '@material-ui/styles'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { compose } from 'recompose'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { getPortfolioAssetsData } from '@core/utils/Overview.utils'
import { updatePortfolioSettingsMutation } from '@core/graphql/mutations/portfolio/updatePortfolioSettingsMutation'

import SvgIcon from '@sb/components/SvgIcon'
import TransactionsAccountsBackground from '@icons/TransactionsAccountsBg.svg'
import { graphql } from 'react-apollo'

@withTheme()
class TransactionPage extends React.PureComponent {
  state = {
    includeExchangeTransactions: true,
    includeTrades: true,
  }

  handleChangeShowHideOptions = (option) => (event) => {
    this.setState({ [option]: event.target.checked })
  }

  updateSettings = async (objectForMutation) => {
    const { updatePortfolioSettings } = this.props

    try {
      await updatePortfolioSettings({
        variables: objectForMutation,
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  onKeyToggle = async (toggledKeyID: string) => {
    const { portfolioId, newKeys, isRebalance } = this.props

    const objForQuery = {
      settings: {
        portfolioId,
        [isRebalance
          ? 'selectedRebalanceKeys'
          : 'selectedKeys']: UTILS.getArrayContainsOnlySelected(
          newKeys,
          toggledKeyID
        ),
      },
    }

    await this.updateSettings(objForQuery)
  }

  onKeysSelectAll = async () => {
    const { portfolioId, newKeys, isRebalance } = this.props

    const objForQuery = {
      settings: {
        portfolioId,
        [isRebalance
          ? 'selectedRebalanceKeys'
          : 'selectedKeys']: UTILS.getArrayContainsAllSelected(newKeys),
      },
    }

    await this.updateSettings(objForQuery)
  }

  render() {
    const {
      theme,
      hideSelector,
      portfolioKeyAndWalletsQuery: { myPortfolios },
      newWallets = [],
      newKeys = [],
      activeKeys = [],
      activeWallets = [],
    } = this.props

    console.log('this.props', this.props)

    const { includeExchangeTransactions, includeTrades } = this.state

    const baseCoin = 'USDT'
    const color = theme.palette.secondary.main
    const login = true
    const isSideNavOpen = true

    const isCheckedAll =
      activeKeys.length + activeWallets.length ===
      newKeys.length + newWallets.length

    const { portfolioAssetsData } = getPortfolioAssetsData(
      myPortfolios[0].portfolioAssets
    )

    return (
      <>
        <TransactionsPageMediaQuery />
        <Grid
          container
          justify="space-between"
          style={{
            padding: !hideSelector && '3rem 5% 8rem 5px',
            overflow: 'hidden',
            flexWrap: 'nowrap',
          }}
          // borderColor={`1px solid ${theme.palette.grey[theme.palette.type]}`}
        >
          {/* Accounts */}
          {!hideSelector && (
            <Grid item lg={2} md={2}>
              <GridAccountContainer
                borderColor={`1px solid ${
                  theme.palette.grey[theme.palette.type]
                }`}
              >
                <GridContainerTitle
                  bgColor={theme.palette.primary.dark}
                  content
                  alignItems="center"
                >
                  <TypographyContatinerTitle
                    textColor={theme.palette.text.subPrimary}
                  >
                    accounts
                  </TypographyContatinerTitle>
                </GridContainerTitle>
                <ContentGrid>
                  <PortfolioSelectorWrapper>
                    <SvgIcon
                      src={TransactionsAccountsBackground}
                      style={{
                        position: 'absolute',
                        top: '-4rem',
                        left: 0,
                      }}
                      width="100%"
                      height="20rem"
                    />
                    <TypographyAccountTitle>Portfolio</TypographyAccountTitle>
                    <AccountsSlick
                      path={this.props['0'].location.pathname}
                      myPortfolios={myPortfolios}
                      baseCoin={baseCoin}
                    />
                  </PortfolioSelectorWrapper>

                  <Grid>
                    <Accounts
                      {...{
                        color,
                        login,
                        isSideNavOpen,
                        isCheckedAll,
                        portfolioAssetsData,
                        baseCoin,
                        newKeys,
                        isRebalance: false,
                        onKeysSelectAll: this.onKeysSelectAll,
                        onKeyToggle: this.onKeyToggle,
                      }}
                    />
                  </Grid>
                </ContentGrid>
                <GridShowHideDataContainer>
                  <ShowHideData
                    handleChangeShowHideOptions={
                      this.handleChangeShowHideOptions
                    }
                    includeExchangeTransactions={includeExchangeTransactions}
                    includeTrades={includeTrades}
                  />
                </GridShowHideDataContainer>
              </GridAccountContainer>
            </Grid>
          )}

          <GridItemContainer
            item
            lg={hideSelector ? 9 : 8}
            md={hideSelector ? 9 : 8}
            style={{
              boxShadow: 'none',
              border: 'none',
              paddingLeft: !hideSelector && '1.5rem',
            }}
          >
            <Grid item style={{ height: '30%' }}>
              {!hideSelector && <GitTransactionCalendar />}

              <GridTableContainer
                item
                lg={12}
                md={12}
                borderColor={`1px solid ${
                  theme.palette.grey[theme.palette.type]
                }`}
              >
                <TradeOrderHistory
                  style={{ overflow: 'scroll' }}
                  includeExchangeTransactions={includeExchangeTransactions}
                  includeTrades={includeTrades}
                  handleChangeShowHideOptions={this.handleChangeShowHideOptions}
                />
              </GridTableContainer>
            </Grid>
          </GridItemContainer>

          <GridItemContainer
            item
            lg={hideSelector ? 3 : 2}
            md={hideSelector ? 3 : 2}
            style={{
              boxShadow: 'none',
              border: 'none',
              paddingLeft: '1.5rem',
              paddingTop: hideSelector ? '4rem' : '1.75rem',
            }}
          >
            <TransactionsActionsStatistic />
            <WinLossRatio />
          </GridItemContainer>
        </Grid>
      </>
    )
  }
}

export default compose(
  queryRendererHoc({
    query: portfolioKeyAndWalletsQuery,
    name: 'portfolioKeyAndWalletsQuery',
    variables: { baseCoin: 'USDT' },
  })
)(TransactionPage)
