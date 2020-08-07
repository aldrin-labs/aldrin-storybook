import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { TypographyFullWidth } from '@sb/styles/cssUtils'
import { Title } from '@sb/components/OldTable/Table'
import { Theme } from '@material-ui/core'

export const CardTitle = styled(TypographyFullWidth)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  line-height: 1rem;
  text-transform: capitalize;
  letter-spacing: 0.01rem;
  font-size: 1.3rem;
  text-align: center;
  color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.dark &&
      props.theme.palette.dark.main) ||
    '#16253D'};
`

export const TriggerTitle = styled(Title)`
  height: auto;
  line-height: 1rem;
  position: relative;
  padding: 1rem 0;
  transition: opacity 0.75s ease-in-out;
  background: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.grey &&
      props.theme.palette.grey.main) ||
    '#f2f4f6'};
  border-bottom: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.border &&
      props.theme.palette.border.main) ||
    '.1rem solid #e0e5ec'};
  border-radius: 0;

  &:hover {
    opacity: 0.85;
  }
`

const ChartCardHeader = ({
  children,
  style,
  theme,
  triggerTitleStyle,
}: {
  children?: React.Childern
  style?: CSSProperties
  triggerTitleStyle?: CSSProperties
  theme?: Theme
}) => {
  return (
    <TriggerTitle style={triggerTitleStyle} theme={theme}>
      <CardTitle style={style} variant="subtitle2" theme={theme}>
        {children}
      </CardTitle>
    </TriggerTitle>
  )
}

export default ChartCardHeader
