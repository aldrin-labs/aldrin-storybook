import React from 'react'
import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress'

// export const LinearProgressCustom = styled(({ color, height, ...rest }) => (
//   <LinearProgress {...rest} />
// ))`
 export const LinearProgressCustom = styled(LinearProgress)`
  background-color: ${(props) => props.color || '#E7ECF3'};
  border-radius: 10px;
  height: ${(props) => props.height};
`
