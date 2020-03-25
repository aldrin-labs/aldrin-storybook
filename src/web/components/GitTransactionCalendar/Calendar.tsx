import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import dayjs from 'dayjs'
// import { client } from '@core/graphql/apolloClient'
import { getTimeZone } from '@core/utils/dateUtils'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { withStyles } from '@material-ui/styles'
import QueryRenderer from '@core/components/QueryRenderer'
import { getCalendarActions } from '@core/graphql/queries/portfolio/main/getCalendarActions'
import { getSpotCalendarActions } from '@core/graphql/queries/portfolio/main/getSpotCalendarActions'
import { getFuturesCalendarActions } from '@core/graphql/queries/portfolio/main/getFuturesCalendarActions'
import { getFormattedProfit } from '@core/containers/TradeOrderHistory/TradeOrderHistory'
import { IProps } from './Calendar.types'
import { getCalendarData, getMaxTransactions } from './Calendar.utils'
import {
  LEGEND_COLORS,
  HeatmapWrapper,
  LegendHeatmapSquare,
  LegendTypography,
  SquarePopup,
  PopupInfoBlock,
  PopupInfoTitle,
  PopupInfoValue,
  PopupInfoContainer,
  PopupDateContainer,
  StyleForCalendar,
} from './Calendar.styles'

const SquarePopupTooltip = ({ squareDayInfo, isSPOTCurrently, inputRef }) => {
  const {
    transactionsCount,
    realizedPnlSum,
    BNBFee,
    USDTFee,
    date,
  } = squareDayInfo

  return (
    <SquarePopup ref={inputRef}>
      <PopupDateContainer>
        {dayjs(date).format('DD MMM, YYYY')}
      </PopupDateContainer>
      <PopupInfoContainer>
        <PopupInfoBlock isFirstBlock>
          <PopupInfoTitle>trades</PopupInfoTitle>
          <PopupInfoValue>{transactionsCount}</PopupInfoValue>
        </PopupInfoBlock>

        <PopupInfoBlock>
          <PopupInfoTitle>P&L</PopupInfoTitle>
          {isSPOTCurrently ? (
            <PopupInfoValue isSPOTRealized>soon</PopupInfoValue>
          ) : (
            <PopupInfoValue>
              {getFormattedProfit((+realizedPnlSum).toFixed(5))}
            </PopupInfoValue>
          )}
        </PopupInfoBlock>
        {!isSPOTCurrently && (
          <>
            <PopupInfoBlock>
              <PopupInfoTitle>USDT Fee</PopupInfoTitle>
              <PopupInfoValue>{(+USDTFee).toFixed(5)}</PopupInfoValue>
            </PopupInfoBlock>
            <PopupInfoBlock>
              <PopupInfoTitle>BNB Fee</PopupInfoTitle>
              <PopupInfoValue>{(+BNBFee).toFixed(5)}</PopupInfoValue>
            </PopupInfoBlock>
          </>
        )}
      </PopupInfoContainer>
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
  // spot
  legendZero: { fill: LEGEND_COLORS.zero },
  legendOne: { fill: LEGEND_COLORS.one },
  legendTwo: { fill: LEGEND_COLORS.two },
  legendThree: { fill: LEGEND_COLORS.three },
  legendFour: { fill: LEGEND_COLORS.four },
  // futures profit +$
  legendOneProfit: { fill: LEGEND_COLORS.oneProfit },
  legendTwoProfit: { fill: LEGEND_COLORS.twoProfit },
  legendThreeProfit: { fill: LEGEND_COLORS.threeProfit },
  legendFourProfit: { fill: LEGEND_COLORS.fourProfit },
  // futures loss -$
  legendOneLoss: { fill: LEGEND_COLORS.oneLoss },
  legendTwoLoss: { fill: LEGEND_COLORS.twoLoss },
  legendThreeLoss: { fill: LEGEND_COLORS.threeLoss },
  legendFourLoss: { fill: LEGEND_COLORS.fourLoss },
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
        BNBFee: null,
        USDTFee: null,
        date: null,
      },
    }
  }

  render() {
    const {
      getCalendarActionsQuery,
      startDate,
      endDate,
      onHeatmapDateClick,
      classes,
      isSPOTCurrently,
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

    return (
      <HeatmapWrapper>
        {ReactDOM.createPortal(
          <SquarePopupTooltip
            inputRef={(el) => (this.popupRef = el)}
            isSPOTCurrently={isSPOTCurrently}
            squareDayInfo={this.state.squareDayInfo}
          />,
          document.body
        )}

        <CalendarHeatmap
          className={classes.root}
          startDate={dayjs(+startDate).subtract(1, 'second')}
          endDate={dayjs(+endDate)}
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
              BNBFee,
              USDTFee,
              date,
            } = value

            popupRef.style.display = 'block'
            popupRef.style.top = `${y -
              // wrapperRef.current.offsetTop -
              window.innerHeight / 10}px`

            popupRef.style.left = `${x +
              // wrapperRef.current.offsetLeft +
              window.innerWidth / 120}px`

            this.setState({
              squareDayInfo: {
                transactionsCount,
                futuresTradesCount,
                spotTradesCount,
                exchangeTransactionsCount,
                realizedPnlSum,
                BNBFee,
                USDTFee,
                date,
              },
            })
          }}
          onMouseLeave={() => {
            const popupRef = this.popupRef
            popupRef.style.display = 'none'
          }}
        />
      </HeatmapWrapper>
    )
  }
}

const CalendarDataWrapper = ({ ...props }) => {
  let { startDate, endDate, pageType } = props
  const timezone = getTimeZone()
  const isSPOTCurrently = pageType === 'SPOT'

  startDate = +startDate
  endDate = +endDate

  return (
    <QueryRenderer
      component={GitTransactionCalendar}
      query={
        // getCalendarActions
        isSPOTCurrently ? getSpotCalendarActions : getFuturesCalendarActions
      }
      pollInterval={30000}
      name={`getCalendarActionsQuery`}
      fetchPolicy="cache-and-network"
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
