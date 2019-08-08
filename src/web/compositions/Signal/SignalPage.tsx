import React, { useState } from 'react'
import { compose } from 'recompose'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid,
} from '@material-ui/core'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_FOLLOWING_SIGNALS_QUERY } from '@core/graphql/queries/signals/getFollowingSignals'
import { GET_SIGNAL_EVENTS_QUERY } from '@core/graphql/queries/signals/getSignalEvents'

import QueryRenderer from '@core/components/QueryRenderer'

import { IProps, IState } from './SignalPage.types'

import { addMainSymbol, TableWithSort } from '@sb/components'
import {
  roundPercentage,
  roundAndFormatNumber,
  combineTableData,
} from '@core/utils/PortfolioTableUtils'
import { withTheme } from '@material-ui/styles'
import SwitchOnOff from '@sb/components/SwitchOnOff'
import { isObject, zip } from 'lodash-es'

import SocialBalancePanel from '@sb/components/SocialBalancePanel/SocialBalancePanel'
import SocialTabs from '@sb/components/SocialTabs/SocialTabs'
import SignalPreferencesDialog from '@sb/components/SignalPreferencesDialog'

import {
  GridFolioScroll,
  InputCustom,
  TypographySearchOption,
  GridSortOption,
  ReactSelectCustom,
  TypographyTitle,
  PortfolioName,
  FolioValuesCell,
  FolioCard,
  TypographySubTitle,
  TypographyEmptyFolioPanel,
  ContainerGrid,
  TypographyEditButton,
} from './SignalPage.styles'

const getOwner = (str: string) => {
  if (!str) {
    return 'public'
  }

  const b = str.match(/(?<=\').*(?=')/gm)

  return (b && b[0]) || 'public'
}
const putDataInTable = (tableData, theme, state) => {
  // const {
  //   checkedRows = [],
  //   // tableData,
  //   numberOfDigitsAfterPoint: round,
  //   red = 'red',
  //   green = 'green',
  // } = state

  if (!tableData || tableData.length === 0) {
    return { head: [], body: [], footer: null }
  }

  return {
    head: [
      {
        id: 't',
        label: 'Timestamp',
        isNumber: false,
      },
      { id: 'pair', label: 'Pair', isNumber: false },
      { id: 'exchangeA', label: 'Exchange A', isNumber: false },
      { id: 'exchangeB', label: 'Exchange B', isNumber: false },
      { id: 'amount', label: 'amount', isNumber: false },
      { id: 'spread', label: 'spread', isNumber: false },
      { id: 'priceA', label: 'priceA', isNumber: false },
      { id: 'priceB', label: 'priceB', isNumber: false },
      { id: 'status', label: 'Status', isNumber: false },
    ],
    body: transformData(
      tableData,
      theme.palette.red.main,
      theme.palette.green.main,
      state
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

const transformData = (
  data: any[] = [],
  red: string = '',
  green: string = '',
  state
) => {
  return data.map((row) => {
    delete row._id
    delete row.sId
    delete row.__typename
    const keys = Object.keys(row)
    const resp = {}
    keys.map((k) => {
      if (k === 't') {
        const timeStamp = String(row[k]).substring(0, 10) + '...'

        resp[k] = {
          contentToSort: row[k],
          contentToCSV: row[k],
          render: timeStamp,
        }
      } else {
        resp[k] = {
          contentToSort: row[k],
          contentToCSV: row[k],
          render: row[k],
        }
      }
    })

    return resp
  })
}

const SignalEventList = (props) => {
  const { body, head, footer = [] } = putDataInTable(
    props.data.getSignalEvents.events,
    props.theme,
    props.state
  )

  return (
    <ContainerGrid container>
      <TableWithSort
        style={{ height: '100%', overflowY: 'scroll' }}
        id="SignalSocialTable"
        //title="Signal"
        columnNames={head}
        data={{ body, footer }}
        padding="dense"
        emptyTableText="No assets"
        tableStyles={{
          heading: {
            margin: '0',
            padding: '0 0 0 1rem',
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
            padding: '0 0 0 .3rem',
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
    </ContainerGrid>
  )
}

const SignalListItem = ({ el, onClick, isSelected, openDialog }) => {
  return (
    <FolioCard
      container
      onClick={onClick}
      border={isSelected ? '22px' : '22px 22px 0 0 '}
      boxShadow={!isSelected ? 'none' : ' 0px 0px 34px -25px rgba(0,0,0,0.6)'}
      borderRadius={!isSelected ? '22px 22px 0 0 ' : '22px'}
    >
      <Grid container justify="space-between">
        <Grid item>
          <PortfolioName textColor={'#16253D'}>{el.name}</PortfolioName>
          <TypographySubTitle>
            {el.owner + el.isPrivate ? ' Private signal' : ` Public signal`}
          </TypographySubTitle>
        </Grid>
        <TypographyEditButton onClick={() => openDialog(el._id)}>
          edit
        </TypographyEditButton>
      </Grid>
      <Grid
        container
        alignItems="center"
        alignContent="center"
        justify="space-between"
      >
        <FolioValuesCell item>
          <TypographyTitle>Last update</TypographyTitle>
          <TypographyTitle color={'#16253D'}>
            {/* {el.lastUpdate} */}
            today
          </TypographyTitle>
        </FolioValuesCell>
        <FolioValuesCell item center={true}>
          <div>
            <TypographyTitle>Signals generated</TypographyTitle>
            <TypographyTitle
              fontSize={'1rem'}
              color={isSelected ? '#97C15C' : '#2F7619'}
            >
              {/* {el.signalsCount} */}
              24
            </TypographyTitle>
          </div>
        </FolioValuesCell>
        <SwitchOnOff />
      </Grid>
    </FolioCard>
  )
}

const sortBy = [
  {
    label: 'name',
    value: '1',
  },
  {
    label: 'signals generated',
    value: '1',
  },
  {
    label: 'last update',
    value: '1',
  },
]

@withTheme()
class SocialPage extends React.Component {
  state = {
    selectedSignal: 0,
    isDialogOpen: false,
    currentSignalId: null,
    invervalId: null,
  }

  componentDidMount() {
    const invervalId = setInterval(() => {
      this.props.refetch()
    }, 30000)

    this.setState({ invervalId })
  }

  componentWillUnmount() {
    clearInterval(this.state.invervalId)
  }

  openDialog = (signalId) => {
    this.setState({ isDialogOpen: true, currentSignalId: signalId })
  }

  closeDialog = () => {
    this.setState({ isDialogOpen: false, currentSignalId: null })
  }

  render() {
    const {
      getFollowingSignalsQuery: { getFollowingSignals },
    } = this.props

    const { selectedSignal = 0 } = this.state
    const sharedSignalsList = getFollowingSignals.map((el, index) => (
      <SignalListItem
        key={index}
        isSelected={index === selectedSignal}
        el={el}
        onClick={() => {
          this.setState({ selectedSignal: index })
        }}
        openDialog={this.openDialog}
      />
    ))

    return (
      <Grid
        container
        xs={12}
        spacing={8}
        style={{ maxHeight: '100vh', overflow: 'hidden' }}
      >
        <Grid item xs={3} style={{ padding: '15px' }}>
          <SocialTabs style={{ height: '100%' }}>
            <GridSortOption container justify="flex-end" alignItems="center">
              <Grid item>
                <Grid container justify="space-between" alignItems="center">
                  <TypographySearchOption textColor={'#16253D'}>
                    Sort by
                  </TypographySearchOption>

                  <ReactSelectCustom
                    value={[sortBy[2]]}
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
            />
            <GridFolioScroll>
              {sharedSignalsList.length === 0 ? (
                <TypographyEmptyFolioPanel>
                  Signal has not been found in the list
                </TypographyEmptyFolioPanel>
              ) : (
                sharedSignalsList
              )}
            </GridFolioScroll>
          </SocialTabs>
        </Grid>
        <Grid lg={9} xs={9}>
          <Grid item xs={12} spacing={24} style={{ padding: '15px' }}>
            {getFollowingSignals.length > 0 &&
            getFollowingSignals[this.state.selectedSignal] ? (
              <QueryRenderer
                fetchPolicy="network-only"
                component={SignalEventList}
                query={GET_SIGNAL_EVENTS_QUERY}
                variables={{
                  signalId: getFollowingSignals[this.state.selectedSignal]._id,
                  page: 0,
                  perPage: 30,
                }}
                state={this.state}
                {...this.props}
              />
            ) : null}
          </Grid>
        </Grid>
        <SignalPreferencesDialog
          isDialogOpen={this.state.isDialogOpen}
          closeDialog={this.closeDialog}
          signalId={this.state.currentSignalId}
        />
      </Grid>
    )
  }
}

export default compose(
  queryRendererHoc({
    query: GET_FOLLOWING_SIGNALS_QUERY,
    name: 'getFollowingSignalsQuery',
    // fetchPolicy: 'network-only',
  })
)(SocialPage)

/*
TODO:
  mutation with data
  workable iconButtom reset to initial
*/
