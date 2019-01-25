import React from 'react'

import ContentLoader from 'react-content-loader'
import { Theme } from '@material-ui/core/styles'
import { withTheme } from '@material-ui/styles'

const random = () => Math.random() * (1 - 0.7) + 0.7

const Loader = ({ color: { primary, secondary }, ...props }) => (
  <ContentLoader
    height={40}
    width={1060}
    speed={1}
    primaryColor={primary}
    secondaryColor={secondary}
    {...props}
  >
    <rect x="0" y="15" rx="4" ry="4" width="6" height="6.4" />
    <rect x="34" y="13" rx="6" ry="6" width={200 * random()} height="12" />
    <rect x="633" y="13" rx="6" ry="6" width={23 * random()} height="12" />
    <rect x="653" y="13" rx="6" ry="6" width={78 * random()} height="12" />
    <rect x="755" y="13" rx="6" ry="6" width={117 * random()} height="12" />
    <rect x="938" y="13" rx="6" ry="6" width={83 * random()} height="12" />
    <rect x="0" y="39" rx="6" ry="6" width="1060" height=".3" />
  </ContentLoader>
)

export default withTheme()(
  ({
    theme: {
      palette: {
        primary: { main: primary },
        secondary: { main: secondary },
      },
    },
    rows = 10,
  }: {
    theme: Theme
    rows?: number
  }) => (
    <React.Fragment>
      {Array(rows)
        .fill('')
        .map((e, i) => (
          <Loader
            key={i}
            color={{ primary, secondary }}
            style={{ opacity: Number(2 / i).toFixed(1) }}
          />
        ))}
    </React.Fragment>
  )
)
