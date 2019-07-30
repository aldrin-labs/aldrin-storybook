import React from 'react'
import { compose } from 'recompose'

import { Input, Grid, Paper } from '@material-ui/core'
import {
  PortfolioName,
  TypographyTitle,
  TypographyPercentage,
  FolioValuesCell,
} from './SocialPage.styles'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_FOLLOWING_PORTFOLIOS } from '@core/graphql/queries/portfolio/getFollowingPortfolios'

import { IProps, IState } from './Social.types'

import { addMainSymbol, TableWithSort } from '@sb/components'
import {
  roundPercentage,
  roundAndFormatNumber,
  combineTableData,
} from '@core/utils/PortfolioTableUtils'
import { withTheme } from '@material-ui/styles'
import { isObject, zip } from 'lodash-es'

import SocialPortfolioInfoPanel from '@sb/components/SocialPortfolioInfoPanel/SocialPortfolioInfoPanel'
import SocialBalancePanel from '@sb/components/SocialBalancePanel/SocialBalancePanel'
import SocialTabs from '@sb/components/SocialTabs/SocialTabs'
import SearchInput from '@sb/components/SearchInput/SearchInput'

const getOwner = (str: string) => {
  if (!str) {
    return 'public'
  }

  const b = str.match(/(?<=\').*(?=')/gm)

  return (b && b[0]) || 'public'
}

const PortfolioListItem = ({ el, onClick, isSelected }) => (
  <Paper
    style={{ padding: '10px', margin: '20px' }}
    elevation={isSelected ? 10 : 2}
  >
    <Grid container onClick={onClick} style={{ height: '120px' }}>
      <Grid container alignItems="center" justify="space-between">
        <PortfolioName textColor={'#16253D'} style={{ padding: '0' }}>
          {el.name}
          <TypographyTitle style={{ padding: '0', margin: '0' }}>
            {el.isPrivate ? getOwner(el.ownerId) : `Public portfolio`}
          </TypographyTitle>
        </PortfolioName>
      </Grid>
      <Grid container alignItems="center" justify="space-between">
        <FolioValuesCell item justify="center" style={{ textAlign: 'center' }}>
          <TypographyTitle>Assets</TypographyTitle>
          <TypographyTitle>{el.portfolioAssets.length}</TypographyTitle>
        </FolioValuesCell>
        <FolioValuesCell item justify="center" style={{ textAlign: 'center' }}>
          <TypographyTitle>Month perform</TypographyTitle>
          <TypographyTitle fontSize={'0.75rem'} textColor={'#97C15C'}>
            {el.portfolioAssets.length}
          </TypographyTitle>
        </FolioValuesCell>
        <FolioValuesCell item justify="center" style={{ textAlign: 'center' }}>
          <TypographyTitle>Exchanges</TypographyTitle>
          <TypographyTitle>{el.portfolioAssets.length}</TypographyTitle>
        </FolioValuesCell>
      </Grid>
    </Grid>
  </Paper>
)

@withTheme()
class SocialPage extends React.Component {
  state = {
    selectedPortfolio: 0,
    search: '',
    //filteredPortfolio: [],
  }

  handleSearchInput = (e) => {
    console.log(e.target.value)
    this.setState({ search: e.target.value })
  }

  // componentDidMount() {
  //   this.setState({
  //     filteredPortfolio: this.props.getFollowingPortfoliosQuery
  //       .getFollowingPortfolios,
  //   })
  // }

  // searchPortfolio = () => {
  //   this.props.getFollowingPortfoliosQuery.getFollowingPortfolios.filter(
  //     (folio) => {
  //       return folio.name.toLowerCase().indexOf(this.state.search) !== -1
  //     }
  //   )
  // }

  // filteredData = this.props.getFollowingPortfoliosQuery.getFollowingPortfolios.filter(
  //   (folio) => {
  //     return folio.name.toLowerCase().indexOf('ne') !== -1
  //   }
  // )

  transformData = (data: any[] = [], red: string = '', green: string = '') => {
    const { numberOfDigitsAfterPoint: round = 2 } = this.state
    const isUSDCurrently = true

    return data.map((row) => ({
      // exchange + coin always uniq
      //  change in future
      id: row.id,
      name: row.name,
      coin: {
        contentToSort: row.coin,
        contentToCSV: row.coin,
        render: row.coin,
        style: { fontWeight: 700 },
      },
      portfolio: {
        // not formatted value for counting total in footer
        contentToSort: row.portfolioPercentage,
        contentToCSV: roundPercentage(row.portfolioPercentage) || 0,
        render: `${roundPercentage(row.portfolioPercentage) || 0}%`,
        isNumber: true,
      },
      price: {
        contentToSort: row.price,
        contentToCSV: roundAndFormatNumber(row.price, round, true),
        render: addMainSymbol(
          roundAndFormatNumber(row.price, round, true),
          isUSDCurrently
        ),
        isNumber: true,
        color: row.priceChange > 0 ? green : row.priceChange < 0 ? red : '',
      },
      quantity: {
        contentToSort: row.quantity,
        render: roundAndFormatNumber(row.quantity, round, true),
        isNumber: true,
      },
      usd: {
        contentToSort: row.price * row.quantity,
        contentToCSV: roundAndFormatNumber(
          row.price * row.quantity,
          round,
          true
        ),
        render: addMainSymbol(
          roundAndFormatNumber(row.price * row.quantity, round, true),
          isUSDCurrently
        ),
        isNumber: true,
      },
      realizedPL: {
        contentToSort: row.realizedPL,
        contentToCSV: roundAndFormatNumber(row.realizedPL, round, true),
        render: addMainSymbol(
          roundAndFormatNumber(row.realizedPL, round, true),
          isUSDCurrently
        ),
        isNumber: true,
        color: row.realizedPL > 0 ? green : row.realizedPL < 0 ? red : '',
      },
      unrealizedPL: {
        contentToSort: row.unrealizedPL,
        contentToCSV: roundAndFormatNumber(row.unrealizedPL, round, true),
        render: addMainSymbol(
          roundAndFormatNumber(row.unrealizedPL, round, true),
          isUSDCurrently
        ),
        isNumber: true,
        color: row.unrealizedPL > 0 ? green : row.unrealizedPL < 0 ? red : '',
      },
      totalPL: {
        contentToSort: row.totalPL,
        contentToCSV: roundAndFormatNumber(row.totalPL, round, true),
        render: addMainSymbol(
          roundAndFormatNumber(row.totalPL, round, true),
          isUSDCurrently
        ),
        isNumber: true,
        color: row.totalPL > 0 ? green : row.totalPL < 0 ? red : '',
      },
    }))
  }

  putDataInTable = (tableData) => {
    const { theme, isUSDCurrently = true, baseCoin = 'USDT' } = this.props
    const {
      checkedRows = [],
      // tableData,
      numberOfDigitsAfterPoint: round,
      red = 'red',
      green = 'green',
    } = this.state

    if (tableData.length === 0) {
      return { head: [], body: [], footer: null }
    }

    return {
      head: [
        { id: 'name', label: 'Account', isNumber: false },
        { id: 'coin', label: 'coin', isNumber: false },
        { id: 'portfolio', label: 'portfolio', isNumber: true },
        { id: 'price', label: 'price', isNumber: true },
        { id: 'quantity', label: 'quantity', isNumber: true },
        { id: 'usd', label: isUSDCurrently ? 'usd' : 'BTC', isNumber: true },
        { id: 'realizedPL', label: 'realized P&L', isNumber: true },
        { id: 'unrealizedPL', label: 'Unrealized P&L', isNumber: true },
        { id: 'totalPL', label: 'Total P&L', isNumber: true },
      ],
      body: this.transformData(
        tableData,
        theme.palette.red.main,
        theme.palette.green.main
      ),
      // footer: this.calculateTotal({
      //   checkedRows,
      //   tableData,
      //   baseCoin,
      //   red,
      //   green,
      //   numberOfDigitsAfterPoint: round,
      // }),
    }
  }

  render() {
    const {
      getFollowingPortfoliosQuery: { getFollowingPortfolios },
    } = this.props

    //console.log('getFollowingPortfolios', getFollowingPortfolios)

    const { selectedPortfolio = 0 } = this.state
    const { body, head, footer = [] } = this.putDataInTable(
      combineTableData(
        getFollowingPortfolios[selectedPortfolio].portfolioAssets,
        { usd: -100, percentage: -100 },
        true
      )
    )
    //getFollowingPortfolios

    let filteredData = this.props.getFollowingPortfoliosQuery.getFollowingPortfolios.filter(
      (folio) => {
        return (
          folio.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !==
          -1
        )
      }
    )
    const sharedPortfoliosList = filteredData.map((el, index) => (
      <PortfolioListItem
        key={index}
        isSelected={index === selectedPortfolio}
        el={el}
        onClick={() => {
          this.setState({ selectedPortfolio: index })
        }}
      />
    ))

    return (
      <Grid container xs={12} spacing={8}>
        <Grid item xs={4} style={{ padding: '15px' }}>
          <SocialTabs style={{ width: '80%', margin: 'auto' }}>
            {/* <Input
              placeholder={``}
              fontSize={`12px`}
              style={{
                height: '32px',
                width: '100%',
                display: 'flex',
                alignSelf: 'flex-start',
                margin: '0 auto 10px auto',
                padding: '5px',
                borderRadius: '0px',
                border: '2px solid #E7ECF3',
              }}
              onChange={this.handleSearchInput}
            /> */}
            {sharedPortfoliosList}
          </SocialTabs>
          {/* {sharedPortfoliosList} */}
        </Grid>
        <Grid lg={8}>
          <SocialPortfolioInfoPanel />
          <SocialBalancePanel />

          <Grid item xs={7} spacing={24} style={{ padding: '15px' }}>
            <TableWithSort
              id="PortfolioSocialTable"
              title="Portfolio"
              columnNames={head}
              data={{ body, footer }}
              padding="dense"
              emptyTableText="No assets"
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default compose(
  queryRendererHoc({
    query: GET_FOLLOWING_PORTFOLIOS,
    withOutSpinner: false,
    withTableLoader: false,
    name: 'getFollowingPortfoliosQuery',
  })
)(SocialPage)
