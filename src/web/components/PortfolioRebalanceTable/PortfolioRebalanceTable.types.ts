import React from 'react'
import moment from 'moment'
import { Theme } from '@material-ui/core'

export interface IProps {
  onDiscardChanges: () => void
  isEditModeEnabled: boolean
  onSaveClick: React.ReactEventHandler
  onReset: React.ReactEventHandler
  onEditModeEnable: React.ReactEventHandler
  loading: boolean
  theme: Theme
  red: string
  saveButtonColor: string
  timestampSnapshot: moment.Moment | null
  onNewSnapshot: () => void
  tableData: any
}
