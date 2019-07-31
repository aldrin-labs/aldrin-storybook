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
  font-size: .835em;
`;

export const Wrapper = styled.div`
  display: flex;
  padding: 0.3rem 1rem;
  border-left: ${(props: { borderColor: string }) =>
    `1px solid ${props.borderColor}`};

<<<<<<< HEAD
  border-bottom: 0px;

||||||| merged common ancestors
=======
  &:not(:first-child) {
    border-right: ${(props: { borderColor: string }) =>
    `1px solid ${props.borderColor}`};
  }

>>>>>>> 5abd75b1a629d2c447c160885331de987d214f99
  @media(min-width: 2560px) {
    padding: 0rem 0.5rem;
  }
`
