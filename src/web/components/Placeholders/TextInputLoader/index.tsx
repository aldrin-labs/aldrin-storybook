import React from 'react'
import ContentLoader from 'react-content-loader'
import { withTheme } from '@material-ui/styles'

const TextInputLoader = (props) => (
  <div style={{ ...props.style }}>
    <ContentLoader
      height={60}
      width={150}
      speed={1}
      primaryColor={props.theme.palette.primary.main}
      secondaryColor={props.theme.palette.secondary.main}
      {...props}
    >
      <rect x="16" y="21.13" rx="3" ry="3" width="113.4" height="16.2" />
      <rect x="190" y="0" rx="3" ry="3" width="10" height="10" />
      <rect x="147.22" y="46.64" rx="0" ry="0" width="0" height="0" />
    </ContentLoader>
  </div>
)

const ThemeWrapper = withTheme()(TextInputLoader)

export default ThemeWrapper
