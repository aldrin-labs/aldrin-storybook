import React from 'react'
import { compose } from 'recompose'

import { Input, Grid, Paper } from '@material-ui/core'
import {
  PortfolioName,
  TypographyTitle,
  TypographyPercentage,
  FolioValuesCell,
  TypographySearchOption,
  ReactSelectCustom,
  GridSortOption,
  GridTableContainer,
  FolioCard,
  GridPageContainer,
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

const getOwner = (str: string) => {
  if (!str) {
    return 'public'
  }

  const b = str.match(/(?<=\').*(?=')/gm)

  return (b && b[0]) || 'public'
}

const PortfolioListItem = ({ el, onClick, isSelected }) => (
  // <Paper
  // style={{
  //   padding: '10px',
  //   margin: '12px',
  //   background: `${isSelected ? '#fff' : 'transparent'}`,
  //   border: `${!isSelected && 'none'}`,
  //   borderBottom: '1px solid #E0E5EC',
  //   boxShadow: `${!isSelected && 'none'}`,
  //   borderRadius: `${!isSelected && 'none'}`,
  // }}
  // elevation={isSelected ? 10 : 2}
  // >
  <FolioCard
    container
    onClick={onClick}
    style={{
      width: '93%',
      margin: '10px auto 15px auto',
      padding: '10px 12px',
      background: '#fff',
      border: `${!isSelected ? 'none' : '1px solid #E0E5EC'}`,
      borderBottom: '1px solid #E0E5EC',
      borderRadius: `${!isSelected ? '22px 22px 0 0 ' : '22px'}`,
      boxShadow: `${
        !isSelected ? 'none' : ' 0px 0px 34px -25px rgba(0,0,0,0.5)'
      }`,
    }}
  >
    <Grid>
      <Grid
        style={{
          width: 'auto',
        }}
      />
      <PortfolioName textColor={'#16253D'}>{el.name}</PortfolioName>
      <TypographyTitle paddingText={'0'} marginText={'0'}>
        {el.isPrivate ? getOwner(el.ownerId) : `Public portfolio`}
      </TypographyTitle>
    </Grid>
    <Grid container alignItems="center" justify="space-between">
      <FolioValuesCell item>
        <div>
          <TypographyTitle>Assets</TypographyTitle>
          <TypographyTitle>{el.portfolioAssets.length}</TypographyTitle>
        </div>
      </FolioValuesCell>
      <FolioValuesCell item>
        <div>
          <TypographyTitle>Month perform</TypographyTitle>
          <TypographyTitle fontSize={'1.2rem'} textColor={'#97C15C'}>
            {el.portfolioAssets.length}
          </TypographyTitle>
        </div>
      </FolioValuesCell>
      <FolioValuesCell item>
        <div>
          <TypographyTitle>Exchanges</TypographyTitle>
          <TypographyTitle>{el.portfolioAssets.length}</TypographyTitle>
        </div>
      </FolioValuesCell>
    </Grid>
  </FolioCard>
  // </Paper>
)

@withTheme()
class SocialPage extends React.Component {
  state = {
    selectedPortfolio: 0,
    search: '',
  }

  handleSearchInput = (e) => {
    console.log(e.target.value)
    this.setState({ search: e.target.value })
  }

  transformData = (data: any[] = [], red: string = '', green: string = '') => {
    const { numberOfDigitsAfterPoint: round = 2 } = this.state
    const isUSDCurrently = true

    return data.map((row) => ({
      //  exchange + coin always uniq
      //  change in future
      //  name: row.name,
      // portfolio: {
      //   // not formatted value for counting total in footer
      //   contentToSort: row.portfolioPercentage,
      //   contentToCSV: roundPercentage(row.portfolioPercentage) || 0,
      //   render: `${roundPercentage(row.portfolioPercentage) || 0}%`,
      //   isNumber: true,
      // },
      id: row.id,
      coin: {
        contentToSort: row.coin,
        contentToCSV: row.coin,
        render: row.coin,
        style: { fontWeight: 700 },
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
        // { id: 'name', label: 'Account', isNumber: false },
        //{ id: 'portfolio', label: 'portfolio', isNumber: true },
        { id: 'coin', label: 'coin', isNumber: false },
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

    const sortBy = [
      {
        label: 'popularity',
        value: '1',
      },
      {
        label: 'author',
        value: '1',
      },
      {
        label: 'date',
        value: '1',
      },
    ]

    return (
      <GridPageContainer container xs={12}>
        <Grid item xs={3}>
          <SocialTabs>
            <GridSortOption
              container
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <TypographySearchOption textColor={'#165BE0'}>
                  compare Index Chart
                </TypographySearchOption>
              </Grid>

              <Grid item>
                <Grid container justify="space-between" alignItems="center">
                  <TypographySearchOption textColor={'#16253D'}>
                    Sort by
                  </TypographySearchOption>

                  <ReactSelectCustom
                    // onChange={(
                    //   optionSelected: {
                    //     label: string
                    //     value: string
                    //   } | null
                    // ) => onRebalanceTimerChange(optionSelected)}
                    value={[sortBy[0]]}
                    options={sortBy}
                    isSearchable={false}
                    singleValueStyles={{
                      color: '#165BE0',
                      fontSize: '11px',
                      padding: '0',
                    }}
                    indicatorSeparatorStyles={{}}
                    controlStyles={{
                      background: 'transparent',
                      border: 'none',
                      width: 104,
                    }}
                    menuStyles={{
                      width: 120,
                      padding: '5px 8px',
                      borderRadius: '14px',
                      textAlign: 'center',
                      marginLeft: '-15px',
                    }}
                    optionStyles={{
                      color: '#7284A0',
                      background: 'transparent',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      '&:hover': {
                        borderRadius: '14px',
                        color: '#16253D',
                        background: '#E7ECF3',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </GridSortOption>
            <Input
              placeholder={``}
              fontSize={`1.2rem`}
              style={{
                height: '32px',
                width: '100%',
                display: 'flex',
                alignSelf: 'flex-start',
                margin: '0 auto 10px auto',
                padding: '5px',
                borderRadius: '0px',
                background: '#F9FBFD',
                border: '1px solid #E0E5EC',
              }}
              onChange={this.handleSearchInput}
            />
            {sharedPortfoliosList}
          </SocialTabs>
        </Grid>
        {/* <Grid lg={8}> */}

        <GridTableContainer container justify="center" xs={9}>
          <Grid continer lg={12} style={{ padding: '0 0 0 15px' }}>
            <SocialPortfolioInfoPanel />
            <SocialBalancePanel />
            {/* <GridItemContainer item lg={2} md={2}>
              <GridContainerTitle content alignItems="center">
                <TypographyContatinerTitle>
                  calendar
                </TypographyContatinerTitle>
              </GridContainerTitle>
              <Grid style={{ padding: '0 0 20px 0' }}>
                <Grid style={{ padding: '0 0 10px 45px' }}>
                  <GitTransactionCalendar />
                </Grid>
                <Grid
                  container
                  justify="center"
                  style={{ margineTop: '15px' }}
                >
                  <Grid lg={2}>
                    <TypographyCalendarLegend textAlign={'right'}>
                      Less
                    </TypographyCalendarLegend>
                  </Grid>

                  <Grid container justify="center" lg={8}>
                    <LessMoreContainer />
                  </Grid>
                  <Grid lg={2}>
                    <TypographyCalendarLegend>
                      More
                    </TypographyCalendarLegend>
                  </Grid>
                </Grid>
              </Grid>
            </GridItemContainer> */}
            <TableWithSort
              style={{
                border: '3px solid red',
                borderRadius: '22px 22px 0 0',
              }}
              id="PortfolioSocialTable"
              //title="Portfolio"
              columnNames={head}
              data={{ body, footer }}
              padding="dense"
              emptyTableText="No assets"
              tableStyles={{
                heading: {
                  background: '#F2F4F6',
                  padding: '10px 16px',
                  fontFamily: "'DM Sans'",
                  fontSize: '1.2rem',
                  color: '#7284A0',
                  lineHeight: '31px',
                  letterSpacing: '1.5px',
                  '&&:first-child': {
                    borderRadius: '22px 0 0 0',
                  },
                  '&&:last-child': {
                    borderRadius: '0 22px  0 0',
                  },
                },

                cell: {
                  //color: '#7284A0',
                  fontFamily: 'DM Sans',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '1.4rem',
                  padding: '10px 16px',
                  '&&:first-child': { color: 'red' },
                  '&:before': {
                    content: '',
                    display: 'block',
                    width: 5,
                    height: 5,
                    backgroundColor: 'red',
                    position: 'relative',
                    top: 0,
                    left: 0,
                  },
                },
              }}
            />
          </Grid>
        </GridTableContainer>
        {/* </Grid> */}
      </GridPageContainer>
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
