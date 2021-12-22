import React, { ReactNode } from 'react'
import { GroupLabelText, LabelWrap } from './styles'


interface GroupLabelProps {
  label: ReactNode
}


export const GroupLabel: React.FC<GroupLabelProps> = (props) =>
  <LabelWrap alignItems="center">
    <GroupLabelText>{props.label}</GroupLabelText>
  </LabelWrap>