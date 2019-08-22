import React from 'react'
import { compose } from 'recompose'
import moment from 'moment'

import withAuth from '@core/hoc/withAuth'
import { Grid } from '@material-ui/core'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_FOLLOWING_SIGNALS_QUERY } from '@core/graphql/queries/signals/getFollowingSignals'
import { updateSignal } from '@core/graphql/mutations/signals/updateSignal'

import { IProps, IState } from './SignalPage.types'

// import {
//   roundPercentage,
//   roundAndFormatNumber,
//   combineTableData,
// } from '@core/utils/PortfolioTableUtils'
import { withTheme } from '@material-ui/styles'
import SwitchOnOff from '@sb/components/SwitchOnOff'
// import { isObject, zip } from 'lodash-es'
import { graphql } from 'react-apollo'
// import SocialBalancePanel from '@sb/components/SocialBalancePanel/SocialBalancePanel'
import SocialTabs from '@sb/components/SocialTabs/SocialTabs'

import SignalPreferencesDialog from '@sb/components/SignalPreferencesDialog'
import OrderbookDialog from '@sb/components/OrderbookDialog'
import SignalEventList from './SignalEventList'

import {
  FolioCard,
  GridSortOption,
  ReactSelectCustom,
  TypographyHeader,
  TypographySearchOption,
  InputCustom,
  TypographyEmptyFolioPanel,
  TypographyTitle,
} from '@sb/compositions/Social/SocialPage.styles'

import {
  GridFolioScroll,
  FolioValuesCell,
  TypographySubTitle,
  TypographyEditButton,
} from './SignalPage.styles'

class SignalListItem extends React.Component<IProps, IState> {
  state = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    interval: undefined,
  }

  resetTimer = () => {
    this.setState({
      seconds: '00',
      minutes: '00',
      hours: '00',
      days: '00',
    })
  }

  countUp = () => {
    const { seconds, minutes, hours, days } = this.state
    const pad = (num: number | string) => (+num < 10 ? '0' + num : num)

    let updatedSeconds = +seconds + 1
    if (updatedSeconds < 60) {
      this.setState({ seconds: pad(updatedSeconds) })
      return null
    }

    let updatedMinutes = +minutes + 1
    if (updatedMinutes < 60) {
      this.setState({ seconds: '00', minutes: pad(updatedMinutes) })
      return null
    }

    let updatedHours = +hours + 1
    if (updatedHours < 24) {
      this.setState({ seconds: '00', minutes: '00', hours: pad(updatedHours) })
      return null
    }

    let updatedDays = +days + 1
    this.setState({
      seconds: '00',
      minutes: '00',
      hours: '00',
      days: pad(updatedDays),
    })
  }

  updateDate = () => {
    const { el } = this.props
    const { interval: interv } = this.state
    clearInterval(interv)

    let deltaSeconds = (Date.now() - el.updatedAt) / 1000

    const days = Math.floor(deltaSeconds / (3600 * 24))
    deltaSeconds -= days * 3600 * 24

    const hours = Math.floor(deltaSeconds / 3600)
    deltaSeconds -= hours * 3600

    const minutes = Math.floor(deltaSeconds / 60)
    deltaSeconds = Math.floor(deltaSeconds - minutes * 60)

    const interval = setInterval(this.countUp, 1000)

    this.setState({ days, hours, minutes, seconds: deltaSeconds, interval })
  }

  componentDidMount() {
    this.updateDate()
  }

  static getDerivedStateFromProps(props, state) {
    let deltaSeconds = (Date.now() - props.el.updatedAt) / 1000

    const days = Math.floor(deltaSeconds / (3600 * 24))
    deltaSeconds -= days * 3600 * 24

    const hours = Math.floor(deltaSeconds / 3600)
    deltaSeconds -= hours * 3600

    const minutes = Math.floor(deltaSeconds / 60)
    deltaSeconds = Math.floor(deltaSeconds - minutes * 60)

    return { days, hours, minutes, seconds: deltaSeconds }
  }

  componentWillUnmount() {
    const { interval } = this.state
    clearInterval(interval)
  }

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

    const { seconds, minutes, hours, days } = this.state

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
            <TypographyHeader textColor={'#16253D'}>{el.name}</TypographyHeader>
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
            <TypographyTitle
              color={'#16253D'}
              style={{ textTransform: 'none' }}
            >
              {`${days}d ${hours}h ${minutes}m ${seconds}s`}
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
            onChange={() => {
              toggleEnableSignal(index, _id, enabled, updateSignalMutation)
              this.resetTimer()
            }}
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
    signalsSort: signalsSortOptions[0],
    isOrderbookOpen: false,
    orderData: null,
    autoRefetch: true,
  }

  startRefetch = () => {
    const invervalId = setInterval(() => {
      this.props.refetch()
    }, 3000)

    this.setState({ invervalId })
  }

  componentDidMount() {
    const { autoRefetch } = this.state
    if (autoRefetch) this.startRefetch()
  }

  componentWillUnmount() {
    clearInterval(this.state.invervalId)
  }

  handleSearchInput = (e) => {
    this.setState({ search: e.target.value })
  }

  onSortChange = (optionSelected: { label: string; value: number }) => {
    this.setState({
      signalsSort: optionSelected,
    })
  }

  onTrClick = (data: any) => {
    this.setState({ isOrderbookOpen: true, orderData: data })
  }

  openDialog = (signalId: string | number) => {
    this.setState({ isDialogOpen: true, currentSignalId: signalId })
  }

  setCurrentSignal = (id: string | number) => {
    this.setState({ currentSignalId: id })
  }

  closeDialog = () => {
    this.setState({ isDialogOpen: false, currentSignalId: null })
  }

  closeOrderbookDialog = () => {
    this.setState({ isOrderbookOpen: false })
  }

  toggleEnableSignal = (
    arg: any,
    arg2: string,
    arg3: boolean,
    updateSignalMutation: (obj: object) => void
  ) => {
    updateSignalMutation({
      variables: {
        signalId: arg2,
        conditions: JSON.stringify([['enabled', 'boolean', !arg3]]),
      },
    })
  }

  toggleAutoRefetch = () => {
    this.setState(
      (prev) => ({ autoRefetch: !prev.autoRefetch }),
      () =>
        this.state.autoRefetch
          ? this.startRefetch()
          : clearInterval(this.state.invervalId)
    )
  }

  render() {
    const {
      selectedSignal = 0,
      currentSignalId,
      signalsSort,
      isOrderbookOpen,
      orderData,
      autoRefetch,
    } = this.state

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
            ? a.name && b.name && a.name.localeCompare(b.name)
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
        <Grid xs={9} style={{ padding: '15px', minHeight: '100%' }}>
          <Grid item xs={12} spacing={24} style={{ height: '100%' }}>
            {sortedData.length > 0 && sortedData[this.state.selectedSignal] ? (
              <SignalEventList
                {...this.props}
                signalId={sortedData[this.state.selectedSignal]._id}
                onTrClick={this.onTrClick}
                toggleAutoRefetch={this.toggleAutoRefetch}
                autoRefetch={autoRefetch}
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

        {orderData !== null ? (
          <OrderbookDialog
            isDialogOpen={isOrderbookOpen}
            closeDialog={this.closeOrderbookDialog}
            data={orderData}
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
    // fetchPolicy: 'network-only',
  }),
  graphql(updateSignal, {
    name: 'updateSignalMutation',
    options: {
      refetchQueries: [{ query: GET_FOLLOWING_SIGNALS_QUERY }],
    },
  })
)(SocialPage)
