import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { Card } from '@material-ui/core'
import styled from 'styled-components'

import { backgrounds } from '../backgrounds'
import ComingSoon from '@components/ComingSoon'


const PTWrapper = styled(Card)`
  min-height: 100%;
  overflow-y: auto;
  overflow: auto;
  ${(props: { notScrollable: boolean }) =>
  props.notScrollable ? 'overflow:hidden;' : ''} width: calc(100% - 2rem);
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: calc(100vh - 130px);
`

storiesOf('Components/ComingSoon', module)
  .addDecorator(backgrounds)
  .add(
    'ComingSoon',
    withInfo()(() =>
    <PTWrapper>
      <ComingSoon />
    </PTWrapper>
  )
)
