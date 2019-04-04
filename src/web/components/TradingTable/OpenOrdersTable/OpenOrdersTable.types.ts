import { ChangeEvent } from 'react'

export interface IProps {
  tab: string
  tabIndex: number
  handleTabChange: (e: ChangeEvent<{}>, tabIndex: number | any) => void
  show: boolean
}
