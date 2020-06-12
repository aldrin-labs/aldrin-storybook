import React from 'react'

import { Grid } from '@material-ui/core'
import {
  TypographyHeader,
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

import { IProps, IState } from './Social.types'

import { addMainSymbol, TableWithSort } from '@sb/components'
import {
  roundPercentage,
  roundAndFormatNumber,
  combineTableData,
} from '@core/utils/PortfolioTableUtils'

import SocialPortfolioInfoPanel from '@sb/components/SocialPortfolioInfoPanel/SocialPortfolioInfoPanel'
import SocialBalancePanel from '@sb/components/SocialBalancePanel/SocialBalancePanel'
import SocialTabs from '@sb/components/SocialTabs/SocialTabs'

import { withTheme } from '@material-ui/styles'
import { transformData } from '@core/utils/SocialUtils'

import TransactionPage from '@sb/compositions/Transaction/TransactionPage'

import PortfolioMainAllocation from '@sb/components/PortfolioMainAllocation/PortfolioMainAllocation'
import SocialPortfolioChart from '@sb/components/SocialPortfolioChart'

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
    boxShadow={!isSelected ? 'none' : '0px 0px 8px rgba(10, 19, 43, 0.1)'}
  >
    <Grid container justify="space-between">
      <Grid item style={{ maxWidth: '70%' }}>
        <TypographyHeader textColor={'#16253D'}>{el.name}</TypographyHeader>
        <TypographyTitle fontSize={'0.9rem'} textColor={'#7284A0'}>
          {el.isPrivate ? getOwner(el.ownerId) : `Public portfolio`}
        </TypographyTitle>
      </Grid>
      <SvgIcon
        width="10"
        height="10"
        src={LineGraph}
        styledComponentsAdditionalStyle="
          @media(min-width: 1400px) {
            padding: 1rem 0 2rem 0;
          }

          @media(min-width: 1921px) {
            width: 4.5rem;
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
    selectedPortfolio: 0,
    unfollowedPortfolios: [],
  }

  handleSearchInput = (e) => {
    this.setState({ search: e.target.value })
  }

  toggleStatsPage = (bool: boolean) => {
    this.setState({ isStatsOpen: bool })
  }

  unfollowPortfolio = (id: string) => {
    this.setState((prev) => ({
      unfollowedPortfolios: [...prev.unfollowedPortfolios, id],
    }))
  }

  followPortfolio = (id: string) => {
    this.setState((prev) => ({
      unfollowedPortfolios: [
        ...prev.unfollowedPortfolios.filter((p) => p !== id),
      ],
    }))
  }

  setSelectedPortfolio = (index: number) => {
    this.setState({ selectedPortfolio: index })
  }

  toggleStats = () => {
    this.setState((prevState) => ({ isStatsOpen: !prevState.isStatsOpen }))
  }

  changeTab = (isFollowingTab: boolean) => {
    this.setState({ isFollowingTab, isStatsOpen: false, selectedPortfolio: 0 })
  }

  putDataInTable = (tableData) => {
    const { theme, isUSDCurrently = true, baseCoin = 'USDT' } = this.props

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

  componentWillUnmount = () => {
    const { unfollowedPortfolios } = this.state
    const { unfollowPortfolioMutation } = this.props

    unfollowedPortfolios.forEach(async (p) => {
      await unfollowPortfolioMutation({
        variables: {
          inputPortfolio: { id: p },
        },
      })
    })
  }

  render() {
    const {
      myPortfolios,
      getFollowingPortfolios,
      getSharedPortfolios,
      unsharePortfolioMutation,
    } = this.props

    const {
      isFollowingTab,
      isStatsOpen,
      selectedPortfolio,
      unfollowedPortfolios,
    } = this.state

    // data for all page (following or my tab)
    const dataToFilter = isFollowingTab ? getFollowingPortfolios : myPortfolios

    // table data
    const tableData = dataToFilter.length
      ? combineTableData(
          dataToFilter[selectedPortfolio].portfolioAssets,
          { usd: -100, percentage: -100 },
          true
        )
      : []

    const { head, body, footer = [] } = this.putDataInTable(tableData)

    // other data

    let filteredData = dataToFilter.length
      ? dataToFilter.filter((folio) => {
          return (
            folio.name
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) !== -1
          )
        })
      : []

    const totalFolioAssetsData = dataToFilter.length
      ? dataToFilter[selectedPortfolio].portfolioAssets.reduce(
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

    // left panel cards
    const sharedPortfoliosList = filteredData.map((el, index) => (
      <PortfolioListItem
        key={index}
        isSelected={index === selectedPortfolio}
        el={el}
        onClick={() => {
          this.setSelectedPortfolio(index)
        }}
      />
    ))

    // my tab data
    const sharedWith = myPortfolios[selectedPortfolio]
      ? getSharedPortfolios.sharedPortfolios.filter(
          (portfolio) => portfolio._id === myPortfolios[selectedPortfolio]._id
        )
      : []

    // unshare button
    const unshare = (portfolioId, followerId) => {
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
            <GridSortOption container justify="flex-end" alignItems="center">
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
                      width: 80,
                      marginRight: 0,
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

        <GridTableContainer container justify="center" xs={9}>
          <Grid continer xs={12}>
            <SocialPortfolioInfoPanel
              isFollowingTab={isFollowingTab}
              isStatsOpen={isStatsOpen}
              id={
                getFollowingPortfolios[selectedPortfolio]
                  ? getFollowingPortfolios[selectedPortfolio]._id
                  : ''
              }
              unfollowedPortfolios={unfollowedPortfolios}
              toggleStats={this.toggleStats}
              unfollowPortfolio={this.unfollowPortfolio}
              followPortfolio={this.followPortfolio}
              folioData={
                dataToFilter.length
                  ? dataToFilter[selectedPortfolio]
                  : { name: '', isPrivate: true, ownerId: '' }
              }
            />
            {!isStatsOpen ? (
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
                      portfolioData={
                        dataToFilter.length
                          ? dataToFilter[selectedPortfolio]
                          : {}
                      }
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
                            padding: '.5rem 0 .5rem 1rem',
                            textAlign: 'left',
                            maxWidth: '14px',
                            background: '#F2F4F6',
                            fontFamily: "'DM Sans'",
                            fontSize: '.8rem',
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
                            fontSize: '1.1rem',
                            padding: '1rem 0 1rem 1rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
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
                    <Grid item style={{ paddingTop: '15px' }}>
                      <SocialPortfolioChart />
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
                    <TypographyTitle>{`Shared with`}</TypographyTitle>
                    <TypographyContent>{`${
                      sharedWith.length
                    } people`}</TypographyContent>
                  </WrapperTitle>

                  {sharedWith.map(
                    ({
                      _id: portfolioId,
                      sharedWith: { username, _id },
                    }: {
                      _id: string
                      sharedWith: { username: string; _id: string }
                    }) => {
                      return (
                        <WrapperContent key={_id}>
                          <TypographyContent>{`${username}`}</TypographyContent>
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
          <Grid
            item
            xs={12}
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #E0E5EC',
            }}
          >
            <TypographyHeader color={'#7284A0'} margin={'0 0 1.25rem 0'}>
              Transactions
            </TypographyHeader>
            <TransactionPage hideSelector={true} />
          </Grid>
        </GridTableContainer>
      </GridPageContainer>
    )
  }
}

export default SocialPage
