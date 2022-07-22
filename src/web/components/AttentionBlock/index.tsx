import React from 'react'
import styled, { useTheme } from 'styled-components'

import Attention from '@icons/attention.svg'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

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
  color: ${(props) => props.color || props.theme.colors.white4};
  text-align: ${(props) => props.textAlign || 'center'};

  ${(props) => props.style};
`

const AttentionComponent = ({
  blockHeight = '12rem',
  iconSrc = Attention,
  iconStyle = {},
  textStyle = {},
  text = '',
  header,
}) => {
  const theme = useTheme()
  return (
    <RowContainer>
      <ColorTextBlock
        width="100%"
        height={blockHeight}
        background={theme.colors.red1}
      >
        <SvgIcon
          src={iconSrc}
          height={`${parseInt(blockHeight) / 2}rem`}
          width="auto"
          style={{ margin: '0 2rem 0 3rem', ...iconStyle }}
        />
        <Row
          direction="column"
          width="85%"
          margin="0 0 0 5rem"
          justify="space-around"
          align="flex-start"
          style={{
            padding: '.5rem 0',
          }}
        >
          {header && (
            <Title
              fontSize="2rem"
              textAlign="inherit"
              style={{
                ...textStyle,
                paddingRight: '1rem',
                fontFamily: 'Avenir Next Bold',
                margin: '0 0 1rem 0',
              }}
            >
              {header}
            </Title>
          )}
          <Title
            fontSize="1.4rem"
            textAlign="inherit"
            style={{ ...textStyle, paddingRight: '1rem' }}
          >
            {text}
          </Title>
        </Row>
      </ColorTextBlock>
    </RowContainer>
  )
}

export default AttentionComponent
