import React from 'react'
import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  svg: {
      color: '#0B1FD1'
  }
});

const Wrapper = styled.div`
    position: relative;
    margin: 0 auto;
`
const Text = styled(Typography)`
    font-size: 1.5rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: bold;
    color: #dd6956;
    letter-spacing: 1.5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
`

const Progress = (props: any) => <Wrapper>
    <CircularProgress variant="static" thickness={4.2} size={70} {...props}/>
    <Text>{props.text}</Text>
</Wrapper>

export default withStyles(styles)(Progress)
