import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getBuyBackAmountForPeriod } from '@core/graphql/queries/pools/getBuyBackAmountForPeriod'
import { getStakingPoolInfo } from '@core/graphql/queries/staking/getStakingPool'
import { dayDuration } from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import { DAYS_TO_CHECK_BUY_BACK } from '@sb/dexUtils/staking/config'
import dayjs from 'dayjs'
import { compose } from 'recompose'

const StakingCard = () => {
    return null
}

export default compose(
    queryRendererHoc({
        query: getStakingPoolInfo,
        name: 'getStakingPoolInfoQuery',
        fetchPolicy: 'cache-and-network',
    }),
    queryRendererHoc({
        name: 'getBuyBackAmountForPeriodQuery',
        query: getBuyBackAmountForPeriod,
        fetchPolicy: 'cache-and-network',
        withoutLoading: true,
        pollInterval: 60000 * getRandomInt(5, 10),
        variables: () => {
            // we're using endOfDay only for first day of staking with buy back
            // TODO: remove it once we'll have records for more than one day
            const endOfDay = dayjs()
                .endOf('day')
                .unix()

            return {
                timestampFrom: endOfDay - dayDuration * DAYS_TO_CHECK_BUY_BACK,
                timestampTo: endOfDay,
            }
        },
    })
)(StakingCard)
