import { MASTER_BUILD } from '@utils/config'

export const RebalancePeriod = [
  // { label: '3 days', value: '3' },
  ...(!MASTER_BUILD ? [
    { label: '3 days', value: '3' },
  ] : []),
  { label: '7 days', value: '7' },
  { label: '14 days', value: '14' },
  { label: '30 days', value: '30' },
]

export const RiskProfile = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]
