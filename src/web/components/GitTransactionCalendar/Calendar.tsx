import React, { PureComponent } from 'react'
import moment from 'moment'
// import { client } from '@core/graphql/apolloClient'

import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import ChoosePeriod from '@sb/components/ChoosePeriod/ChoosePeriod'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'

import QueryRenderer from '@core/components/QueryRenderer'
import { getCalendarActions } from '@core/graphql/queries/portfolio/main/getCalendarActions'
import { getFormattedProfit } from '@core/containers/TradeOrderHistory/TradeOrderHistory'

import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { IProps } from './Calendar.types'
import { getCalendarData, getMaxTransactions } from './Calendar.utils'
import {
  LEGEND_COLORS,
  HeatmapWrapper,
  LegendHeatmapSquare,
  LegendTypography,
  SquarePopup,
  StyleForCalendar,
} from './Calendar.styles'

const SquarePopupTooltip = ({ squareDayInfo, isSPOTCurrently, inputRef }) => {
  const { transactionsCount, realizedPnlSum, date } = squareDayInfo

  return (
    <SquarePopup ref={inputRef}>
      {isSPOTCurrently ? (
        <>
          <span>
            {transactionsCount} {transactionsCount === 1 ? `action` : 'actions'}
            {` on ${moment(date).format('DD MMM, YYYY')}`}
          </span>
        </>
      ) : (
        <>
          <span>
            {transactionsCount}{' '}
            {transactionsCount === 1 ? `futures trade` : 'futures trades'}
          </span>
          <p>
            {getFormattedProfit(realizedPnlSum)} {'realized profit'}
          </p>
          <span>on {moment(date).format('DD MMM, YYYY')}</span>
        </>
      )}
    </SquarePopup>
  )
}

const styles = (theme) => ({
  root: {
    fontSize: '0.9rem',
    fontFamily: 'DM Sans',
    lineHeight: '2rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  legendZero: { fill: LEGEND_COLORS.zero },
  legendOne: { fill: LEGEND_COLORS.one },
  legendTwo: { fill: LEGEND_COLORS.two },
  legendThree: { fill: LEGEND_COLORS.three },
  legendFour: { fill: LEGEND_COLORS.four },
})

class GitTransactionCalendar extends PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)

    this.popupRef = React.createRef()
    this.state = {
      squareDayInfo: {
        transactionsCount: null,
        futuresTradesCount: null,
        spotTradesCount: null,
        exchangeTransactionsCount: null,
        realizedPnlSum: null,
        date: null,
      },
    }
  }

  componentDidMount() {
    this.props.getCalendarActionsQueryRefetch()
  }

  render() {
    const {
      getCalendarActionsQuery,
      startDate,
      endDate,
      tradeOrderHistoryDate,
      onDatesChange,
      onFocusChange,
      onHeatmapDateClick,
      onDateButtonClick,
      activeDateButton,
      classes,
      wrapperRef,
      concreteDaySelected,
      isSPOTCurrently,
      togglePageType,
    } = this.props

    const maxTransactionsCount = getMaxTransactions(
      getCalendarActionsQuery.myPortfolios[0],
      isSPOTCurrently
    )

    const { mappedActionsArray } = getCalendarData(
      getCalendarActionsQuery.myPortfolios[0],
      maxTransactionsCount,
      startDate,
      isSPOTCurrently
    )

    const maximumDate = moment().endOf('day')
    const minimumDate = moment().subtract(3, 'years')

    return (
      <HeatmapWrapper
        style={{
          paddingTop: '15px',
          paddingBottom: '5px',
        }}
      >
        <SquarePopupTooltip
          inputRef={(el) => (this.popupRef = el)}
          isSPOTCurrently={isSPOTCurrently}
          squareDayInfo={this.state.squareDayInfo}
        />

        <CalendarHeatmap
          className={classes.root}
          startDate={moment(+startDate).subtract(1, 'seconds')}
          endDate={moment(+endDate)}
          values={mappedActionsArray}
          gutterSize={3}
          classForValue={(value) => {
            return value ? classes[value.className] : 'empty-value'
          }}
          showWeekdayLabels={true}
          monthLabels={[
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ]}
          onClick={onHeatmapDateClick}
          onMouseOver={(e, value) => {
            const popupRef = this.popupRef
            const { x, y } = e.target.getBoundingClientRect()

            const {
              transactionsCount,
              futuresTradesCount,
              spotTradesCount,
              exchangeTransactionsCount,
              realizedPnlSum,
              date,
            } = value

            popupRef.style.display = 'block'
            popupRef.style.top = `${y - wrapperRef.current.offsetTop - 30}px`
            popupRef.style.left = `${x - wrapperRef.current.offsetLeft + 20}px`

            this.setState({
              squareDayInfo: {
                transactionsCount,
                futuresTradesCount,
                spotTradesCount,
                exchangeTransactionsCount,
                realizedPnlSum,
                date,
              },
            })
          }}
          onMouseLeave={() => {
            const popupRef = this.popupRef
            popupRef.style.display = 'none'
          }}
        />

        <Grid
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
          className="ChoosePeriodsBlock"
          style={{
            margin: '.75rem 0 2.5rem',
            padding: '0 1rem 0 0',
            marginTop: '-4%',
          }}
        >
          <Grid item>
            <ChoosePeriod
              isTableCalendar={true}
              {...{
                ...tradeOrderHistoryDate,
                concreteDaySelected,
                maximumDate,
                minimumDate,
                onFocusChange,
                onDatesChange,
                onDateButtonClick,
                activeDateButton,
              }}
            />
          </Grid>
          <Grid item>
            <PillowButton
              firstHalfText={'spot'}
              secondHalfText={'futures'}
              activeHalf={isSPOTCurrently ? 'first' : 'second'}
              changeHalf={togglePageType}
            />
          </Grid>
          <Grid
            item
            alignItems="center"
            style={{
              width: 'auto',
              display: 'flex',
            }}
          >
            <LegendTypography>Less</LegendTypography>
            <LegendHeatmapSquare fill={LEGEND_COLORS.zero} />
            <LegendHeatmapSquare fill={LEGEND_COLORS.one} />
            <LegendHeatmapSquare fill={LEGEND_COLORS.two} />
            <LegendHeatmapSquare fill={LEGEND_COLORS.three} />
            <LegendHeatmapSquare fill={LEGEND_COLORS.four} />
            <LegendTypography>More</LegendTypography>
          </Grid>
        </Grid>
        <StyleForCalendar />
      </HeatmapWrapper>
    )
  }
}

const CalendarDataWrapper = ({ ...props }) => {
  let { startDate, endDate, pageType } = props
  const timezone = moment().format('ZZ')
  const isSPOTCurrently = pageType === 'SPOT'

  startDate = +startDate
  endDate = +endDate

  return (
    <QueryRenderer
      component={GitTransactionCalendar}
      query={getCalendarActions}
      name={`getCalendarActionsQuery`}
      fetchPolicy="network-only"
      variables={{
        input: {
          timezone,
          startDate,
          endDate,
        },
      }}
      {...props}
      isSPOTCurrently={isSPOTCurrently}
      startDate={startDate}
      endDate={endDate}
    />
  )
}

export default withStyles(styles)(CalendarDataWrapper)
