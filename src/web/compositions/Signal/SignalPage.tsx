import React from 'react'
import { compose } from 'recompose'
import moment from 'moment'

import withAuth from '@core/hoc/withAuth'
import { Grid } from '@material-ui/core'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_FOLLOWING_SIGNALS_QUERY } from '@core/graphql/queries/signals/getFollowingSignals'
import { GET_SIGNAL_EVENTS_QUERY } from '@core/graphql/queries/signals/getSignalEvents'
import { updateSignal } from '@core/graphql/mutations/signals/updateSignal'

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
import { graphql } from 'react-apollo'
import SocialBalancePanel from '@sb/components/SocialBalancePanel/SocialBalancePanel'
import SocialTabs from '@sb/components/SocialTabs/SocialTabs'
import SignalPreferencesDialog from '@sb/components/SignalPreferencesDialog'

import {
  FolioCard,
  GridSortOption,
  ReactSelectCustom,
  PortfolioName,
  TypographySearchOption,
  InputCustom,
  TypographyEmptyFolioPanel,
  TypographyTitle,
} from '@sb/compositions/Social/SocialPage.styles'

import {
  GridFolioScroll,
  FolioValuesCell,
  TypographySubTitle,
  ContainerGrid,
  TypographyEditButton,
} from './SignalPage.styles'

const putDataInTable = (tableData, theme, state) => {
  if (!tableData || tableData.length === 0) {
    return { head: [], body: [], footer: null }
  }

  return {
    head: [
      {
        id: 'timeStamp',
        label: 'Timestamp',
        isNumber: false,
      },
      { id: 'pair', label: 'Pair', isNumber: false },
      { id: 'exchangeA', label: 'Exchange A', isNumber: false },
      { id: 'exchangeB', label: 'Exchange B', isNumber: false },
      { id: 'amount', label: 'amount', isNumber: false },
      { id: 'spread', label: 'spread', isNumber: false },
      { id: 'pricea', label: 'pricea', isNumber: false },
      { id: 'priceb', label: 'priceb', isNumber: false },
      { id: 'status', label: 'Status', isNumber: false },
    ],
    body: transformData(tableData),
  }
}

const transformData = (data: any[]) => {
  const transformedData = data.map((row) => ({
    id: row._id,
    timestamp: {
      contentToSort: row.t,
      contentToCSV: row.t,
      render:
        (row.t && moment(row.t / 1000000).format('YYYY DD MMM h:mm:ss a')) ||
        '-',
    },
    pair: row.pair || '-',
    exchangeA: row.exchangea || '-',
    exchangeB: row.exchangeb || '-',
    amount: {
      contentToSort: row.amount,
      contentToCSV: roundAndFormatNumber(row.amount, 2, true),
      render: row.amount
        ? addMainSymbol(roundAndFormatNumber(row.amount, 2, true), true)
        : '-',
    },
    spread: {
      contentToSort: row.spread,
      contentToCSV: roundAndFormatNumber(row.spread, 2, false),
      render: row.spread
        ? `${roundAndFormatNumber(row.spread, 2, false)} %`
        : '-',
    },
    pricea: {
      contentToSort: row.pricea,
      contentToCSV: roundAndFormatNumber(row.pricea, 8, true),
      render: row.pricea ? roundAndFormatNumber(row.pricea, 8, true) : '-',
    },
    priceb: {
      contentToSort: row.priceb,
      contentToCSV: roundAndFormatNumber(row.priceb, 8, true),
      render: row.priceb ? roundAndFormatNumber(row.priceb, 8, true) : '-',
    },
    status: row.status || '-',
  }))

  return transformedData
}

const SignalEventList = (props) => {
  const { body, head, footer = [] } = putDataInTable(
    props.data.getSignalEvents.events,
    props.theme,
    props.state
  )

  return (
    <ContainerGrid container style={{ position: 'relative' }}>
      <TableWithSort
        style={{ height: '100%', overflowY: 'scroll' }}
        id="SignalSocialTable"
        // title="Signal"
        columnNames={head}
        data={{ body, footer }}
        padding="dense"
        emptyTableText="No assets"
        tableStyles={{
          heading: {
            margin: '0',
            // padding: '0 0 0 1rem',
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

class SignalListItem extends React.Component {
  render() {
    const {
      el,
      onClick,
      isSelected,
      openDialog,
      toggleEnableSignal,
      index,
      _id,
      enabled,
      updateSignalMutation,
    } = this.props
    console.log(el)
    return (
      <FolioCard
        container
        border={isSelected ? '22px' : '22px 22px 0 0 '}
        boxShadow={!isSelected ? 'none' : '0px 0px 34px -25px rgba(0,0,0,0.6)'}
        borderRadius={!isSelected ? '22px 22px 0 0 ' : '22px'}
        onClick={onClick}
      >
        <Grid container justify="space-between">
          <Grid item style={{ maxWidth: '70%' }}>
            <PortfolioName textColor={'#16253D'}>{el.name}</PortfolioName>
            <TypographySubTitle>
              {el.isPrivate ? ' Private signal' : ` Public signal`}
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
            <TypographyTitle>Last edit</TypographyTitle>
            <TypographyTitle color={'#16253D'}>
              {moment(+el.updatedAt).format('DD MMM') || '-'}
            </TypographyTitle>
          </FolioValuesCell>
          <FolioValuesCell item center={true}>
            <div>
              <TypographyTitle>Events generated</TypographyTitle>
              <TypographyTitle
                fontSize={'1rem'}
                color={isSelected ? '#97C15C' : '#2F7619'}
              >
                {el.eventsCount || '-'}
              </TypographyTitle>
            </div>
          </FolioValuesCell>
          <SwitchOnOff
            enabled={enabled}
            _id={_id}
            onChange={() =>
              toggleEnableSignal(index, _id, enabled, updateSignalMutation)
            }
          />
        </Grid>
      </FolioCard>
    )
  }
}

const signalsSortOptions = [
  {
    label: 'name',
    value: 'name',
  },
  {
    label: 'events generated',
    value: 'events',
  },
  {
    label: 'last update',
    value: 'update',
  },
]

@withTheme()
class SocialPage extends React.Component {
  state = {
    selectedSignal: 0,
    isDialogOpen: false,
    currentSignalId: null,
    invervalId: null,
    ids: [],
    followingSignalsList: [],
    search: '',
    signalsSort: signalsSortOptions[1],
  }

  handleSearchInput = (e) => {
    this.setState({ search: e.target.value })
  }

  onSortChange = (optionSelected: { label: string; value: number }) => {
    this.setState({
      signalsSort: optionSelected,
    })
  }

  openDialog = (signalId) => {
    this.setState({ isDialogOpen: true, currentSignalId: signalId })
  }

  setCurrentSignal = (id) => {
    this.setState({ currentSignalId: id })
  }

  closeDialog = () => {
    this.setState({ isDialogOpen: false, currentSignalId: null })
  }

  toggleEnableSignal = (arg, arg2, arg3, updateSignalMutation) => {
    updateSignalMutation({
      variables: {
        signalId: arg2,
        conditions: JSON.stringify([['enabled', 'boolean', !arg3]]),
      },
    })
  }

  render() {
    const { selectedSignal = 0, currentSignalId, signalsSort } = this.state

    const {
      getFollowingSignalsQuery: { getFollowingSignals },
      updateSignalMutation,
    } = this.props

    const filteredData = getFollowingSignals.length
      ? getFollowingSignals.filter((signal) => {
          return (
            signal.name
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) !== -1
          )
        })
      : []

    const sortedData = filteredData.length
      ? filteredData.sort((a, b) => {
          return signalsSort.value === signalsSortOptions[0].value
            ? (a.name && b.name && a.name.localeCompare(b.name))
            : signalsSort.value === signalsSortOptions[1].value
            ? b.eventsCount - a.eventsCount
            : b.updatedAt - a.updatedAt
        })
      : filteredData

    const sharedSignalsList = sortedData.map((el, index) => (
      <SignalListItem
        index={index}
        key={index}
        isSelected={index === selectedSignal}
        el={el}
        _id={el._id}
        enabled={el.enabled}
        toggleEnableSignal={this.toggleEnableSignal}
        updateSignalMutation={updateSignalMutation}
        openDialog={this.openDialog}
        onClick={() => {
          this.setState({ selectedSignal: index })
        }}
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
          <SocialTabs style={{ height: '100%' }} isDisabledMy={true}>
            <GridSortOption container justify="flex-end" alignItems="center">
              <Grid item>
                <Grid container justify="space-between" alignItems="center">
                  <TypographySearchOption textColor={'#16253D'}>
                    Sort by
                  </TypographySearchOption>

                  <ReactSelectCustom
                    value={[signalsSort]}
                    onChange={(optionSelected: {
                      label: string
                      value: string
                    }) => this.onSortChange(optionSelected)}
                    options={signalsSortOptions}
                    isSearchable={false}
                    isClearable={false}
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
        {currentSignalId !== null ? (
          <SignalPreferencesDialog
            isDialogOpen={this.state.isDialogOpen}
            closeDialog={this.closeDialog}
            signalId={currentSignalId}
            updateSignalMutation={updateSignalMutation}
          />
        ) : null}
      </Grid>
    )
  }
}

export default compose(
  withAuth,
  queryRendererHoc({
    query: GET_FOLLOWING_SIGNALS_QUERY,
    name: 'getFollowingSignalsQuery',
    // pollInterval: 5000,
    fetchPolicy: 'network-only',
  }),
  graphql(updateSignal, {
    name: 'updateSignalMutation',
    options: {
      refetchQueries: [{ query: GET_FOLLOWING_SIGNALS_QUERY }],
    },
  })
)(SocialPage)

/*
TODO:
  mutation with data
  workable iconButtom reset to initial
*/
