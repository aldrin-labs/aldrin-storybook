import React from 'react'
import styled from 'styled-components'

import { Text } from '@sb/compositions/Addressbook'

const BlueText = styled(({ ...props }) => (
  <Text color={'#53DF11'} fontSize={'1.2rem'} {...props} />
))`
  cursor: pointer;
`

export { BlueText }
