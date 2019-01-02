import { format as fns } from 'date-fns'

export const daysFromNow = (days: number) => {
  const formatTimestamp = (timestamp: number) => Math.round(timestamp / 1000)

  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(0, 0, 0, 0)

  return formatTimestamp(date.getTime())
}

export const formatDate = (
  date: number,
  format: string = 'MM/DD/YYYY - hh:m:s A'
): string => fns(new Date(date * 1000).toLocaleString('en-US'), format)
