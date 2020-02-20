import { withSnackbarProps } from 'notistack'

export interface IPropsDataWrapper extends withSnackbarProps {
  getAccountSettingsQuery: {
    getAccountSettings: {
      authorizationSettings: {
        mfaEnabled: boolean
      }
    }
  }
}

export interface IPropsProfileSettings {
    isMfaAlreadyEnabled: boolean
    processEnablingMfa: () => ProcessEnablingMfaType
    enqueueSnackbar: withSnackbarProps.enqueueSnackbar
}

export type ProcessEnablingMfaType = Promise<{status: 'ERR'| 'OK', errorMessage: string}>