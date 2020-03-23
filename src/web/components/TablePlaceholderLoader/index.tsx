import React from 'react'
import ContentLoader from 'react-content-loader'
import { withTheme } from '@material-ui/styles'

const MyLoader = (props) => (
  <div
    style={{
      margin: `${props.margin || 'auto'}`,
      height: '100%',
      width: '100%',
    }}
  >
    <ContentLoader
      height={160}
      width={300}
      speed={1}
      primaryColor={props.theme.palette.primary.main}
      secondaryColor={props.theme.palette.secondary.main}
      {...props}
    >
      <circle cx="33" cy="51" r="8" />
      <rect x="48" y="46" rx="5" ry="5" width="220" height="10" />
      <circle cx="33" cy="81" r="8" />
      <rect x="48" y="76" rx="5" ry="5" width="220" height="10" />
      <circle cx="33" cy="111" r="8" />
      <rect x="48" y="106" rx="5" ry="5" width="220" height="10" />
      <circle cx="33" cy="141" r="8" />
      <rect x="48" y="135" rx="5" ry="5" width="220" height="10" />
      <rect
        x="13"
        y="8"
        rx="5"
        ry="5"
        width="266.2"
        height="25.099999999999998"
      />
    </ContentLoader>
  </div>
)

const ThemeWrapper = withTheme()(MyLoader)

export default ThemeWrapper
