import moment from 'moment'

export const getEndDate = (stringDate: string) =>
  stringDate === '1Day'
    ? moment().subtract(1, 'days')
    : stringDate === '1Week'
    ? moment().subtract(1, 'weeks')
    : stringDate === '1Month'
    ? moment().subtract(1, 'months')
    : moment().subtract(3, 'months')

export const getEmptyTextPlaceholder = (tab: string) =>
  tab === 'openOrders'
    ? 'You have no open orders.'
    : tab === 'orderHistory'
    ? 'You have no order history'
    : tab === 'tradeHistory'
      ? 'You have no trades.'
      : tab === 'funds'
        ? 'You have no Funds'
        : []
