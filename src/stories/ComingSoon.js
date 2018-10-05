import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { Card } from '@material-ui/core'

import ComingSoon from '@components/ComingSoon'

import styled from 'styled-components'

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

storiesOf('ComingSoon', module)
  .add(
    'ComingSoon',
    () =>
    <PTWrapper>
      <ComingSoon />
    </PTWrapper>
  )
