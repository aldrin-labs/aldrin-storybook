import React from 'react'

import { Grid } from '@material-ui/core'
import {
  PortfolioName,
  TypographyTitle,
  FolioValuesCell,
  TypographySearchOption,
  ReactSelectCustom,
  GridSortOption,
  GridTableContainer,
  FolioCard,
  GridPageContainer,
  GridFolioScroll,
  InputCustom,
  TableContainer,
  TypographyEmptyFolioPanel,
} from './SocialPage.styles'

import { IProps, IState } from './Social.types'

import { TableWithSort } from '@sb/components'

import SocialPortfolioInfoPanel from '@sb/components/SocialPortfolioInfoPanel/SocialPortfolioInfoPanel'
import SocialBalancePanel from '@sb/components/SocialBalancePanel/SocialBalancePanel'
import SocialTabs from '@sb/components/SocialTabs/SocialTabs'

import { withTheme } from '@material-ui/styles'
import { transformData } from '@core/utils/SocialUtils'

import PortfolioMainAllocation from '@core/containers/PortfolioMainAllocation'
import PortfolioMainChart from '@core/containers/PortfolioMainChart/PortfolioMainChart'

import SvgIcon from '@sb/components/SvgIcon'
import LineGraph from '@icons/LineGraph.svg'
import getOwner from '@sb/components/Utils/PortfolioUtils/getOwner'

const PortfolioListItem = ({ el, onClick, isSelected }) => (
  <FolioCard
    container
    onClick={onClick}
    border={isSelected ? '22px' : '22px 22px 0 0 '}
    boxShadow={!isSelected ? 'none' : '0px 0px 8px rgba(10, 19, 43, 0.1)'}
    borderRadius={!isSelected ? '22px 22px 0 0 ' : '22px'}
  >
    <Grid container justify="space-between">
      <Grid item>
        <PortfolioName textColor={'#16253D'}>{el.name}</PortfolioName>
        <TypographyTitle
          fontSize={'0.9rem'}
          textColor={'#7284A0'}
          paddingText={'0'}
          marginText={'0'}
        >
          {el.isPrivate ? getOwner(el.ownerId) : `Public portfolio`}
        </TypographyTitle>
      </Grid>
      <SvgIcon
        width="10"
        height="10"
        src={LineGraph}
        styledComponentsAdditionalStyle="@media(min-width: 2560px) {
          width: 4.5rem;
          margin: .5rem .5rem 2rem 0;
        }"
      />
    </Grid>
    <Grid container alignItems="center" justify="space-between">
      <FolioValuesCell item>
        <div>
          <TypographyTitle>Assets</TypographyTitle>
          <TypographyTitle fontSize={'1rem'} textColor={'#16253D'}>
            {el.portfolioAssets.length}
          </TypographyTitle>
        </div>
      </FolioValuesCell>
      <FolioValuesCell item>
        <div>
          <TypographyTitle>perform</TypographyTitle>
          <TypographyTitle
            fontSize={'1rem'}
            textColor={isSelected ? '#97C15C' : '#2F7619'}
          >
            {/* TODO IMPORTANT plus sign */}+ {el.portfolioAssets.length} %
          </TypographyTitle>
        </div>
      </FolioValuesCell>
      <FolioValuesCell item>
        <div>
          <TypographyTitle>Exchanges</TypographyTitle>
          <TypographyTitle fontSize={'1rem'} textColor={'#16253D'}>
            {el.portfolioAssets.length}
          </TypographyTitle>
        </div>
      </FolioValuesCell>
    </Grid>
  </FolioCard>
)

@withTheme()
class SocialPage extends React.Component<IState> {
  state = {
    search: '',
  }

  handleSearchInput = (e) => {
    this.setState({ search: e.target.value })
  }

  putDataInTable = (tableData) => {
    const { theme, isUSDCurrently = true, baseCoin = 'USDT' } = this.props
    const {
      checkedRows = [],
      numberOfDigitsAfterPoint: round,
      red = 'red',
      green = 'green',
    } = {}
    if (tableData.length === 0) {
      return { head: [], body: [], footer: null }
    }

    return {
      head: [
        { id: 'coin', label: 'coin', isNumber: true },
        { id: 'exchange', label: 'exchange', isNumber: false },
        { id: 'price', label: 'price', isNumber: false },
        { id: 'quantity', label: 'quantity', isNumber: false },
        { id: 'usd', label: isUSDCurrently ? 'usd' : 'BTC', isNumber: true },
        { id: 'realizedPL', label: 'realized P&L', isNumber: false },
        { id: 'unrealizedPL', label: 'Unrealized P&L', isNumber: false },
        { id: 'totalPL', label: 'Total P&L', isNumber: false },
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

    const totalFolioAssetsData = getFollowingPortfolios.length
      ? getFollowingPortfolios[selectedPortfolio].portfolioAssets.reduce(
          (acc, el) => {
            acc.total += el.quantity * el.price
            acc.assets++
            acc.realized += el.realized
            acc.unrealized += el.unrealized
            return acc
          },
          {
            total: 0,
            assets: 0,
            realized: 0,
            unrealized: 0,
          }
        )
      : {
          total: 0,
          assets: 0,
          realized: 0,
          unrealized: 0,
        }

    const { head, body, footer = [] } = this.putDataInTable(tableData)
    let filteredData = getFollowingPortfolios.filter((folio) => {
      return (
        folio.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
      )
    })

    const sharedPortfoliosList = filteredData.map((el, index) => (
      <PortfolioListItem
        key={index}
        isSelected={index === selectedPortfolio}
        el={el}
        onClick={() => {
          setSelectedPortfolio(index)
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
      <GridPageContainer
        container
        xs={12}
        style={{ paddingRight: '4%', overflow: 'hidden' }}
      >
        <Grid item xs={3}>
          <SocialTabs>
            <GridSortOption
              container
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                {/* <TypographySearchOption
                  textColor={'#165BE0'}
                  style={{ visible: 'hidden' }}
                >
                  compare Index Chart
                </TypographySearchOption> */}
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
                      fontSize: '.8rem',
                      padding: '0',
                    }}
                    indicatorSeparatorStyles={{}}
                    controlStyles={{
                      background: 'transparent',
                      border: 'none',
                      width: 84,
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
                      fontSize: '0.8rem',
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
            <InputCustom
              disableUnderline={true}
              placeholder={``}
              fontSize={`1.2rem`}
              onChange={this.handleSearchInput}
            />
            <GridFolioScroll>
              {sharedPortfoliosList.length === 0 ? (
                <TypographyEmptyFolioPanel>
                  Portfolio has not been found in the list
                </TypographyEmptyFolioPanel>
              ) : (
                sharedPortfoliosList
              )}
            </GridFolioScroll>
          </SocialTabs>
        </Grid>

        <GridTableContainer container justify="center" xs={9}>
          <Grid continer lg={12}>
            <SocialPortfolioInfoPanel
              folioData={
                getFollowingPortfolios.length
                  ? getFollowingPortfolios[selectedPortfolio]
                  : { name: '', isPrivate: true, ownerId: '' }
              }
            />
            <SocialBalancePanel totalFolioAssetsData={totalFolioAssetsData} />
            {/* pie chart */}
            <Grid container justify="space-between">
              <Grid
                item
                xs={3}
                style={{
                  padding: '0 15px 0 0',
                }}
              >
                <PortfolioMainAllocation />
              </Grid>
              <Grid item xs={9}>
                <TableContainer
                  style={{ borderRadius: '14px  14px 14px 14px' }}
                >
                  <TableWithSort
                    id="PortfolioSocialTable"
                    //title="Portfolio"
                    columnNames={head}
                    data={{ body, footer }}
                    padding="dense"
                    emptyTableText="No assets"
                    tableStyles={{
                      heading: {
                        padding: '0 0 0 48px !important',
                        textAlign: 'left',
                        maxWidth: '14px',
                        background: '#F2F4F6',
                        fontFamily: "'DM Sans'",
                        fontSize: '0.9rem',
                        color: '#7284A0',
                        lineHeight: '31px',
                        letterSpacing: '1.5px',
                      },

                      cell: {
                        textAlign: 'left',
                        maxWidth: '14px',
                        fontFamily: 'DM Sans',
                        fontStyle: 'normal',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '1rem',
                        padding: '0 0 0 8px',
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
                </TableContainer>
                {/* chart */}
                <Grid item style={{ paddingTop: '15px', height: '100%' }}>
                  <PortfolioMainChart
                    title="Portfolio performance"
                    style={{
                      marginLeft: 0,
                      maxHeight: '222px',
                      boxShadow: '0px 0px 8px rgba(10, 19, 43, 0.1)',
                      border: '1px solid #e0e5ec',
                    }}
                    marginTopHr="10px"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </GridTableContainer>
      </GridPageContainer>
    )
  }
}

export default SocialPage
