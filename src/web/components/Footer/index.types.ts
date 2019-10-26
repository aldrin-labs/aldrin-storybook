export default interface IProps {
  getThemeModeQuery: {
    app: {
      themeMode: 'dark' | 'light'
    }
  }
  toggleThemeModeMutation: () => Promise<any>
  fullscreenMode: boolean
  showFooter: boolean
  isChartPage: boolean
}
