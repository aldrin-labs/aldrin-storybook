import { Theme } from '@material-ui/core'

export default interface IProps {
  theme: Theme
  changeModeTheme: () => void
  togglePrivacyPolicy: () => void
  themeMode: 'dark' | 'light'
  fullscreenMode: boolean
  openPrivacyPolicy: boolean
}
