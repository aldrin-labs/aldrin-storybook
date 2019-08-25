import React, { Component } from 'react'
import moment from 'moment'

// import { compose } from 'recompose'
// import { queryRendererHoc } from '@core/components/QueryRenderer'

import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { getPortfolioMainQuery } from '@core/graphql/queries/portfolio/main/serverPortfolioQueries/getPortfolioMainQuery'
import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { selectPortfolio } from '@core/graphql/mutations/portfolio/selectPortfolio'
import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'
import { getCalendarActions } from '@core/graphql/queries/portfolio/main/getCalendarActions'

// import Slider from 'react-slick'
import { Query, Mutation } from 'react-apollo'

import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { addMainSymbol } from '@sb/components'
import { MyTradesQuery } from '@core/graphql/queries/portfolio/main/MyTradesQuery'

import {
  AccountsSlickStyles,
  TypographyAccountName,
  TypographyAccountMoney,
} from './AccountsSlick.styles'

import { LinearProgress } from '@material-ui/core'
import SvgIcon from '@sb/components/SvgIcon'
import SliderArrow from '@icons/SliderArrow.svg'

const LeftArrow = ({ className, handleClick, style }) => (
  <SvgIcon
    src={SliderArrow}
    className={className}
    onClick={handleClick}
    style={{ ...style, cursor: 'pointer' }}
    width={32}
    height={32}
  />
)
const RightArrow = ({ className, handleClick, style }) => (
  <SvgIcon
    src={SliderArrow}
    onClick={handleClick}
    className={className}
    style={{ ...style, cursor: 'pointer', transform: 'rotate(-180deg)' }}
    width={32}
    height={32}
  />
)

class AccountsSlick extends Component {
  render() {
    const {
      myPortfolios,
      isSideNav,
      baseCoin,
      selectPortfolioMutation,
    } = this.props

    const portfolio = myPortfolios[0]
    const isUSDT = baseCoin === 'USDT'
    const roundNumber = isUSDT ? 2 : 8

    return (
      <Query
        // notifyOnNetworkStatusChange
        // fetchPolicy="cache-and-network"
        query={getMyPortfoliosQuery}
        variables={{ baseCoin }}
      >
        {({ data, loading, networkStatus }) => {
          if (networkStatus === 4 || loading || !data) {
            return 'Loading...'
          }

          const { myPortfolios: allPortfolios } = data

          const index = allPortfolios.findIndex((p) => p._id === portfolio._id)

          const prevPortfolioId =
            index === 0
              ? allPortfolios[allPortfolios.length - 1]._id
              : allPortfolios[index - 1]._id

          const nextPortfolioId =
            index === allPortfolios.length - 1
              ? allPortfolios[0]._id
              : allPortfolios[index + 1]._id

          const handleClick = (id: string) => {
            selectPortfolioMutation({
              variables: {
                inputPortfolio: {
                  id,
                },
              },
            })
          }

          return (
            <>
              <AccountsSlickStyles />
              <div style={{ position: 'relative', margin: '2rem 0 2rem 0' }}>
                <LeftArrow
                  style={{ position: 'absolute', left: 0, top: '50%' }}
                  handleClick={() => handleClick(prevPortfolioId)}
                />
                <TypographyAccountName isSideNav={isSideNav}>
                  {portfolio.name}
                </TypographyAccountName>
                <TypographyAccountMoney isSideNav={isSideNav}>
                  {addMainSymbol(
                    roundAndFormatNumber(
                      allPortfolios[index].portfolioValue,
                      roundNumber,
                      true
                    ),
                    isUSDT
                  )}
                </TypographyAccountMoney>
                <RightArrow
                  style={{ position: 'absolute', right: 0, top: '50%' }}
                  handleClick={() => handleClick(nextPortfolioId)}
                />
              </div>
            </>
          )
        }}
      </Query>
    )
  }
}

// export default compose(
//   graphql(selectPortfolio, {
//     name: 'selectPortfolioMutation',
//     options: {
//       refetchQueries: [
//         { query: portfolioKeyAndWalletsQuery, variables: { baseCoin: 'BTC' } },
//       ],
//     },
//   })
// )(AccountsSlick)

const APIWrapper = (props: any) => (
  <Query query={GET_BASE_COIN}>
    {({ data }) => {
      const baseCoin = (data.portfolio && data.portfolio.baseCoin) || 'USDT'

      const endDate = +moment().endOf('day')
      const startDate = +moment().subtract(1, 'weeks')
      const queries = [
        { query: getPortfolioMainQuery, variables: { baseCoin } },
        {
          query: MyTradesQuery,
          variables: {
            input: {
              page: 0,
              perPage: 600,
              startDate,
              endDate,
            },
          },
        },
        {
          query: getCalendarActions,
          variables: {
            input: {
              startDate,
              endDate,
            },
          },
        },
      ]

      return (
        <Mutation
          mutation={selectPortfolio}
          refetchQueries={() => [
            { query: getMyPortfoliosQuery, variables: { baseCoin } },
            { query: portfolioKeyAndWalletsQuery, variables: { baseCoin } },
            ...queries,
          ]}
        >
          {(mutation) => {
            return (
              <AccountsSlick
                {...props}
                selectPortfolioMutation={mutation}
                baseCoin={baseCoin}
                isUSDCurrently={baseCoin === 'USDT'}
              />
            )
          }}
        </Mutation>
      )
    }}
  </Query>
)

export default APIWrapper
