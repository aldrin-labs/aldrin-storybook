import React from 'react'
import dayjs from 'dayjs'
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
  timestampSnapshot: typeof dayjs | null
  onNewSnapshot: () => void
  tableData: any
}