import React, { SyntheticEvent } from 'react'

import TooltipCustom from '../components/TooltipCustom/TooltipCustom'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import Replay from '@material-ui/icons/Replay'
import ClearIcon from '@material-ui/icons/Clear'
import SnapshotIcon from '@material-ui/icons/Camera'

export const getArrayOfActionElements = ({
  isEditModeEnabled,
  onEditModeEnable,
  onNewSnapshot,
  onDiscardChanges,
  onSaveClick,
  onReset,
  red,
  saveButtonColor,
}: {
  isEditModeEnabled: boolean
  onEditModeEnable: (event: SyntheticEvent<Element>) => void
  onNewSnapshot: () => void
  onDiscardChanges: () => void
  onSaveClick: (event: SyntheticEvent<Element>) => void
  onReset: (event: SyntheticEvent<Element>) => void
  red: string
  saveButtonColor: string
}) => {
  return [
    ...(!isEditModeEnabled
      ? [
          {
            id: 1,
            icon: (
              <TooltipCustom
                title={`Rebalance portfolio`}
                component={<EditIcon id="editButton" />}
              />
            ),
            onClick: onEditModeEnable,
            color: 'secondary',
            style: { color: saveButtonColor, marginRight: '7px' },
          },
        ]
      : []),
    ...(isEditModeEnabled
      ? [
          {
            id: 2,
            icon: (
              <TooltipCustom
                title={`Update snapshot`}
                component={<SnapshotIcon id="snapshotButton" />}
              />
            ),
            onClick: onNewSnapshot,
            style: { color: '#fff', marginRight: '7px' },
          },
          {
            id: 3,
            icon: (
              <TooltipCustom
                title={`Discard changes`}
                component={<ClearIcon id="discardChangesButton" />}
              />
            ),
            onClick: onDiscardChanges,
            style: { color: red, marginRight: '7px' },
          },
          {
            id: 4,
            icon: (
              <TooltipCustom
                title={`Reset to initial portfolio`}
                component={<Replay id="resetButton" />}
              />
            ),
            onClick: onReset,
            style: { marginRight: '7px' },
          },
          {
            id: 'random',
            icon: (
              <TooltipCustom
                title={`Save changes`}
                component={<SaveIcon id="saveButton" />}
              />
            ),
            onClick: onSaveClick,
            color: saveButtonColor,
            style: { color: saveButtonColor, marginRight: '7px' },
          },
        ]
      : []),
  ]
}
