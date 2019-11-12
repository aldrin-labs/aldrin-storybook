import React from 'react'
import styled from 'styled-components'
import { withStyles } from '@material-ui/styles'
import { Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = (theme) => ({
  svg: {
    color: '#0B1FD1',
  },
})

const Wrapper = styled.div`
  position: relative;
  margin: 0 auto;
`
const Text = styled(Typography)`
  font-size: 1.4rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: bold;
  color: #dd6956;
  letter-spacing: 1.5px;
  position: absolute;
  top: 48.5%;
  left: 51%;
  transform: translateX(-50%) translateY(-50%);

  @media (min-width: 1921px) {
    font-weight: 1.5rem;
  }
`

const Progress = (props: any) => (
  <Wrapper>
    <CircularProgress variant="static" thickness={6} size={'7rem'} {...props} />
    <Text>{props.text}</Text>
  </Wrapper>
)

export default withStyles(styles)(Progress)
