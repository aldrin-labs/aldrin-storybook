import React from 'react'
import styled from 'styled-components'

import Attention from '@icons/attention.svg'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { SvgIcon } from '..'

export const ColorTextBlock = styled.div`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '4.5rem'};
  font-size: 1.2rem;
  font-family: Avenir Next Medium;
  border-radius: 1.5rem;

  display: flex;
  background: ${(props) => props.background || '#383b45'};
  justify-content: ${(props) => props.justify || 'space-evenly'};
  flex-direction: ${(props) => props.direction || 'row'};
  align-items: center;
`

export const Title = styled(
  ({ fontSize, color, textAlign, style, ...props }) => <span {...props} />
)`
  font-family: Avenir Next Medium;
  font-size: ${(props) => props.fontSize || '1.4rem'};
  color: ${(props) => props.color || '#ecf0f3'};
  text-align: ${(props) => props.textAlign || 'center'};

  ${(props) => props.style};
`

const AttentionComponent = ({
  blockHeight = '12rem',
  iconStyle = {},
  textStyle = {},
  text = '',
}) => {
  return (
    <RowContainer>
      <ColorTextBlock
        width="100%"
        height={blockHeight}
        background="rgba(242, 154, 54, 0.5)"
      >
        <SvgIcon
          src={Attention}
          height={`${parseInt(blockHeight) / 2}rem`}
          width="auto"
          style={{ margin: '0 2rem 0 3rem', ...iconStyle }}
        />
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '85%',
            justifyContent: 'space-around',
            padding: '.5rem 0',
          }}
        >
          <Title
            fontSize="1.4rem"
            textAlign="inherit"
            style={{ ...textStyle, paddingRight: '1rem' }}
          >
            {text}
          </Title>
        </span>
      </ColorTextBlock>
    </RowContainer>
  )
}

export default AttentionComponent
