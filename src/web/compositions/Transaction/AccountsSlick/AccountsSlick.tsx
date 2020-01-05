import React, { Component } from 'react'
import moment from 'moment'

import QueryRenderer from '@core/components/QueryRenderer'
import { getTimeZone } from '@core/utils/dateUtils'
import { getPortfolioAssets } from '@core/graphql/queries/portfolio/getPortfolioAssets'
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
  TypographyAccountName,
  TypographyAccountMoney,
} from './AccountsSlick.styles'

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

  handleClick = (id: string) => {
    const { selectPortfolioMutation } = this.props

    selectPortfolioMutation({
      variables: {
        inputPortfolio: {
          id,
        },
      },
    })
  }

  render() {
    const {
      baseCoin,
      selectPortfolioMutation,
      totalKeyAssetsData,
      data = {
        myPortfolios: [{ _id: 0 }, { _id: 1, portfolioValue: 0 }, { _id: 2 }],
      },
      currentName,
      currentId,
    } = this.props

    const isUSDT = baseCoin === 'USDT'
    const roundNumber = isUSDT ? 2 : 8

    const { myPortfolios: allPortfolios } = data

    const showArrows = allPortfolios.length > 1
    const index = allPortfolios.findIndex((p) => p._id === currentId)

    let prevPortfolioId
    let nextPortfolioId

    if (showArrows) {
      prevPortfolioId =
        index === 0
          ? allPortfolios[allPortfolios.length - 1]._id
          : allPortfolios[index - 1]._id

      nextPortfolioId =
        index === allPortfolios.length - 1
          ? allPortfolios[0]._id
          : allPortfolios[index + 1]._id
    }

    return (
      <>
        <div style={{ position: 'relative', margin: '2rem 0 2rem 0' }}>
          {showArrows && (
            <LeftArrow
              style={{ position: 'absolute', left: 0, top: '20%' }}
              handleClick={() => this.handleClick(prevPortfolioId)}
            />
          )}
          <TypographyAccountName>{currentName}</TypographyAccountName>
          <TypographyAccountMoney>
            {totalKeyAssetsData
              ? addMainSymbol(
                  roundAndFormatNumber(
                    totalKeyAssetsData.value,
                    roundNumber,
                    true
                  ),
                  isUSDT
                )
              : 'Loading...'}
          </TypographyAccountMoney>
          {showArrows && (
            <RightArrow
              style={{ position: 'absolute', right: 0, top: '20%' }}
              handleClick={() => this.handleClick(nextPortfolioId)}
            />
          )}
        </div>
      </>
    )
  }
}

const APIWrapper = (props: any) => {
  const { baseCoin } = props

  const endDate = +moment().endOf('day')
  const startDate = +moment().subtract(1, 'weeks')
  const timezone = getTimeZone()


  const queries = [
    { query: getPortfolioAssets, variables: { baseCoin, innerSettings: true } },
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
          timezone,
        },
      },
    },
  ]

  const MutationComponent = (props) => (
    <Mutation mutation={selectPortfolio} refetchQueries={queries}>
      {(mutation) => {
        return (
          <AccountsSlick
            {...props}
            data={props.data}
            refetch={props.refetch}
            selectPortfolioMutation={mutation}
            baseCoin={baseCoin}
          />
        )
      }}
    </Mutation>
  )

  return (
    <QueryRenderer
      loaderColor="#fefefe"
      fetchPolicy="cache-and-network"
      component={MutationComponent}
      query={getMyPortfoliosQuery}
      pollInterval={30000}
      variables={{ baseCoin: props.baseCoin }}
      withOutSpinner={false}
      {...props}
    />
  )
}

export default APIWrapper
