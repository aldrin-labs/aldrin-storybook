import React from 'react'

export interface IProps {
  isEditModeEnabled: boolean
  saveButtonColor: string
  red: string
  onSaveClick: React.ReactEventHandler
  onEditModeEnable: React.ReactEventHandler
  onReset: React.ReactEventHandler
}
