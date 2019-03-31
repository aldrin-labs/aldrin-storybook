import { ChangeEvent } from 'react'
import { Theme } from '@material-ui/core'
import { WithTheme } from '@material-ui/styles'

export interface IProps {
  tabIndex: number
  handleTabChange: (e: ChangeEvent<{}>, tabIndex: number | any) => void
  theme: Theme
}
