import React from 'react'
import { compose } from 'recompose'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid,
  Typography,
  Checkbox,
  Radio,
  Input,
  TextField,
  Paper,
} from '@material-ui/core'

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

const PortfolioListItem = ({ el, onClick, isSelected }) => (
  <Paper style={{ padding: '10px', marginBottom: '20px' }} elevation={isSelected ? 10 : 2}>
    <Grid container onClick={onClick}>
      <Grid container alignItems="center" justify="space-between">
        <Typography>Portfolio: </Typography> <Typography>{el.name}</Typography>{' '}
      </Grid>
      <Grid container alignItems="center" justify="space-between">
        <Typography>Owner: </Typography>{' '}
        <Typography>
          {el.isPrivate ? JSON.parse(el.ownerId).email : `Public portfolio`}
        </Typography>{' '}
      </Grid>
      <Grid container alignItems="center" justify="space-between">
        <Typography>Assets length: </Typography>{' '}
        <Typography>{el.portfolioAssets.length}</Typography>
      </Grid>
    </Grid>
  </Paper>
)

@withTheme()
class SocialPage extends React.Component {
  state = {
    selectedPortfolio: 0,
  }

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

    console.log('getFollowingPortfolios', getFollowingPortfolios)

    const { selectedPortfolio = 0 } = this.state
    const { body, head, footer = [] } = this.putDataInTable(
      combineTableData(
        getFollowingPortfolios[selectedPortfolio].portfolioAssets,
        { usd: -100, percentage: -100 },
        true
      )
    )
    const sharedPortfoliosList = getFollowingPortfolios.map((el, index) => (
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
      <Grid container xs={10} spacing={8}>
        <Grid item xs={3} style={{ padding: '15px' }}>
          {sharedPortfoliosList}
        </Grid>
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
