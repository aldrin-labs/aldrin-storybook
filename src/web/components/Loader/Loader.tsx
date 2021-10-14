import React from 'react'
import RinLogo from '@icons/DarkLogo.svg'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { AnimatedImage } from './Loader.styles'
import { Text } from '@sb/compositions/Rebalance/Rebalance.styles'
import { Theme } from '@sb/types/materialUI'
import DottedLoader from '@icons/dottedLoader.gif'

export const Loader = ({
  theme,
  width = '2.2rem',
  text = '',
  color = '#000',
}: {
  theme: Theme
  width?: string
  text?: string
  color?: string
}) => {
  return (
    <Row>
      <AnimatedImage width={width} height="auto" src={RinLogo} />
      <Text
        style={{ padding: '0 0 0 0.7rem' }}
        fontSize={'1.3rem'}
        fontFamily={'Avenir Next Light'}
        color={color}
        theme={theme}
      >
        {text}
      </Text>
      <img style={{ marginTop: '0.5rem' }} src={DottedLoader} width="4%" />
    </Row>
  )
}
