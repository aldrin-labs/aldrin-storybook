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
  font-size: 12px;
  letter-spacing: 1px;
  white-space: nowrap;

  @media only screen and (max-width: 1100px) {
    font-size: 9px;
  }
  @media only screen and (min-width: 2367px) {
    font-size: 1rem;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  padding: 0.48rem 1.6rem;
  border-left: ${(props: { borderColor: string }) =>
    `1px solid ${props.borderColor}`};

  border-bottom: 0px;

  @media(min-width: 2560px) {
    padding: 0 0.8rem;
  }
`
