import { withSnackbarProps } from 'notistack'
import { CachePersistor } from 'apollo-cache-persist'
import { History } from 'history'

export interface IPropsDataWrapper extends withSnackbarProps {
  getAccountSettingsQuery: {
    getAccountSettings: {
      authorizationSettings: {
        mfaEnabled: boolean
      }
    }
  }
  persistorInstance: CachePersistor<any>
  logoutMutation: () => Promise<any>
  history: History
}

export interface IPropsProfileSettings {
    isMfaAlreadyEnabled: boolean
    processEnablingMfa: () => ProcessEnablingMfaType
    enqueueSnackbar: withSnackbarProps["enqueueSnackbar"]
    logout: () => Promise<void>
}

export type ProcessEnablingMfaType = Promise<{status: 'ERR'| 'OK', errorMessage: string}>