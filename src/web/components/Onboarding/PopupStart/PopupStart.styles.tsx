import React from 'react'
import styled, { css } from 'styled-components'

import { Grid, Typography } from '@material-ui/core'

export const ContentHeadingCss = css`
  color: #16253d;
  font-size: 1.6rem;
  font-weight: bold;
  letter-spacing: 0.6px;
`

export const ContentTextCss = css`
  color: #16253d;

  letter-spacing: 0.6px;
`

export const ContentHeading = styled(({ ...rest }) => <Typography {...rest} />)`
  ${ContentHeadingCss}
`

export const ContentText = styled(({ ...rest }) => <Typography {...rest} />)`
  ${ContentTextCss}
`
