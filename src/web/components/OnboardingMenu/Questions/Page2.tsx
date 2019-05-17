import * as React from 'react'

import { Typography, Link } from '@material-ui/core'

import Layout from './Layout'

import {
  Wrapper,
  StyledTypography,
  StyledBeginButton,
  ButtonContainer,
  ContentContainer,
  WelcomeTextContainer,
} from './styles'

export const Page = (props) => (
  <Layout
    step={props.step}
    question="bbb"
    changeStep={props.changeStep}
  >
    aaa
  </Layout>
)

export default Page
