import React from 'react'
import { Typography } from '@material-ui/core'

import { PTWrapper } from '@storybook/styles/cssUtils'

export default (props: { isEmpty: boolean; children: React.ReactChild }) => {
  if (props.isEmpty) {
    return (
      <PTWrapper tableData={true}>
        <Typography variant="h2" color="textPrimary" align="center">
          Add account for Portfolio.
        </Typography>
        <Typography variant="h4" color="textSecondary" align="center">
          Click on user icon at Navigation bar.
        </Typography>
      </PTWrapper>
    )
  }

  return <>{props.children}</>
}
