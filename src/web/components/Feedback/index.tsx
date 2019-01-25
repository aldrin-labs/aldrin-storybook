import React, { Component, MouseEvent } from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'

import config from '@core/utils/linkConfig'

type Props = {
  borderColor: string
}

export default class Feedback extends Component<Props> {
  state = {
    anchorEl: null,
  }

  handleClick = (event: MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  openLink = (link: string = '') => {
    this.handleClose()
    window.open(link, 'CCAI Feedback')
  }

  render() {
    const { borderColor } = this.props
    return (
      <>
        <Wrapper borderColor={borderColor}>
          <Button
            onClick={() => {
              this.openLink(config.feedbackLink)
            }}
            color="secondary"
            variant="text"
            size="small"
          >
            Feedback
          </Button>
        </Wrapper>
        <Wrapper borderColor={borderColor}>
          <Button
            onClick={() => {
              this.openLink(config.bugLink)
            }}
            size="small"
          >
            Report bug
          </Button>
        </Wrapper>
      </>
    )
  }
}

export const Wrapper = styled.div`
  display: flex;
  padding: 0.5rem 1rem;
  border: ${(props: { borderColor: string }) =>
    `1px solid ${props.borderColor}`};
`
