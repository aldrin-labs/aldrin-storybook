import React from 'react'
import styled from 'styled-components'

import { Text } from '@sb/compositions/Addressbook'

const BlueText = styled(({ ...props }) => (
  <Text fontSize="1.2rem" {...props} />
))`
  cursor: pointer;
  color: ${(props) => props.theme.colors.green4};
`

export { BlueText }
