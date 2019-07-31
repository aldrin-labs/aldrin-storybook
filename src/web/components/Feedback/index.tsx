import React, { Component, MouseEvent } from 'react'
import styled from 'styled-components'

import { Button } from '@material-ui/core'
import { BoldButton } from './Feedback.styles'

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
          <StyledButton
            onClick={() => {
              this.openLink(config.feedbackLink)
            }}
            color="secondary"
            variant="text"
          >
            Feedback
          </StyledButton>
        </Wrapper>
        <Wrapper borderColor={borderColor}>
          <StyledButton
            onClick={() => {
              this.openLink(config.bugLink)
            }}
          >
            Report bug
          </StyledButton>
        </Wrapper>
      </>
    )
  }
}

export const StyledButton = styled(Button)`
  font-size: 1.175rem;
`;

export const Wrapper = styled.div`
  display: flex;
  padding: 0.48rem 1.6rem;
  border-left: ${(props: { borderColor: string }) =>
    `1px solid ${props.borderColor}`};

  &:not(:first-child) {
    border-right: ${(props: { borderColor: string }) =>
    `1px solid ${props.borderColor}`};
  }

  @media(min-width: 2560px) {
    padding: 0 0.8rem;
  }
`
