import * as React from 'react'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import menuIcon from '@icons/menu.svg'

import { Props } from '@components/Widget/types'

export default class Widget extends React.Component<Props> {
  render() {
    const { children, heading, icon } = this.props
    const dndStyles = { cursor: '-webkit-grab', zIndex: 1 }

    return (
      <Container>
        <HeadingWrapper>
          <Wrapper>
            {icon && <SvgIcon src={icon} width={24} height={24} />}
            <Heading>{heading}</Heading>
          </Wrapper>
          <span className="dnd" style={dndStyles}>
            <SvgIcon src={menuIcon} width={24} height={24} />
          </span>
        </HeadingWrapper>
        {children}
      </Container>
    )
  }
}

const Heading = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  text-align: left;
  color: #fff;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  & > *:first-child {
    margin-right: 5px;
  }
`

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 16px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #0006;
`
