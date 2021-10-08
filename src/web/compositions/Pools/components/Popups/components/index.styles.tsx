import React from 'react'
import styled from 'styled-components'

import { Text } from '@sb/compositions/Addressbook'

const BlueText = styled(({ ...props }) => (
  <Text color={props.theme.palette.blue.serum} fontSize="1.2rem" {...props} />
))`
  cursor: pointer;
`

export { BlueText }
