import React from 'react'
import * as UTILS from '@core/utils/PortfolioSelectorUtils'
import moment from 'moment'

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
  GridCalendarContainer,
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

import { getPortfolioKeys } from '@core/graphql/queries/portfolio/getPortfolioKeys'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { getPortfolioMainQuery } from '@core/graphql/queries/portfolio/main/serverPortfolioQueries/getPortfolioMainQuery'
import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { getCalendarActions } from '@core/graphql/queries/portfolio/main/getCalendarActions'
import { MyTradesQuery } from '@core/graphql/queries/portfolio/main/MyTradesQuery'

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

    const keyIndex = newKeys.findIndex((elem, index, newKeys) => elem._id === toggledKeyID)
    const prevSelected = newKeys[keyIndex].selected ? false : true
    newKeys[keyIndex].selected = prevSelected

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

    newKeys.forEach((item, index) => {
      newKeys[index].selected = true
    })

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
      newWallets = [],
      newKeys = [],
      activeKeys = [],
      activeWallets = [],
      portfolioKeys,
    } = this.props

    const { includeExchangeTransactions, includeTrades } = this.state

    const color = theme.palette.secondary.main
    const login = true
    const isSideNavOpen = true
    
    const { totalKeyAssetsData, portfolioAssetsData } = getPortfolioAssetsData(
      portfolioKeys.myPortfolios ?
        portfolioKeys.myPortfolios[0].portfolioAssets :
        []
    )

    const { name, _id } = portfolioKeys.myPortfolios ? portfolioKeys.myPortfolios[0] : {
      _id: null,
      name: undefined
    }

    const isCheckedAll =
      activeKeys.length + activeWallets.length ===
      newKeys.length + newWallets.length

    return (
      <>
        <TransactionsPageMediaQuery />
        <Grid
          container
          justify="space-between"
          style={{
            padding: !hideSelector && '2vh 5% 0 5px',
            overflow: 'hidden',
            flexWrap: 'nowrap',
            height: '84vh',
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
                      totalKeyAssetsData={totalKeyAssetsData}
                      currentName={name}
                      currentId={_id}
                      baseCoin={'USDT'}
                    />
                  </PortfolioSelectorWrapper>

                  <Grid>
                    <Accounts
                      {...{
                        color,
                        login,
                        isSideNavOpen,
                        isCheckedAll,
                        baseCoin: 'USDT',
                        newKeys,
                        portfolioAssetsData: portfolioAssetsData,
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
            <Grid item style={{ height: '100%' }}>
              {!hideSelector && (
                <GridCalendarContainer
                  item
                  xs={12}
                  borderColor={`1px solid ${
                    theme.palette.grey[theme.palette.type]
                  }`}
                >
                  <GitTransactionCalendar />
                </GridCalendarContainer>
              )}

              <GridTableContainer
                item
                lg={12}
                md={12}
                borderColor={`1px solid ${
                  theme.palette.grey[theme.palette.type]
                }`}
                style={{ height: 'calc(59.5% - 2vh)' }}
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
          {/* 416 * 1.625 */}
          <GridItemContainer
            item
            lg={hideSelector ? 3 : 2}
            md={hideSelector ? 3 : 2}
            style={{
              boxShadow: 'none',
              border: 'none',
              paddingLeft: '1.5rem',
              paddingTop: hideSelector ? '4rem' : '0',
            }}
          >
            <TransactionsActionsStatistic />
            {/* <WinLossRatio /> */}
          </GridItemContainer>
        </Grid>
      </>
    )
  }
}

export default compose(
  graphql(getPortfolioKeys, {
    name: 'portfolioKeys',
    options: ({ baseCoin }) => ({
      variables: { baseCoin, innerSettings: true },
      pollInterval: 30000,
    }),
  }),
  graphql(updatePortfolioSettingsMutation, {
    name: 'updatePortfolioSettings',
    options: ({ baseCoin }) => ({
      refetchQueries: [
        {
          query: portfolioKeyAndWalletsQuery,
          variables: { baseCoin },
        },
        { query: getMyPortfoliosQuery, variables: { baseCoin } },
        { query: getPortfolioMainQuery, variables: { baseCoin } },
        {
          query: MyTradesQuery,
          variables: {
            input: {
              page: 0,
              perPage: 600,
              startDate: +moment().subtract(1, 'weeks'),
              endDate: +moment().endOf('day'),
            },
          },
        },
        {
          query: getCalendarActions,
          variables: {
            input: {
              startDate: +moment().subtract(1, 'weeks'),
              endDate: +moment().endOf('day'),
            },
          },
        },
      ],
      // update: updateSettingsMutation,
    }),
  })
)(TransactionPage)
