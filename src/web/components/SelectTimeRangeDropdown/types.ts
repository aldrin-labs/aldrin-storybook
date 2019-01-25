export interface IProps {
  style?: object
  period:
    | 'lastWeek'
    | 'lastDay'
    | 'lastMonth'
    | 'threeMonths'
    | 'sixMonths'
    | 'lastYear'
  setPeriodToStore: Function
}
