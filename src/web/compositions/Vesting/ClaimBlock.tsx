import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import React from 'react'
import styled from 'styled-components'
import { BlockTemplate } from '../Pools/index.styles'

export const ClaimBlock = ({ theme }: { theme: any }) => {
  return (
    <BlockTemplate width={'50rem'} height={'50rem'} theme={theme}>
      <BtnCustom backgroundColor={'pink'}>нажми на меня</BtnCustom>{' '}
    </BlockTemplate>
  )
}
