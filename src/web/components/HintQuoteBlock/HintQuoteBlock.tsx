import React, { CSSProperties, useEffect, useState } from 'react'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader } from '@sb/compositions/Pools/components/Popups/index.styles'
import { Text } from '@sb/components/Typography'

import HintIcon from '@icons/hint.svg'
import { useInterval } from '@sb/dexUtils/useInterval'
import SvgIcon from '../SvgIcon'
import { getRandomHint } from './hints'

export const HintQuoteBlock = ({
  hintTextStyles,
}: {
  hintTextStyles?: CSSProperties
}) => {
  const [hintText, setHintText] = useState('')

  useEffect(() => {
    setHintText(getRandomHint())
  }, [])

  useInterval(() => {
    setHintText(getRandomHint())
  }, 10000)

  return (
    <RowContainer direction="column">
      <RowContainer justify="space-between">
        <BoldHeader>Did you know?</BoldHeader>
        <SvgIcon src={HintIcon} height="3rem" width="3rem" />
      </RowContainer>
      <RowContainer margin="1rem 0 0 0" style={{ ...hintTextStyles }}>
        <Text>{hintText}</Text>
      </RowContainer>
    </RowContainer>
  )
}
