import React, { Component } from 'react'
import moment from 'moment'

// import { compose } from 'recompose'
// import { queryRendererHoc } from '@core/components/QueryRenderer'

import { getPortfolioKeys } from '@core/graphql/queries/portfolio/getPortfolioKeys'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { getPortfolioMainQuery } from '@core/graphql/queries/portfolio/main/serverPortfolioQueries/getPortfolioMainQuery'
import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { selectPortfolio } from '@core/graphql/mutations/portfolio/selectPortfolio'
import { getCalendarActions } from '@core/graphql/queries/portfolio/main/getCalendarActions'
import { MyTradesQuery } from '@core/graphql/queries/portfolio/main/MyTradesQuery'

// import Slider from 'react-slick'
import { Query, Mutation } from 'react-apollo'

import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { addMainSymbol } from '@sb/components'

import {
  AccountsSlickStyles,
  TypographyAccountName,
  TypographyAccountMoney,
} from './AccountsSlick.styles'

import { Loading } from '@sb/components/index'

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
  state = {
    intervalId: null,
  }

  componentDidMount() {
    const intervalId = setInterval(() => this.props.refetch(), 30000)
    this.setState({ intervalId })
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  render() {
    const {
      loading,
      isSideNav,
      baseCoin,
      selectPortfolioMutation,
      totalKeyAssetsData,
      data = {
        myPortfolios: [{ _id: 0 }, { _id: 1, portfolioValue: 0 }, { _id: 2 }],
      },
      name,
      _id,
    } = this.props
    const isUSDT = baseCoin === 'USDT'
    const roundNumber = isUSDT ? 2 : 8

    const { myPortfolios: allPortfolios } = Object.values(data).length
      ? data
      : {
          myPortfolios: [{ _id: 0 }, { _id: 1, portfolioValue: 0 }, { _id: 2 }],
        }

    let index = allPortfolios.findIndex((p) => p._id === _id)

    // instead of loading
    if (index === -1) index = 1

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
            style={{ position: 'absolute', left: 0, top: '20%' }}
            handleClick={() => handleClick(prevPortfolioId)}
          />
          <TypographyAccountName isSideNav={isSideNav}>
            {name}
          </TypographyAccountName>
          <TypographyAccountMoney isSideNav={isSideNav}>
            {addMainSymbol(
              roundAndFormatNumber(totalKeyAssetsData.value, roundNumber, true),
              isUSDT
            )}
          </TypographyAccountMoney>
          <RightArrow
            style={{ position: 'absolute', right: 0, top: '20%' }}
            handleClick={() => handleClick(nextPortfolioId)}
          />
        </div>
      </>
    )
  }
}

const APIWrapper = (props: any) => {
  const { baseCoin } = props

  const endDate = +moment().endOf('day')
  const startDate = +moment().subtract(1, 'weeks')

  const queries = [
    { query: getPortfolioKeys, variables: { baseCoin, innerSettings: true } },
    { query: getPortfolioKeys, variables: { baseCoin, innerSettings: false } },
    { query: portfolioKeyAndWalletsQuery, variables: { baseCoin } },
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
    <Query
      fetchPolicy="network-only"
      query={getMyPortfoliosQuery}
      variables={{ baseCoin }}
    >
      {({ data, refetch }) => (
        <Mutation mutation={selectPortfolio} refetchQueries={queries}>
          {(mutation) => {
            return (
              <AccountsSlick
                {...props}
                data={data}
                refetch={refetch}
                selectPortfolioMutation={mutation}
                baseCoin={baseCoin}
              />
            )
          }}
        </Mutation>
      )}
    </Query>
  )
}

export default APIWrapper
