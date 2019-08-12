import React from 'react'
import { compose } from 'recompose'

import { Typography, Input, Grid, Paper } from '@material-ui/core'
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
  StyledSvgIcon,
  GridFolioConteiner,
  TypographyEmptyFolioPanel,
  TypographyContent,
  WrapperTitle,
  WrapperContent,
  UnshareButton,
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
import { isObject, zip } from 'lodash-es'

import SocialPortfolioInfoPanel from '@sb/components/SocialPortfolioInfoPanel/SocialPortfolioInfoPanel'
import SocialBalancePanel from '@sb/components/SocialBalancePanel/SocialBalancePanel'
import SocialTabs from '@sb/components/SocialTabs/SocialTabs'

import { withTheme } from '@material-ui/styles'
import { transformData } from '@core/utils/SocialUtils'

import PortfolioMainAllocation from '@core/containers/PortfolioMainAllocation'
import PortfolioMainChart from '@core/containers/PortfolioMainChart/PortfolioMainChart'

import SvgIcon from '@sb/components/SvgIcon'
import LineGraph from '@icons/LineGraph.svg'

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

  // { isSelected && this.setState({el: el}))}

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
  // </Paper>
)

@withTheme()
class SocialPage extends React.Component {
  state = {
    search: '',
    isFollowingTab: true,
    isStatsOpen: false,
  }

  handleSearchInput = (e) => {
    this.setState({ search: e.target.value })
  }

  toggleStatsPage = (bool: boolean) => {
    this.setState({ isStatsOpen: bool })
  }

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
        // { id: 'name', label: 'Account', isNumber: false },
        //{ id: 'portfolio', label: 'portfolio', isNumber: true },
        // { id: 'coin', label: '', isNumber: false },
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

  changeTab = (isFollowingTab: boolean) => {
    this.setState({ isFollowingTab })
  }

  render() {
    const {
      selectedPortfolio,
      myPortfolios: { myPortfolios },
      getFollowingPortfolios,
      getSharedPortfolios,
      tableData,
      setSelectedPortfolio,
      unsharePortfolioMutation,
    } = this.props

    const { isFollowingTab, isStatsPage } = this.state

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

    // data for all page (following or my tab)
    const dataToFilter = isFollowingTab ? getFollowingPortfolios : myPortfolios

    let filteredData = dataToFilter.length
      ? dataToFilter.filter((folio) => {
          return (
            folio.name
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) !== -1
          )
        })
      : []

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

    // my tab data
    const sharedWith = getSharedPortfolios.sharedPortfolios

    const unshare = (portfolioId, followerId) => {
      console.log({
        variables: {
          inputPortfolio: { id: portfolioId },
          options: { forAll: false, userId: followerId },
        },
      })
      unsharePortfolioMutation({
        variables: {
          inputPortfolio: { id: portfolioId },
          options: { forAll: false, userId: followerId },
        },
      })
    }

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
          <SocialTabs
            isFollowingTab={isFollowingTab}
            changeTab={this.changeTab}
          >
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
              // style={{
              //   background:`${theme.palette.type === 'dark'
              //       ? theme.palette.primary.light
              //       : theme.palette.grey.main }`
              // }}
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
        {/* <Grid lg={8}> */}

        <GridTableContainer container justify="center" xs={9}>
          <Grid continer lg={12}>
            <SocialPortfolioInfoPanel
              folioData={
                dataToFilter.length
                  ? dataToFilter[selectedPortfolio]
                  : { name: '', isPrivate: true, ownerId: '' }
              }
            />
            {!isStatsPage ? (
              <>
                <SocialBalancePanel
                  totalFolioAssetsData={totalFolioAssetsData}
                />
                <Grid container justify="space-between">
                  <Grid
                    item
                    xs={3}
                    style={{
                      padding: '0 15px 0 0',
                    }}
                  >
                    <PortfolioMainAllocation
                      portfolioData={getFollowingPortfolios[selectedPortfolio]}
                    />
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
                            // '&th:first-child': {
                            //   // Does'n work
                            //   borderRadius: '22px 0 0 0',
                            //   background: 'red',
                            // },
                            // '&:last-child': {
                            //   borderRadius: '0 22px  0 0',
                            // },
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
                            '&:first-child': {
                              // Does'n work
                              color: 'red',
                              background: 'red',
                            },
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
                    <Grid item style={{ paddingTop: '15px', height: '100%' }}>
                      {/*TODO: Pass real values to this component*/}
                      {/*<PortfolioMainChart*/}
                      {/*title="Portfolio performance"*/}
                      {/*style={{*/}
                      {/*marginLeft: 0,*/}
                      {/*maxHeight: '222px',*/}
                      {/*boxShadow: '0px 0px 8px rgba(10, 19, 43, 0.1)',*/}
                      {/*border: '1px solid #e0e5ec',*/}
                      {/*}}*/}
                      {/*marginTopHr="10px"*/}
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Grid
                container
                justify="center"
                alignItems="center"
                xs={12}
                style={{ height: '85%' }}
              >
                <Grid item xs={4}>
                  <WrapperTitle>
                    <TypographyTitle>{`Shared to`}</TypographyTitle>
                    <TypographyContent>{`${
                      sharedWith.length
                    } people`}</TypographyContent>
                  </WrapperTitle>
                  {sharedWith.map(
                    ({ _id: portfolioId, sharedWith: { email, _id } }) => {
                      return (
                        <WrapperContent key={_id}>
                          <TypographyContent>{`${email}`}</TypographyContent>
                          <UnshareButton
                            onClick={() => unshare(portfolioId, _id)}
                          >
                            unshare
                          </UnshareButton>
                        </WrapperContent>
                      )
                    }
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        </GridTableContainer>
        {/* </Grid> */}
      </GridPageContainer>
    )
  }
}

export default SocialPage
