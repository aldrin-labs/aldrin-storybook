import React, { Component, MouseEvent } from 'react'
import styled from 'styled-components'

import { Button } from '@material-ui/core'
import SvgIcon from '@sb/components/SvgIcon'
import TelegramIcon from '@icons/uil-telegram.svg'
import { BoldButton } from './Feedback.styles'

import config from '@core/utils/linkConfig'

export default class Feedback extends Component<{}, {}> {
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
    return (
      <>
        <Wrapper>
          <StyledButton
            onClick={() => {
              this.openLink(config.feedbackLink)
            }}
            style={{ color: '#0B1FD1' }}
            variant="text"
          >
            Feedback
          </StyledButton>
        </Wrapper>
        <Wrapper>
          <StyledButton
            onClick={() => {
              this.openLink(config.bugLink)
            }}
            style={{ color: '#DD6956' }}
          >
            Report bug
          </StyledButton>
        </Wrapper>
        <Wrapper>
          <StyledButton
            onClick={() => {
              this.openLink(config.bugLink)
            }}
            style={{ color: '#7284A0', textTransform: 'capitalize' }}
          >
            <SvgIcon
              src={TelegramIcon}
              width={'2rem'}
              height={'2rem'}
              style={{ marginRight: '5%' }}
            />
            Telegram
          </StyledButton>
        </Wrapper>
      </>
    )
  }
}

export const StyledButton = styled(Button)`
  font-size: 1.2rem;
  width: 100%;
  letter-spacing: 0.075rem;
  white-space: nowrap;

  @media only screen and (max-width: 1100px) {
    font-size: 0.9rem;
  }
  @media only screen and (min-width: 2367px) {
    font-size: 1rem;
  }
`

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 13rem;
  border-left: 0.1rem solid #e0e5ec;

  border-bottom: 0px;

  /* @media (min-width: 2560px) {
    padding: 0 0.8rem;
  } */
`
