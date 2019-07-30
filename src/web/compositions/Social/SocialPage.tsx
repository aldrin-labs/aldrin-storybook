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

import { TableWithSort } from '@sb/components'

import { withTheme } from '@material-ui/styles'
import { transformData } from '@core/utils/SocialUtils'

const getOwner = (str: string) => {
  if (!str) {
    return 'public'
  }

  const b = str.match(/(?<=\').*(?=')/gm)

  return (b && b[0]) || 'public'
}

const PortfolioListItem = ({ el, onClick, isSelected }) => (
  <Paper
    style={{ padding: '10px', marginBottom: '20px' }}
    elevation={isSelected ? 10 : 2}
  >
    <Grid container onClick={onClick}>
      <Grid container alignItems="center" justify="space-between">
        <Typography>Portfolio: </Typography> <Typography>{el.name}</Typography>{' '}
      </Grid>
      <Grid container alignItems="center" justify="space-between">
        <Typography>Owner: </Typography>{' '}
        <Typography>
          {el.isPrivate ? getOwner(el.ownerId) : `Public portfolio`}
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
  putDataInTable = (tableData) => {
    const { theme, isUSDCurrently = true, baseCoin = 'USDT' } = this.props
    const {
      checkedRows = [],
      // tableData,
      numberOfDigitsAfterPoint: round,
      red = 'red',
      green = 'green',
    } = {}
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
      body: transformData(
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
      selectedPortfolio,
      getFollowingPortfolios,
      tableData,
      setSelectedPortfolio,
    } = this.props

    const { head, body, footer = [] } = this.putDataInTable(tableData)

    const sharedPortfoliosList = getFollowingPortfolios.map((el, index) => (
      <PortfolioListItem
        key={index}
        isSelected={index === selectedPortfolio}
        el={el}
        onClick={() => {
          setSelectedPortfolio(index)
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
