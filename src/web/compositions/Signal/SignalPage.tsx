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
    SignalName,
    TypographyTitle,
    TypographyPercentage,
    FolioValuesCell,
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

const transformData = (data: any[] = [], red: string = '', green: string = '', state) => {

    return data.map((row) => {
        delete row._id
        delete row.sId
        delete row.__typename
        const keys = Object.keys(row)
        const resp = {}
        keys.map(k => {
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
        <TableWithSort
            id="SignalSocialTable"
            title="Signal"
            columnNames={head}
            data={{ body, footer }}
            padding="dense"
            emptyTableText="No assets"
        />
    )
}

const SignalListItem = ({ el, onClick, isSelected }) => (
    <Paper
        style={{ padding: '10px', marginBottom: '20px' }}
        elevation={isSelected ? 10 : 2}
    >
        <Grid container onClick={onClick} style={{ height: '120px' }}>
            <Grid container alignItems="center" justify="space-between">
                <SignalName textColor={'#16253D'} style={{ padding: '0' }}>
                    {el.name}
                    <TypographyTitle style={{ padding: '0', margin: '0' }}>
                        {el.owner + el.isPrivate ? ' Private signal' : ` Public signal`}
                    </TypographyTitle>
                </SignalName>
            </Grid>
            <Grid container alignItems="center" justify="space-between">
                <FolioValuesCell item justify="center" style={{ textAlign: 'center' }}>
                    <TypographyTitle>Name</TypographyTitle>
                    <TypographyTitle>{el.name}</TypographyTitle>
                </FolioValuesCell>
                <FolioValuesCell item justify="center" style={{ textAlign: 'center' }}>
                    <TypographyTitle>Signals generated</TypographyTitle>
                    <TypographyTitle fontSize={'0.75rem'} textColor={'#97C15C'}>
                        {el.signalsCount}
                    </TypographyTitle>
                </FolioValuesCell>
                <FolioValuesCell item justify="center" style={{ textAlign: 'center' }}>
                    <TypographyTitle>Last update</TypographyTitle>
                    <TypographyTitle>{el.lastUpdate}</TypographyTitle>
                </FolioValuesCell>
            </Grid>
        </Grid>
    </Paper>
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
            <Grid container xs={12} spacing={8}>
                <Grid item xs={3} style={{ padding: '15px' }}>
                    <SocialTabs>{sharedSignalsList}</SocialTabs>
                    {/* {sharedSignalsList} */}
                </Grid>
                <Grid lg={9}>
                    <Grid item xs={7} spacing={24} style={{ padding: '15px' }}>
                        {
                            getFollowingSignals.length > 0 && getFollowingSignals[this.state.selectedSignal] ?
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
                                /> : null
                        }
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
