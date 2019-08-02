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
import { isObject, zip } from 'lodash-es'

import SocialBalancePanel from '@sb/components/SocialBalancePanel/SocialBalancePanel'
import SocialTabs from '@sb/components/SocialTabs/SocialTabs'

import {
  GridFolioScroll,
  InputCustom,
  TypographyPercentage,
  TypographySearchOption,
  GridPageContainer,
  GridSortOption,
  GridTableContainer,
  ReactSelectCustom,
  TableContainer,
  SignalName,
  TypographyTitle,
  PortfolioName,
  FolioValuesCell,
  FolioCard,
  GridContainerTitle,
  TypographyContatinerTitle,
} from './SignalPage.styles'

const getOwner = (str: string) => {
  if (!str) {
    return 'public'
  }

  const b = str.match(/(?<=\').*(?=')/gm)

  return (b && b[0]) || 'public'
}
const putDataInTable = (tableData, theme, state) => {
  const {
    checkedRows = [],
    // tableData,
    numberOfDigitsAfterPoint: round,
    red = 'red',
    green = 'green',
  } = state
  if (!tableData || tableData.length === 0) {
    return { head: [], body: [], footer: null }
  }

  return {
    head: [
      { id: 't', label: 'Timestamp', isNumber: false },
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
      resp[k] = {
        contentToSort: row[k],
        contentToCSV: row[k],
        render: row[k],
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
    <Grid container style={{ margin: '0', padding: '0' }}>
      <GridContainerTitle
        bgColor={theme.palette.primary.dark}
        content
        alignItems="center"
      >
        <TypographyContatinerTitle textColor={theme.palette.text.subPrimary}>
          Signal
        </TypographyContatinerTitle>
      </GridContainerTitle>
      <TableWithSort
        //style={{ height: '50vh', overflow: 'scroll' }}
        id="SignalSocialTable"
        //title="Signal"
        columnNames={head}
        data={{ body, footer }}
        padding="dense"
        emptyTableText="No assets"
        tableStyles={{
          heading: {
            margin: '0',
            padding: '0', //'0 0 0 18px',
            textAlign: 'left',
            maxWidth: '14px',
            background: '#F2F4F6',
            fontFamily: "'DM Sans'",
            fontSize: '0.9rem',
            color: '#7284A0',
            lineHeight: '31px',
            letterSpacing: '1.5px',
            // '&&:first-child': {
            //   // Does'n work
            //   borderRadius: '22px 0 0 0',
            //   background: 'red',
            // },
            // '&&:last-child': {
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
            //   // Does'n work
            // '&&:first-child': {
            //   color: 'red',
            //   background: 'red',
            // },
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
  )
}

const SignalListItem = ({ el, onClick, isSelected }) => (
  // <Paper
  //     style={{ padding: '10px', marginBottom: '20px' }}
  //     elevation={isSelected ? 10 : 2}
  // >
  //     <Grid container onClick={onClick} style={{ height: '120px' }}>
  //         <Grid container alignItems="center" justify="space-between">
  //             <SignalName textColor={'#16253D'} style={{ padding: '0' }}>
  //                 {el.name}
  //                 <TypographyTitle style={{ padding: '0', margin: '0' }}>
  //                     {el.owner + el.isPrivate ? ' Private signal' : ` Public signal`}
  //                 </TypographyTitle>
  //             </SignalName>
  //         </Grid>
  //         <Grid container alignItems="center" justify="space-between">
  //             <FolioValuesCell item justify="center" style={{ textAlign: 'center' }}>
  //                 <TypographyTitle>Name</TypographyTitle>
  //                 <TypographyTitle>{el.name}</TypographyTitle>
  //             </FolioValuesCell>
  //             <FolioValuesCell item justify="center" style={{ textAlign: 'center' }}>
  //                 <TypographyTitle>Signals generated</TypographyTitle>
  //                 <TypographyTitle fontSize={'0.75rem'} textColor={'#97C15C'}>
  //                     {el.signalsCount}
  //                 </TypographyTitle>
  //             </FolioValuesCell>
  //             <FolioValuesCell item justify="center" style={{ textAlign: 'center' }}>
  //                 <TypographyTitle>Last update</TypographyTitle>
  //                 <TypographyTitle>{el.lastUpdate}</TypographyTitle>
  //             </FolioValuesCell>
  //         </Grid>
  //     </Grid>
  // </Paper>

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
        <TypographyTitle
          fontSize={'0.9rem'}
          textColor={'#7284A0'}
          paddingText={'0'}
          marginText={'0'}
        >
          {el.owner + el.isPrivate ? ' Private signal' : ` Public signal`}
        </TypographyTitle>
      </Grid>
      {/* <SvgIcon width="10" height="10" src={LineGraph} /> */}
    </Grid>
    <Grid container alignItems="center" justify="space-between">
      <FolioValuesCell item>
        <div>
          <TypographyTitle>Name</TypographyTitle>
          <TypographyTitle fontSize={'1rem'} textColor={'#16253D'}>
            {el.name}
          </TypographyTitle>
        </div>
      </FolioValuesCell>
      <FolioValuesCell item>
        <div>
          <TypographyTitle>Signals generated</TypographyTitle>
          <TypographyTitle
            fontSize={'1rem'}
            textColor={isSelected ? '#97C15C' : '#2F7619'}
          >
            {el.signalsCount}
          </TypographyTitle>
        </div>
      </FolioValuesCell>
      <FolioValuesCell item>
        <div>
          <TypographyTitle>Last update</TypographyTitle>
          <TypographyTitle fontSize={'1rem'} textColor={'#16253D'}>
            {el.lastUpdate}
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
    selectedSignal: 0,
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
          <SocialTabs>{sharedSignalsList}</SocialTabs>
          {/* {sharedSignalsList} */}
        </Grid>
        <Grid lg={9}>
          <Grid item xs={7} spacing={24} style={{ padding: '15px' }}>
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
      </Grid>
    )
  }
}

export default compose(
  queryRendererHoc({
    query: GET_FOLLOWING_SIGNALS_QUERY,
    name: 'getFollowingSignalsQuery',
    fetchPolicy: 'network-only',
  })
)(SocialPage)
