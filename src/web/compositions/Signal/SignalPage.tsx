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

import { IProps, IState } from './SignalPage.types'

import { addMainSymbol, TableWithSort } from '@sb/components'
import {
    roundPercentage,
    roundAndFormatNumber,
    combineTableData,
} from '@core/utils/SignalTableUtils'
import { withTheme } from '@material-ui/styles'
import { isObject, zip } from 'lodash-es'

import SocialSignalInfoPanel from '@sb/components/SocialSignalInfoPanel/SocialSignalInfoPanel'
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
                        {el.isPrivate ? getOwner(el.owner) : `Public signal`}
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
                    <TypographyTitle>{new Date(el.lastUpdate)}</TypographyTitle>
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

    transformData = (data: any[] = [], red: string = '', green: string = '') => {
        const { numberOfDigitsAfterPoint: round = 2 } = this.state
        const isUSDCurrently = true

        return data.map((row) => ({
            // exchange + coin always uniq
            //  change in future
            id: row.id,
            name: row.name,
            coin: {
                contentToSort: row.coin,
                contentToCSV: row.coin,
                render: row.coin,
                style: { fontWeight: 700 },
            },
            signal: {
                // not formatted value for counting total in footer
                contentToSort: row.signalPercentage,
                contentToCSV: roundPercentage(row.signalPercentage) || 0,
                render: `${roundPercentage(row.signalPercentage) || 0}%`,
                isNumber: true,
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
                { id: 'name', label: 'Account', isNumber: false },
                { id: 'coin', label: 'coin', isNumber: false },
                { id: 'signal', label: 'signal', isNumber: true },
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
            getFollowingSignalsQuery: { getFollowingSignals },
        } = this.props

        console.log('getFollowingSignals', getFollowingSignals)

        const { selectedSignal = 0 } = this.state
        const { body, head, footer = [] } = this.putDataInTable(
            combineTableData(
                getFollowingSignals[selectedSignal].signalAssets,
                { usd: -100, percentage: -100 },
                true
            )
        )
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
                    <SocialSignalInfoPanel />

                    <Grid item xs={7} spacing={24} style={{ padding: '15px' }}>
                        <TableWithSort
                            id="SignalSocialTable"
                            title="Signal"
                            columnNames={head}
                            data={{ body, footer }}
                            padding="dense"
                            emptyTableText="No assets"
                        />
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default compose(
    queryRendererHoc({
        query: GET_FOLLOWING_SIGNALS_QUERY,
        withOutSpinner: false,
        withTableLoader: false,
        name: 'getFollowingSignalsQuery',
    })
)(SocialPage)
